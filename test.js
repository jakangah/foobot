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