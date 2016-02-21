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

	for (var i = 0; i < arguments.length; i++) {
		if (i > this.argv._.length) {
			return false;
		}
		if (this.argv._[i] !== arguments[i]) {
			return false;
		}

	}

	return true;
}

CLI.prototype.init = function() {
	if (this.argv.debug) {
		console.log("Parsed arguments ")
		console.dir(this.argv);
	}

	if (this.argv.help) {
		this.help();
	} else if (this.c('configure')) {
		this.d.configure(this.argv._[1], this.argv._[2]);
	} else if (this.c('auth')) {
		this.d.auth();
	} else if (this.c('me')) {
		this.d.me();
	} else if (this.c('groups', 'me')) {
		this.d.groups();
	} else if (this.c('orgs', 'list')) {
		this.d.orgs();
	} else if (this.c('orgs', 'get')) {
		this.d.org(this.argv._[2]);
	} else if (this.c('orgs', 'service', 'add')) {
		this.d.orgServiceAdd(this.argv._[3], this.argv._[4]);
	} else if (this.c('orgs', 'service', 'remove')) {
		this.d.orgServiceRemove(this.argv._[3], this.argv._[4]);
	} else if (this.c('orgs', 'update')) {
		this.d.orgUpdate();
	} else if (this.c('clients', 'all')) {
		this.d.clientsAll();
	} else if (this.c('clients', 'mine')) {
		this.d.clientsMine();
	} else if (this.c('clients', 'get')) {
		this.d.client(this.argv._[2]);
	} else if (this.c('clients', 'delete')) {
		this.d.clientDelete();
	} else if (this.c('clients', 'create')) {
		this.d.clientsCreate();
	} else if (this.c('clients', 'update')) {
		this.d.clientsUpdate();
	} else if (this.c('apis', 'all')) {
		this.d.apisAll();
	} else if (this.c('apis', 'mine')) {
		this.d.apisMine();
	} else if (this.c('apis', 'get')) {
		this.d.apiGet(this.argv._[2]);
	} else if (this.c('apis', 'delete')) {
		this.d.apiDelete();
	} else if (this.c('apis', 'create')) {
		this.d.apisCreate();
	} else if (this.c('apis', 'update')) {
		this.d.apisUpdate();
	} else {
		console.log("No reckognized valid command...");
		console.log();
		this.help();
	}
}

CLI.prototype.help = function() {
	console.log(" dptool configure [id] [secret]          Configure your CLI client.");
	console.log(" dptool auth                             Authenticate user.");
	console.log();
	console.log(" dptool me                               About me (userinfo).");
	console.log(" dptool groups me                        List my groups.");
	console.log();
	console.log(" dptool clients all                      List all clients.");
	console.log(" dptool clients mine                     List my clients.");
	console.log(" dptool clients get [id]                 Get specific client");
	console.log(" dptool clients delete [id]              Delete specific client");
	console.log(" dptool clients create -f [filename]     Register new client");
	console.log(" dptool clients update -f [filename]     Update existing client");
	console.log();
	console.log(" dptool apis all                         List all APIs.");
	console.log(" dptool apis mine                        List my APIS.");
	console.log(" dptool apis get [id]                    Get specific API");
	console.log(" dptool apis delete [id]                 Delete specific API");
	console.log(" dptool apis create -f [filename]        Register new API");
	console.log(" dptool apis update -f [filename]        Update existing API");
	console.log();
	console.log(" dptool orgs list                        List organizations.");
	console.log(" dptool orgs get [orgid]                 Show organization");
	console.log(" dptool orgs update -f [filename]        Update organization");
	console.log(" dptool orgs service add [orgid] [srv]   Add service for an org");
	console.log(" dptool orgs service remove [orgid] [srv] Remove service for an org");
	console.log("        [srv] may be one of auth, pilot, avtale ");
	console.log();
	console.log(" options: ");
	console.log("    --json     Print all info instead of simple listings..");
	console.log("    --pretty   Pretty print JSON with colours..");
	console.log("    --o [file] Output JSON to file");
	console.log("    --configset [set] Read from .dptool-config-[set].json ");
	console.log("    --sort [field]    Sort by specific field");
	console.log("    --reverse         Reverse sort");
	console.log("    --limit [num]     Limit rows");
	console.log();
	console.log(" experimental: ");
	console.log("    --summary         List numbers of clients per user (only for clients all)");
	console.log();
}


var c = new CLI();
c.init();