/*
 * pagefire
 * https://github.com/bart/pagefire
 *
 * Copyright (c) 2014 andrej bartko
 * Licensed under the MIT license.
 */

'use strict';

/**
 * paginateFire needs url to endless list
 * will store the current page
 * and be queried for next or previous
 *
 * optional arguments:
 * 		pageSize - default 10,
 *		order - 0 from last to first - in classic scneariu the newwest element is at th ebottom of the list
 *						1 from first to last - if elements are orgasnized by priority (date, score etc.);
 *
 */

var util = require('util');
var Emitter = require('events').EventEmitter;

var PageFire = module.exports = function(ref){

	//TODO this doesn't allow the V8 optimization
	var args = Array.prototype.slice.call(arguments).shift();

	this._pageSize = !!args[0] ? args[0] : 5;
	this._ref = ref;

  var self = this;

  this._page = null;
  this._currentPage = 0;
  this._last = null;
  this._first = null;
  this._previousLast = null;
	this._newest = null;
	this._oldest = null;

	console.log("page size: ", this._pageSize);

}

util.inherits(PageFire, Emitter);

PageFire.prototype.init = function(cb){
	var self = this;

	// gettting the last element in the list to initialize paginator
	self._ref
		.endAt()
		.limit(1)
		.once('child_added',function(result){
			console.log("result in child added", result.name());
			self._newest = result.name();
			// TODO - maybe get calling object and than call on it the result somehow
			this.emit("ready", this);
			// TODO
			// here to drop the PageFire instance into some navigator.
		}.bind(this));
	return this;
}

PageFire.prototype.first = function(cb){
  var self = this;

  self._ref
		.limit(this._pageSize)
    .once('value', function(result){
			var res = result.val();
			var keys = Object.keys(res);
      self._last = keys[0];
      self._first = keys[keys.length-1];
      self._page = res;
      cb(res);
    });
}

PageFire.prototype.next = function(cb){
  var self = this;

  self._ref
		.limit(self._pageSize)
    .endAt(self._first)
    .once('value', function(result){
      console.log(result);
      self._last = result[result.length-1].name();
      self._first = result[0].name();
      self._page = result;
      self._currentPage += 1;
      self._previousLast = self._last;
      cb(results);
    });
}

PageFire.prototype.previous = function(cb){
  var self = this;

  self._ref
		.limit(self._pageSize)
    .endAt(self._previousLast)
    .once('child_added', function(result){
      console.log(result);
      self._last = result[result.length-1].name();
      self._first = result[0].name();
      self._page = result;
      self._currentPage -= 1;
      cb(results);
    });
}
