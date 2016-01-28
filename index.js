#!/usr/bin/env node
"use strict";

var 
	Dataporten = require('./lib/Dataporten').Dataporten,
	argv = require('minimist')(process.argv.slice(2));


var CLI = function() {
	this.argv = argv;
	this.d = new Dataporten(this.argv);
};

CLI.prototype.c = function(cmd, cmd2) {
	if (this.argv._.length > 0 && this.argv._[0] === cmd) {
		if (cmd2) {
			if (this.argv._.length > 1 && this.argv._[1] === cmd2) {
				return true;
			}
		} else {
			return true;
		}
	}
	return false;
}

CLI.prototype.init = function() {
	if (this.argv.debug) {
		console.log("Parsed arguments ")
		console.dir(this.argv);
	}

	if (this.argv.help) {
		this.help();
	} else if(this.c('auth')) {
		this.d.auth();
	} else if(this.c('me')) {
		this.d.me();
	} else if(this.c('groups', 'me')) {
		this.d.groups();
	} else if(this.c('orgs', 'list')) {
		this.d.orgs();
	} else if(this.c('clients', 'all')) {
		this.d.clientsAll();
	} else if(this.c('clients', 'mine')) {
		this.d.clientsMine();
	} else if(this.c('apis', 'all')) {
		this.d.apisAll();
	} else if(this.c('apis', 'mine')) {
		this.d.apisMine();
	} else {
		console.log("No reckognized valid command...");
		console.log();
		this.help();
	}
}

CLI.prototype.help = function() {
	console.log(" dptool auth               Authenticate user.");
	console.log(" dptool me                 About me (userinfo).");
	console.log(" dptool groups me          List my groups.");
	console.log(" dptool clients all        List all clients.");
	console.log(" dptool clients mine       List my clients.");
	console.log(" dptool apis all           List all APIs.");
	console.log(" dptool apis mine          List my APIS.");
	console.log(" dptool orgs list          List organizations.");
	console.log(" dptool orgs get [orgid]   Show organization");
	console.log();
	console.log(" options: ");
	console.log("    --json    Print all info instead of simple listings..");
	console.log();
}


var c = new CLI();
c.init();
