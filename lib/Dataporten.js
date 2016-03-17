"use strict";

var
	fs = require("fs"),
	path = require("path"),
	url = require("url"),
	DataportenAuth = require('./DataportenAuth').DataportenAuth,
	API = require('./API').API,
	Display = require('./Display').Display,

	extend = require('extend');

var cliff = require('cliff');
var sortCount = function(a, b) {
	var attr = "count";
	var xa = a.hasOwnProperty(attr) ? a[attr] : null;
	var xb = b.hasOwnProperty(attr) ? b[attr] : null;

	if (xa > xb) {
		return 1;
	}
	if (xa < xb) {
		return -1;
	}
	return 0;
};

var getPathFile = function(path) {
	return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'] + path;
}


var Dataporten = function(argv) {
	this.argv = argv;

	var configset = '';
	if (argv.configset) {
		configset += '-' + argv.configset;
	}

	var cp = path.join(__dirname, "../etc/config.json");
	this.config = JSON.parse(fs.readFileSync(cp));

	if (argv.configset) {
		this.config.configset = argv.configset;
	}

	var xp = getPathFile("/.dptool-config" + configset + ".json");
	if (fs.existsSync(xp)) {

		var xconfig = JSON.parse(fs.readFileSync(xp));
		extend(this.config, xconfig);
		// console.error("Cannot find " + xp + ". dptool is not yet properly configured.");
		// process.exit(1);
	}
	// console.log("Configuration is ", JSON.stringify(this.config, undefined, 4));

	this.a = new DataportenAuth(this.config);
	this.display = new Display(argv);
	this.api = new API(this.config, this.a, this.argv);
};



Dataporten.prototype.auth = function() {
	this.a.run();
};

Dataporten.prototype.customAuth = function(client_id, client_secret) {
	var xconfig = {};
	extend(xconfig, this.config, {
		"client_id": client_id,
		"client_secret": client_secret
	});
	// console.log("Custom config is: ");
	// console.log(JSON.stringify(xconfig, undefined, 3));
	var xa = new DataportenAuth(xconfig);
	xa.run(true);
};



Dataporten.prototype.configure = function(id, secret) {
	this.a.configure(id, secret);
};



Dataporten.prototype.me = function() {

	return this.api.getItem({
		"component": "auth",
		"path": "/userinfo",
		// "url": "https://auth.dev.feideconnect.no/userinfo"
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

Dataporten.prototype.orgsCreate = function() {
	return this.api.postData({
		"component": "core",
		"path": "/orgs/"
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
Dataporten.prototype.orgLogoGet = function(orgid) {
	return this.api.getLogo({
		"component": "core",
		"path": "/orgs/" + orgid + "/logo"
	});
}
Dataporten.prototype.orgLogoSet = function(orgid) {
	return this.api.setLogo({
		"component": "core",
		"path": "/orgs/" + orgid + "/logo"
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

Dataporten.prototype.setRole = function(orgid, feideid, roles) {
	// console.log("Orgid ", orgid);
	// console.log("feideid ", feideid);
	// console.log("roles ", roles);
	return this.api.post({
		"component": "core",
		"path": "/orgs/" + orgid + "/roles/" + feideid,
		"method": "PUT"
	}, undefined, roles.split(','));
}

Dataporten.prototype.removeRole = function(orgid, feideid) {
	// console.log("Orgid ", orgid);
	// console.log("feideid ", feideid);
	// console.log("roles ", roles);
	return this.api.post({
		"component": "core",
		"path": "/orgs/" + orgid + "/roles/" + feideid,
		"method": "DELETE"
	});
}

Dataporten.prototype.ldapStatus = function(feideid) {
	var orgid = 'fc:org:' + feideid.split('@')[1];
	return this.api.post({
		"component": "core",
		"path": "/orgs/" + orgid + "/ldap_status?feideid=" + feideid,
		"method": "GET"
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
	var that = this;
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
		})
		.then(function(list) {

			if (that.argv.summary) {

				var res = {};
				for (var i = 0; i < list.length; i++) {
					if (res.hasOwnProperty(list[i].owner.id)) {
						res[list[i].owner.id].count++;
					} else {
						res[list[i].owner.id] = list[i].owner;
						res[list[i].owner.id].count = 1;
					}
				}
				var x = [];
				for (var key in res) {
					x.push(res[key]);
				}
				x.sort(sortCount);
				that.display.printTable(x, {
					"name": {},
					"count": {}
				});

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


Dataporten.prototype.gk = function(id, token, path) {
	// return this.api.getItem({
	// 	"component": "core",
	// 	"path": "/clientadm/clients/" + id
	// });

	var endp = this.api.getGKURL(id, path);
	var method = 'get'; // || 'get';
	var that = this;

	console.log("Contacting endpoint " + endp);
	console.log("Token " + token);

	return this.api.get(method, endp, null, token)
		.then(function(item) {
			that.display.showItem(item);
		});
};




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