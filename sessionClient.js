function SessionClient(){};

function ajaxPOST(url,async,dataObject,callback){
	var xhr = new XMLHttpRequest();
	var dataString = "";
	for(var item in dataObject){
		dataString += item + "=" + dataObject[item] + "&";
	}
	dataString = dataString.slice(0,-1);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			callback(xhr.responseText);
		}
	};
	xhr.open("POST",url,async);
	xhr.send(dataString);
	if(async == false){
		return xhr.responseText;
	}
}

SessionClient._sharedInstance = document.createElement("div");

SessionClient.init = function(){
	if(arguments[0]){
		if(arguments[0].charAt(0) != "/"){
			arguments[0] = "/" + arguments[0];
		}
	}
	var path = arguments[0] ? arguments[0] : "/session" + (Math.floor(Math.random()*90000000) + 10000000);
	if(!window.localStorage.path){
		var data = {
			type: "session",
			action:"init",
			path: path
		};
		ajaxPOST("/sessioninit",true, data,function(response){
			response = JSON.parse(response);
			if(response.status == 0){
				console.log('Succeed! The session operations will be transferred through "' + path + '".');
				window.localStorage.path = path;
			}
		});
	}
};

SessionClient.on = function(event,callback){
	this._sharedInstance.addEventListener(event,callback);
};

SessionClient.auth = function(){
	if(!window.localStorage.path){
		var fail = new CustomEvent("fail");
		SessionClient._sharedInstance.dispatchEvent(fail);
	}else{
		var data = {
			type: "session",
			action : "auth",
			cookie: document.cookie
		};

		ajaxPOST(window.localStorage.path,true, data,function(response){
			switch(response){
				case "success":{
					var success = new CustomEvent("success");
					SessionClient._sharedInstance.dispatchEvent(success);
					break;
				}
				default:{
					var fail = new CustomEvent("fail");
					SessionClient._sharedInstance.dispatchEvent(fail);
					break;
				}
			}
		});
	}
};

SessionClient.get = function(){
	if(!window.localStorage.path){
		var result = {
			status : 1,
			result: "The path to operate session is not set."
		};
		return JSON.stringify(result);
	}
	var data = {
		type:"session",
		action: "get",
		key: arguments[0]
	};
	if(!arguments[0]){
		data.key = "";
	}
	return ajaxPOST(window.localStorage.path,false,data,function(){});
};

SessionClient.add = function(key,value){
	if(!window.localStorage.path){
		throw new Error("The path to operate session is not set.");
	}
	var data = {
		type: "session",
		action: "add",
		key: key,
		value: value
	};
	ajaxPOST(window.localStorage.path,true,data,function(response){
		console.log(response);
	});
};

SessionClient.remove = function(key){
	if(!window.localStorage.path){
		throw new Error("The path to operate session is not set.");
	}
	var data = {
		type: "session",
		action: "remove",
		key: key
	};
	ajaxPOST(window.localStorage.path,true,data,function(response){
		console.log(response);
	});
};

SessionClient.stop = function(){
	if(!window.localStorage.path){
		throw new Error("The path to operate session is not set.");
	}
	var data = {
		type:"session",
		action:"stop"
	};
	ajaxPOST(window.localStorage.path,true,data,function(response){
		console.log(response);
	});
};

