Session
======



This is a simple tool to make easier web session operations. Suitable for Node.js server.

###How to use
Session is divided into two modules. SessionClient for client and SessionServer for server.

####SessionClient:
For client html pages that needs a session check(Login, Welcome, etc.), 
1. include **"sessionClient.js"** as the first script.
```vbscript-html
	<script type="text/javascript" src="session/sessionClient.js"></script>
	<script type="text/javascript" src="js/index.js"></script>
```
2. In your script for the page that act as the beginning of a session(such as login page), add the following line to initialize:
```javascript
SessionClient.init("customPath");
```

####SessionServer:
For Node.js server script
1. Require the module by calling : 
```javascript
var SessionServer = require("./(dir)/sessionServer.js");
```
2. Add the following line to initialize:
```javascript
SessionServer.init(yourServerObject);
```
###Basic API
``` javascript
SessionClient.init();
```
Call this method only in the script for your login page. The first parameter tells the session client and server to communicate using this path. If no parameters given, the path will be **'/session' + random 8 digit number**.

```javascript
SessionClient.auth();
```
This method will immediately start a session check, and invoke a "success" or "fail" event.

```javascript
SessionClient.on("success",function(){
	window.location = "/index";
});

//or

SessionClient.on("fail",function(){
	window.location = "/login";
});
```
Use this method to run commands when the session check is succeed or failed.

```javascript
SessionServer.init(server);
```
This will enable SessionServer on your created server. The first parameter cannot be NULL.

```javascript
SessionServer.start(5);
```
Call this method when you need to start a session,such as logging success. Using the first parameter to set the session to expire in N hours. If no parameters given, the default expiration time will be **1 hour**.

```javascript
SessionServer.stop(); 
```
Call this method when you need to stop a session, such as logging out.

###Data manipulation

Both SessionClient and SessionServer have implemented methods to manipulate custom session data. These methods includes:
```javascript
SessionClient.add("key","value");
SessionClient.get("key"); // When "key" is not given, this will return all custom data in Object.
SessionClient.remove("key");

SessionServer.add("key","value");
SessionServer.get("key"); // When "key" is not given, this will return all custom data in Object.
SessionServer.remove("key");
```

###Todo:
1. link to database: store session in database. when auth, query in database.

