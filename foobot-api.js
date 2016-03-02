/**
 * Foobot Api
 * @param args *
 * @author Justice Adeenze-Kangah justice.adeenze@wesmart.com
 * @version 1
 * @copyright WeSmart Ltd.
 *
 */

var util = require('util');
var EventEmitter = require("events").EventEmitter;
var request = require('request');

var baseurl_america = "https://api-cn-north-1.foobot.io/";

var baseurl_global = "https://api.foobot.io/";

var version = "v2/";

var api_key;
var username;
var password;
var x_auth_token;


/**
 * @constructor
 * @param args
 */
var foobot = function (args) {
    EventEmitter.call(this);
    this.login(args);
};

util.inherits(foobot, EventEmitter);


foobot.prototype.handleRequestError = function (err, response, body, message, critical) {
    console.log(critical);

    return;

};

/**
 * Authentication API
 * POST /v2/user/{userName}/login/
 * @param args
 * @param callback
 * @returns {foobot}
 */
foobot.prototype.login = function (args, callback) {
    if (!args) {
        this.emit("error", new Error("Login 'args' not set."));
        return this;
    }

    if (!args.api_key) {
        this.emit("error", new Error("Login 'api_key' not set."));
        return this;
    }

    if (!args.username) {
        this.emit("error", new Error("Login 'user_name' not set."));
        return this;
    }

    if (!args.password) {
        this.emit("error", new Error("Login 'password' not set."));
        return this;
    }

    api_key = args.api_key;
    username = args.username;
    password = args.password;


    // Construct Url
    var url = baseurl_global + version + 'user/' + username + '/login/';

    var body = {
        password: password
    };


    request({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json;charset=UTF-8',
            'X-API-KEY': api_key
        },
        url: url,
        method: "POST",
        body: JSON.stringify(body),
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            throw err;
        }

        x_auth_token = response.headers['x-auth-token'];

        this.emit('login');

        body = JSON.parse(body);

        if (callback) {
            return callback(err , body);
        }

        return this;
    }.bind(this));

    return this;
};


/**
 * Identity API
 * GET /v2/owner/{userName}/device/
 * @param callback
 * @returns {*}
 */
foobot.prototype.identity = function (callback) {

    if (!x_auth_token) {
        return this.on('login', function () {
            this.identity(callback);
        });
    }

    // Construct Url
    var url = baseurl_global + version + 'owner/' + username + '/device/';

    var body = {
        "userName": username,
        "x-auth-token": x_auth_token
    };

    request({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json;charset=UTF-8',
            'X-API-KEY': api_key,
            'x-auth-token': x_auth_token
        },
        url: url,
        method: "GET",
        body: JSON.stringify(body),
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {

            throw err;
        }

        body = JSON.parse(body);

        this.emit('get-identity', err, body.body);

        if (callback) {
            return callback(err, body);
        }
        return this;

    }.bind(this));

    return this;
};


/**
 * Data Points API
 * GET /v2/device/{uuid}/datapoint/{period}/last/{sampling}/
 * @param callback
 * @returns {*}
 */
foobot.prototype.datapoints = function (args, callback) {

    if (!x_auth_token) {
        return this.on('login', function () {
            this.datapoints(args, callback);
        });
    }

    if (!args) {
        this.emit("error", new Error("device data 'args' not set."));
        return this;
    }

    if (!args.uuid) {
        this.emit("error", new Error("device data 'uuid' not set."));
        return this;
    }

    if (!args.period) {
        this.emit("error", new Error("device data 'period' not set."));
        return this;
    }

    if (!args.sampling) {
        this.emit("error", new Error("device data 'sampling' not set."));
        return this;
    }

    var uuid = args.uuid;
    var period = args.period;
    var sampling = args.sampling;

    var url = baseurl_global + version + 'device/' + uuid + '/datapoint/' + period + '/last/' + sampling + '/';

    request({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json;charset=UTF-8',
            'X-API-KEY': api_key,
            'x-auth-token': x_auth_token
        },
        url: url,
        method: "GET",

    }, function (err, response, body) {
        if (err || response.statusCode != 200) {

        }

        body = JSON.parse(body);

        this.emit('datapoints', err, body.body);

        if (callback) {
            return callback(err, body);
        }
        return this;

    }.bind(this));

    return this;
};


module.exports = foobot;