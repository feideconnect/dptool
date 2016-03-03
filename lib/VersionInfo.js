"use strict";

var
	fs = require("fs"),
	path = require("path"),
	url = require("url"),
	API = require('./API').API,
	Display = require('./Display').Display,

	extend = require('extend');


var cliff = require('cliff');


var getPathFile = function(path) {
	return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'] + path;
}



var VersionInfo = function(argv) {

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

	this.api = new API(this.config, this.a, this.argv);
	this.display = new Display(argv);
};


VersionInfo.prototype.getGit = function(repo, searchfor) {

	var endp = 'https://api.github.com/repos/' + repo + '/commits'; 
	var that = this;
	return this.api.getPublic('get', endp)
		.then(function(item) {
			var commits = [];
			var c = 0;
			for(var i = 0; i < item.length; i++) {

				var x = {};
				if (item[i].commit && item[i].commit.author) {
					x.author = item[i].commit.author.name;
				}
				if (item[i].commit) {
					x.message = item[i].commit.message;
				}
				x.sha = item[i].sha;
				// that.display.showItem(x);
				commits.push(x);
				if (++c > 25) {
					break;
				}
				if (searchfor === x.sha) {
					break;
				}
			} 

			that.display.showItem(commits);
			return item;
		});
};

VersionInfo.prototype.getAppVersion = function(repo) {

	var endp = 'https://grupper.dataporten.no/version'; 
	var that = this;
	return this.api.getPublic('get', endp)
		.then(function(data) {
			return data.app.git;
		})
		.then(function(item) {
			that.display.showItem(item);
			return item;
		});
};


VersionInfo.prototype.get = function() {
	var that = this;
	this.getAppVersion()
		.then(function(git) {
			return that.getGit('feideconnect/app-groups', git);
		})
		.catch(function(err) {
			console.error("Error", err)
		});
	
};


exports.VersionInfo = VersionInfo;
