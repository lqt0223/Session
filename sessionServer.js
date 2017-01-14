var querystring = require("querystring");
function SessionServer(){};

SessionServer.init = function(server){
	server.on("request",function(request,response){
		var path = request.url.split("?")[0];
		request.on("data",function(data){
			var params = querystring.parse(data.toString());
			if(params.type == "session"){
				if(path == "/sessioninit" && params.action == "init"){
					SessionServer._path = params.path;
					response.write(JSON.stringify({
						status: 0
					}));
					response.end();
				}else if(path == SessionServer._path){
					switch(params.action){
						case "auth":{
							response.write(SessionServer._auth(request) ? "success" : "fail");
							response.end();
							break;
						}
						case "stop":{
							response.write(SessionServer.stop());
							response.end();
							break;
						}
						case "get": {
							response.write(SessionServer.get());
							response.end();
							break;
						}
						case "add": {
							response.write(SessionServer.add(params.key,params.value));
							response.end();
							break;
						}
					}
				}else{
					response.end();
				}
			}
		});
	});
};

SessionServer._auth = function(request){
	this._checkExpire();
	if(!this._sharedInstance){
		return false;
	}else{
		var cookie = request.headers["cookie"];
		if(!cookie){
			return false;
		}else{
			var cookieId = cookie.match(/SESSIONID=[^ ;]+/g)[0];
			cookieId = cookieId.split("=")[1];
			if(cookieId == this._sharedInstance._id){
				return true;
			}else{
				return false;
			}
		}
	}
};

SessionServer.start = function(hour){
	hour ? this._update(hour) : this._update(1) ;
	return this._exportSessionID();
};

SessionServer.stop = function(){
	delete this._sharedInstance;
	return (!this._sharedInstance ? "stopped": "fail");	
};

SessionServer.get = function(key){
	var output = {};
	if(this._sharedInstance){
		if(key){
			output.result = this._sharedInstance._data[key];
			output.status = 0;

			return JSON.stringify(output);
		}else{
			output.result = this._sharedInstance._data;
			output.status = 0;
			return JSON.stringify(output);	
		}
	}else{
		output.result = ""
		output.status = 1;
		return JSON.stringify(output);	
	}
};

SessionServer.add = function(key,value){
	if(this._sharedInstance){
		this._sharedInstance._data[key] = value;
		return '"' + value + '" for key "' + key + '" has been added.';
	}else{
		return "Failed in adding data. The session is not initialized."
	}
};

SessionServer.remove = function(key){
	if(this._sharedInstance){
		delete this._sharedInstance.data[key];
		return '"' + key + '" has been removed.';
	}else{
		return "Failed in removing data. The session is not initialized.";
	}
}

SessionServer._path = "";

SessionServer._checkExpire = function(){
	var now = new Date().getTime();
	if(this._sharedInstance){
		if(now > this._sharedInstance._expire){
			this.stop();
		}
	}
};


SessionServer._update = function(hour){
	var now = new Date().getTime();
	this._sharedInstance = {
		_id: Math.random().toString(16),
		_created: now,
		_expire: now + hour * 3600000,
		_data: {}
	};
};

SessionServer._exportSessionID = function(){
	return "SESSIONID=" + this._sharedInstance._id;
};

module.exports = SessionServer; 