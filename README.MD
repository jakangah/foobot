Foobot
======

A node.js module to interface with the [foobot api](http://api.foobot.io/apidoc/index.html) API.

Getting Starting
---

1. Make sure you have a foobot account.
2. Make sure you have an api key.

Install
---

```sh
npm install foobot-api
```

Example
-------
```
var foobot = require('./foobot');

var auth = {
    "api_key": "",
    "username": "",
    "password": ""
}

var api = new foobot(auth);

// Login In

api.login(auth , function(err , response){

    console.log(response);
});

// Identity Api
api.identity(function(err , response){

    console.log(response);
});

// Data Points
var args = {
    uuid : "",
    period : "",
    sampling : ""
}
api.datapoints(args , function(err , response){

    console.log(response);
});
```

