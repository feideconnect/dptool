"use strict";

var 
	fs = require("fs"),
	path = require("path"),
	url = require("url"),
	request = require('request'),
	DataportenAuth = require('./DataportenAuth').DataportenAuth,
	OutputTable = require('./OutputTable').OutputTable;

var cliff = require('cliff');


var Dataporten = function(argv) {
	this.argv = argv;
	var cp = path.join(__dirname, "../etc/config.json");
	this.config = JSON.parse(fs.readFileSync(cp));
	this.a = new DataportenAuth(this.config);
};

Dataporten.prototype.auth = function() {
	this.a.run();
};

Dataporten.prototype.getURL = function(component, path) {
	var urlstr = component;
	if (this.config.apis.hasOwnProperty(component)) {
		urlstr = this.config.apis[component];
	}
	return url.resolve(urlstr, path);
}

Dataporten.prototype.get = function(method, endpoint, data) {
	var that = this;
	return new Promise(function(resolve, reject) {
		var token = that.a.getToken();
		var opts = {
			"auth": {
				"bearer": token.access_token
			},
			"json": true
		};

		request(endpoint, opts, function (error, response, body) {
			if (error) {
				return reject(error);
			}
			if (response.statusCode !== 200) {
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

Dataporten.prototype.getURL = function(opts) {
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

Dataporten.prototype.getList = function(opts, tableopts) {

	var endp = this.getURL(opts);
	var method = opts.method || 'get';
	var that = this;

	return this.get(method, endp)
		.then(function(list) {

			if (that.argv.json) {
				console.log(cliff.inspect(list));
			} else {
				var ot = new OutputTable(tableopts);
				ot.print(list);
			}
		});
};

Dataporten.prototype.getItem = function(opts, tableopts) {

	var endp = this.getURL(opts);
	var method = opts.method || 'get';
	var that = this;

	return this.get(method, endp)
		.then(function(item) {
			console.log(cliff.inspect(item));
		});
};

Dataporten.prototype.me = function() {
	
	return this.getItem({
		"component": "auth",
		"path": "/userinfo",
		"url": "https://auth.dev.feideconnect.no/userinfo"
	});
	// return this.get('', 'get', '/userinfo');
};

Dataporten.prototype.groups = function() {
	return this.getList({
		"component": "groups",
		"path": "/groups/me/groups"
	}, {
		"id": {},
		"displayName": {}
	});
}

Dataporten.prototype.orgs = function() {
	return this.getList({
		"component": "core",
		"path": "/orgs/"
	}, {
		"id": {},
		"name": {},
		"type": {},
		"services": {}
	});
}



Dataporten.prototype.apisAll = function() {
	return this.getList({
		"component": "core",
		"path": "/apigkadm/public"
	}, {
		"id": {},
		"name": {},
		"owner": {
			"p": function(item) {
				return item.owner.name;
			}
		},
		"redirect_uri": {
			"p": function(item) {
				var x = url.parse(item.redirect_uri[0]);
				return x.host;
				// return .substring(0, 30);
			}
		}
	});
}

Dataporten.prototype.apisMine = function() {
	return this.getList({
		"component": "core",
		"path": "/apigkadm/apigks/"
	}, {
		"id": {},
		"name": {},
		"owner": {
			"p": function(item) {
				return item.owner.name;
			}
		},
		"redirect_uri": {
			"p": function(item) {
				var x = url.parse(item.redirect_uri[0]);
				return x.host;
				// return .substring(0, 30);
			}
		}
	});
}

Dataporten.prototype.clientsAll = function() {
	return this.getList({
		"component": "core",
		"path": "/clientadm/public/"
	}, {
		"id": {},
		"name": {},
		"owner": {
			"p": function(item) {
				return item.owner.name;
			}
		},
		"redirect_uri": {
			"p": function(item) {
				var x = url.parse(item.redirect_uri[0]);
				return x.host;
				// return .substring(0, 30);
			}
		}
	});
}

Dataporten.prototype.clientsMine = function() {
	return this.getList({
		"component": "core",
		"path": "/clientadm/clients/"
	}, {
		"id": {},
		"name": {},
		"owner": {
			"p": function(item) {
				return item.owner.name;
			}
		},
		"organization": {},
		"redirect_uri": {
			"p": function(item) {
				var x = url.parse(item.redirect_uri[0]);
				return x.host;
				// return .substring(0, 30);
			}
		}
	});
}


Dataporten.prototype.client = function(id) {
	return this.getList({
		"component": "core",
		"path": "/clientadm/clients/" + id
	}, {
		"id": {},
		"name": {},
		"type": {},
		"services": {}
	});
}



exports.Dataporten = Dataporten;