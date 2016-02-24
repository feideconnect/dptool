"use strict";

var 
	fs = require("fs"),
	path = require("path"),
	url = require("url"),
	request = require('request'),
	DataportenAuth = require('./DataportenAuth').DataportenAuth,
	// OutputTable = require('./OutputTable').OutputTable,
	Table = require('easy-table');

var cliff = require('cliff');


var Display = function(argv) {
	this.argv = argv;
	// var cp = path.join(__dirname, "../etc/config.json");
	// this.config = JSON.parse(fs.readFileSync(cp));
	// this.a = new DataportenAuth(this.config);
};

Display.sort = {};
Display.sort.byItemString = function(attr) {
	return function(a, b) {

		var xa = a.hasOwnProperty(attr) ? a[attr] : null;
		var xb = b.hasOwnProperty(attr) ? b[attr] : null;

		if (xa > xb) { return 1; }
		if (xa < xb) { return -1; }
		return 0;
	};
};


Display.prototype.showItem = function(item) {
	if (this.argv.o) {
		this.putFile(this.argv.o, item);
	} else if (this.argv.json) {
		console.log(JSON.stringify(item, undefined, 2));
	} else {
		console.log(cliff.inspect(item));
	}
};
Display.prototype.storeLogo = function(item) {
	if (this.argv.o) {
		this.putFile(this.argv.o, item);
	} else {
		console.log("Will not show binary file on CLI. Use -o [filename] to store file to disk");
	}
};


Display.prototype.showList = function(list, tableopts, sortopts) {

	if (this.argv.sort) {
		list.sort(Display.sort.byItemString(this.argv.sort));
	}
	if (this.argv.reverse) {
		list.reverse();
	}
	if (this.argv.limit && list.length > this.argv.limit) {
		list = list.slice(0, this.argv.limit)
	}

	if (this.argv.pretty) {
		console.log(cliff.inspect(list));
	} else if (this.argv.json) {
		console.log(JSON.stringify(list, undefined, 2));
	} else {
		this.printTable(list, tableopts);
	}
};

Display.prototype.showData = function(data) {
	if (data) {
		console.log("API Output:");
		console.log(data);
	}
};

Display.prototype.printTable = function(data, opts) {
	var that = this;
	var t = new Table();
	data.forEach(function(row) {
		for(var key in opts) {
			if (row.hasOwnProperty(key)) {

				var data = row[key];
				if (opts[key].p) {
					// console.log("therei s a func", that.opts[key].p);
					data = opts[key].p(row);
				}
				t.cell(key, data);
			}
		}
		t.newRow();
	});
	console.log(t.toString());
	console.log("  --- " + data.length + " entries ---");
};




Display.prototype.putFile = function(filename, object) {
	var that = this;
	return new Promise(function(resolve, reject) {
		fs.writeFile(filename, JSON.stringify(object, undefined, 2), function(err) {
			if (err) {throw err;}
			console.log("Written output to " + filename);
			resolve();
		});
	});
}




exports.Display = Display;