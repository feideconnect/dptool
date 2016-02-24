"use strict";

var 
	fs = require("fs"),
	path = require("path"),
	url = require("url"),
	request = require('request'),
	Display = require('./Display').Display
	;

var cliff = require('cliff');


var API = function(config, auth, argv) {
	this.argv = argv;
	this.config = config;
	this.auth = auth;

	this.file = null;
	this.display = new Display(argv);

};

API.prototype.getIdentifier = function(idattr) {
	var that = this;
	return Promise.resolve()
		.then(function() {
			if (that.argv._[2]) {
				return that.argv._[2];
			} else {
				return that.getFile()
					.then(function(existing) {

						if (!existing[idattr]) {
							throw new Error("Could not find identifier [" + idattr + "] in existing object.");
						}
						return existing[idattr];
					});
			}
		})

}

API.prototype.getFile = function() {
	var that = this;
	return new Promise(function(resolve, reject) {

		if (that.file !== null) {
			return resolve(that.file);
		}

		if (that.argv.f) {
			// console.log("Opening file " + that.argv.f);

			if (!fs.existsSync(that.argv.f)) {
				throw new Error("Cannot open file " + that.argv.f);
			}

			fs.readFile(that.argv.f, "utf8", function(error, contents) {
			
				// console.log("Got data", contents);
				// console.log(contents.length);
				that.file = JSON.parse(contents);
				resolve(that.file);
			});		
		} else {
			fs.readFile("/dev/stdin", "utf8", function(error, contents) {
				// console.log("Got data", contents);
				// console.log(contents.length);
				that.file = JSON.parse(contents);
				resolve(that.file);
			});					
		}


	});
}

API.prototype.getRawFile = function() {
	var that = this;
	return new Promise(function(resolve, reject) {

		if (that.file !== null) {
			return resolve(that.file);
		}

		if (that.argv.f) {
			if (!fs.existsSync(that.argv.f)) {
				throw new Error("Cannot open file " + that.argv.f);
			}
			fs.readFile(that.argv.f, null, function(error, contents) {
				resolve(contents);
			});		
		} else {
			fs.readFile("/dev/stdin", null, function(error, contents) {
				resolve(contents);
			});					
		}


	});
}




API.prototype.getURL = function(component, path) {
	var urlstr = component;
	if (this.config.apis.hasOwnProperty(component)) {
		urlstr = this.config.apis[component];
	}
	return url.resolve(urlstr, path);
}

API.prototype.get = function(method, endpoint, data) {
	var that = this;
	return new Promise(function(resolve, reject) {
		var token = that.auth.getToken();
		var opts = {
			"auth": {
				"bearer": token.access_token
			},
			"json": true,
			"method": method.toUpperCase()
		};

		if (data) {
			opts.body = data;
		}

		request(endpoint, opts, function (error, response, body) {
			if (error) {
				return reject(error);
			}
			if (response.statusCode < 200 || response.statusCode > 299) {
				console.log(JSON.stringify(response, undefined, 2));
				console.log(body);
				return reject("Error. Status code " + response.statusCode);

			}
			resolve(body);
		});
	})
	.catch(function(err) {
		console.error("ERROR");
		console.error(err);
	});

};


API.prototype.getRaw = function(method, endpoint, data) {
	var that = this;
	return new Promise(function(resolve, reject) {
		var token = that.auth.getToken();
		var opts = {
			"auth": {
				"bearer": token.access_token
			},
			"method": method.toUpperCase(),
			"encoding": null
		};

		if (data) {
			opts.body = data;
		}

		request(endpoint, opts, function (error, response, body) {
			if (error) {
				return reject(error);
			}
			if (response.statusCode < 200 || response.statusCode > 299) {
				
				console.log(body);
				return reject("Error. Status code " + response.statusCode);
			}
			resolve(body);
		});
	})
	.catch(function(err) {
		console.error("ERROR");
		console.error(err);
	});

};


API.prototype.getURL = function(opts) {
	var urlstr;
	if (opts.hasOwnProperty("url")) {
		return opts.url;
	}
	if (opts.hasOwnProperty("component") && opts.hasOwnProperty("path")) {
		urlstr = this.config.apis[opts.component];
		return url.resolve(urlstr, opts.path);
	}
	if (opts.hasOwnProperty("gk") && opts.hasOwnProperty("path")) {
		return 'https://' + opts.gk + '.gk.feideconnect.no' + opts.path;
	}
	throw new Error("could not resolve URL for", opts);

}

API.prototype.getList = function(opts, tableopts) {

	var endp = this.getURL(opts);
	var method = opts.method || 'get';
	var that = this;

	return this.get(method, endp)
		.then(function(list) {
			that.display.showList(list, tableopts);
			return list;
		});
};

API.prototype.getItem = function(opts) {

	var endp = this.getURL(opts);
	var method = opts.method || 'get';
	var that = this;

	return this.get(method, endp)
		.then(function(item) {
			that.display.showItem(item);
		});
};

API.prototype.getLogo = function(opts) {

	var endp = this.getURL(opts);
	var method = opts.method || 'get';
	var that = this;

	return this.getRaw(method, endp)
		.then(function(item) {
			that.display.storeLogo(item);
		});
};
API.prototype.setLogo = function(opts, omethod) {

	var endp = this.getURL(opts);
	var method = opts.method || omethod || 'post';
	var that = this;

	this.getRawFile()
		.then(function(data) {
			return that.getRaw(method, endp, data)
				.then(function(item) {
					console.log("Done.");
				});
		});
};


API.prototype.postData = function(opts, omethod) {

	var data = '';

	var endp = this.getURL(opts);
	var method = opts.method || omethod || 'post';
	var that = this;

	this.getFile()
		.then(function(data) {
			return that.get(method, endp, data)
				.then(function(item) {
					that.display.showItem(item);
				});
		})

};

API.prototype.delete = function(opts, omethod) {

	var data = '';

	var endp = this.getURL(opts);
	var method = opts.method || omethod || 'delete';
	var that = this;

	return that.get(method, endp)
		.then(function(item) {
			that.display.showData(item);
		});

};





exports.API = API;