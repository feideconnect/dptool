"use strict";

var
	moment = require('moment'),
	express = require('express'),
	app = express(),
	openurl = require("openurl"),
	uuid = require('uuid'),
	url = require("url"),
	fs = require("fs"),
	path = require("path"),
	request = require('request');
var Promise = require('promise-polyfill');

var port = 12012;

var getPathFile = function(path) {
	return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'] + path;
}

var DataportenAuth = function(config, scopes) {
	this.config = config;
	this.state = uuid.v4();
	this.scopes = scopes;

	var cp = path.join(__dirname, "../templates/closing.html");
	// console.log(cp);
	this.closingPage = fs.readFileSync(cp);
};



DataportenAuth.prototype.getToken = function() {
	var configset = '';
	if (this.config.configset) {
		configset = '-' + this.config.configset;
	}
	var f = getPathFile("/.dptool-token" + configset + ".json");
	return JSON.parse(fs.readFileSync(f));
};

DataportenAuth.prototype.saveToken = function(token) {
	var configset = '';
	if (this.config.configset) {
		configset = '-' + this.config.configset;
	}
	var f = getPathFile("/.dptool-token" + configset + ".json");
	fs.writeFileSync(f, JSON.stringify(token, undefined, 2));
};

DataportenAuth.prototype.run = function(output) {
	this.setup(output)
		.then(function() {
			// console.log("Completely setup thing");
		});
};


DataportenAuth.prototype.configure = function(client_id, client_secret) {
	var object = {
		"client_id": client_id,
		"client_secret": client_secret
	};
	var configset = '';
	if (this.config.configset) {
		configset = '-' + this.config.configset;
	}
	var f = getPathFile("/.dptool-config" + configset + ".json");
	fs.writeFileSync(f, JSON.stringify(object, undefined, 2));
}

DataportenAuth.prototype.setup = function(output) {
	var that = this;
	return new Promise(function(resolve, reject) {
		app.get('/request', function(req, res) {
			var url = that.authrequest();
			res.redirect(url);
		});
		app.get('/callback', function(req, res) {
			// console.log("Req", req.query);

			that.processCallback(req.query.state, req.query.code, output)
				.catch(function(err) {
					console.error("error", err);

				})

			res.set('Content-Type', 'text/html');
			res.send(that.closingPage);
		});
		that.server = app.listen(port, function() {
			// console.log('Example app listening on port ' + port);

			var url = 'http://127.0.0.1:' + port + '/request';
			console.log("To authenticate, you need to open your browser at the following URL:");
			console.log("   " + url);
			console.log("We attempt to open the browser automatically. Waiting for successfull authentication...");
			console.log("Type Ctrl+C to cancel.");
			console.log();
			try {
				openurl.open(url);	
			} catch(err) {
				console.log("Error opening system browser:  " + err);
			}
			
			resolve();
		});

	});
}

DataportenAuth.prototype.processCallback = function(state, code, output) {
	var that = this;
	return new Promise(function(resolve, reject) {

		if (that.state !== state) {
			throw new Error("Invalid state parameter in response");
		}

		var opts = {
			"auth": {
				"user": that.config.client_id,
				"pass": that.config.client_secret,
				"sendImmediately": true
			},
			"form": {
				"grant_type": "authorization_code",
				"code": code,
				"client_id": that.config.client_id,
				"redirect_uri": that.config.redirect_uri
			}
		};

		// console.log("About to POST to ", that.config.token, opts);

		request.post(that.config.token, opts, function(error, response, body) {
			// console.log("RESPOOINSE ", body);
			if (error) {
				return reject(error);
			}
			if (response.statusCode !== 200) {
				return reject("Error. Status code " + response.statusCode);
			}

			var data = JSON.parse(body);
			// console.log("data");
			// console.log(data);

			if (!data.access_token) {
				throw new Error("Could not get Access Token is response");
			}

			var dur = data.expires_in;
			var durh = moment.duration(dur, "seconds").humanize();



			// process.env.DPTOOL_ACCESS_TOKEN = data.access_token;
			
			if (output) {
				console.log("Received token  valid for " + durh);
				console.log("- - - - - - - - - - - - - - - - - - ");
				console.log(data);
				console.log("- - - - - - - - - - - - - - - - - - ");
				console.log("export TOKEN=" + data.access_token);
			} else {
				that.saveToken(data);
			}
			that.server.close(function() {
				// console.log("Closed out remaining connections.");
				console.log("Successfully authenticated. Token is cached in an .dptool-token.json file and is valid for " + durh);
				process.exit()
			});
			resolve(data);
			process.exit()
		})

	});
};

DataportenAuth.prototype.authrequest = function() {

	var urlobj = url.parse(this.config.authorization, true);
	// console.log("baseauthurl", urlobj);
	urlobj.query.state = this.state;
	urlobj.query.client_id = this.config.client_id;
	urlobj.query.response_type = "code";
	urlobj.query.redirect_uri = this.config.redirect_uri;
	if (this.scopes) {
		urlobj.query.scope = this.scopes.join(' ');
	}

	var authorizationRequest = url.format(urlobj);
	// console.log("Authentication rquest URL " + authorizationRequest);
	return authorizationRequest;
}

exports.DataportenAuth = DataportenAuth;