"use strict";

var Table = require('easy-table');


var OutputTable = function(opts) {
	this.opts = opts;
}

OutputTable.prototype.print = function(data) {
	var that = this;
	var t = new Table();


	data.forEach(function(row) {
		for(var key in that.opts) {
			if (row.hasOwnProperty(key)) {

				var data = row[key];
				if (that.opts[key].p) {
					// console.log("therei s a func", that.opts[key].p);
					data = that.opts[key].p(row);
				}
				t.cell(key, data);
			}
		}
		t.newRow();
	});
	console.log(t.toString());


}

exports.OutputTable = OutputTable;