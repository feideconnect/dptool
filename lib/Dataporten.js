"use strict";

var 
	fs = require("fs"),
	path = require("path"),
	url = require("url"),
	DataportenAuth = require('./DataportenAuth').DataportenAuth,
	API = require('./API').API;

var cliff = require('cliff');


var Dataporten = function(argv) {
	this.argv = argv;

	var cp = path.join(__dirname, "../etc/config.json");
	this.config = JSON.parse(fs.readFileSync(cp));
	this.a = new DataportenAuth(this.config);

	this.api = new API(this.config, this.a, this.argv);
};



Dataporten.prototype.auth = function() {
	this.a.run();
};




Dataporten.prototype.me = function() {
	
	return this.api.getItem({
		"component": "auth",
		"path": "/userinfo",
		"url": "https://auth.dev.feideconnect.no/userinfo"
	});
	// return this.get('', 'get', '/userinfo');
};




Dataporten.prototype.groups = function() {
	return this.api.getList({
		"component": "groups",
		"path": "/groups/me/groups"
	}, {
		"id": {},
		"displayName": {}
	});
}




Dataporten.prototype.orgs = function() {
	return this.api.getList({
		"component": "core",
		"path": "/orgs/"
	}, {
		"id": {},
		"name": {},
		"type": {},
		"services": {}
	});
}
Dataporten.prototype.org = function(id) {
	return this.api.getItem({
		"component": "core",
		"path": "/orgs/" + id
	});
}
Dataporten.prototype.orgServiceAdd = function(orgid, service) {
	return this.api.delete({
		"component": "core",
		"path": "/orgs/" + orgid + "/services/" + service,
		"method": "PUT"
	});
}
Dataporten.prototype.orgServiceRemove = function(orgid, service) {
	return this.api.delete({
		"component": "core",
		"path": "/orgs/" + orgid + "/services/" + service,
		"method": "DELETE"
	});
}

Dataporten.prototype.orgUpdate = function() {
	var that = this;
	this.api.getIdentifier("id")
		.then(function(id) {
			return that.api.postData({
				"component": "core",
				"path": "/orgs/" + id,
				"method": "PATCH"
			});
		});
}




Dataporten.prototype.apisAll = function() {
	return this.api.getList({
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
	return this.api.getList({
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

Dataporten.prototype.apisCreate = function() {
	return this.api.postData({
		"component": "core",
		"path": "/apigkadm/apigks/"
	});
}
Dataporten.prototype.apisUpdate = function() {
	var that = this;
	this.api.getIdentifier("id")
		.then(function(identifier) {
			return that.api.postData({
				"component": "core",
				"path": "/apigkadm/apigks/" + identifier,
				"method": "PATCH"
			});
		})
		.catch(function(err) {
			console.log("error", err);
		});
}

Dataporten.prototype.apiGet = function(id) {
	return this.api.getItem({
		"component": "core",
		"path": "/apigkadm/apigks/" + id
	})
		.catch(function(err) {
			console.log("error", err);
		});
}




Dataporten.prototype.apiDelete = function() {
	var that = this;
	this.api.getIdentifier("id")
		.then(function(identifier) {
			return that.api.delete({
				"component": "core",
				"path": "/apigkadm/apigks/" + identifier,
				"method": "DELETE"
			});
		})
		.catch(function(err) {
			console.log("error", err);
		});
}





Dataporten.prototype.clientsAll = function() {
	return this.api.getList({
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
	return this.api.getList({
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

Dataporten.prototype.clientsCreate = function() {
	return this.api.postData({
		"component": "core",
		"path": "/clientadm/clients/"
	});
}
Dataporten.prototype.clientsUpdate = function() {
	var that = this;
	this.api.getIdentifier("id")
		.then(function(identifier) {
			return that.api.postData({
				"component": "core",
				"path": "/clientadm/clients/" + identifier,
				"method": "PATCH"
			});
		})
}


Dataporten.prototype.client = function(id) {
	return this.api.getItem({
		"component": "core",
		"path": "/clientadm/clients/" + id
	});
}




Dataporten.prototype.clientDelete = function() {
	var that = this;
	this.api.getIdentifier("id")
		.then(function(identifier) {
			console.log("About to delete " + identifier);
			return that.api.delete({
				"component": "core",
				"path": "/clientadm/clients/" + identifier,
				"method": "DELETE"
			});
		})
		.catch(function(err) {
			console.log("error", err);
		});
}






exports.Dataporten = Dataporten;