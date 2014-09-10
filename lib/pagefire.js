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

var PageFire = module.exports = function(){
	//TODO this doesn't allow the V8 optimization
	var args = Array.prototype.slice.call(arguments);//.shift();

console.log("pagesize", args[1]);

	this._pageSize = !!args[1] ? args[1] : 5;
	this._ref = args[0];

  var self = this;

  this._page = null;
  this._currentPage = 0;
  this._last = null;
  this._first = null;
	this._newest = null;
	this._oldest = null;

	console.log("page size: ", this._pageSize);

}

util.inherits(PageFire, Emitter);

// TODO no need for init to get the first page
// but this would be usefull just to get the newest object in the list
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
    .endAt()
    .once('value', function(result){
			var res = result.val();
			var keys = Object.keys(res);
      self._last = keys[0];
      self._first = keys[keys.length-1];
      self._page = res;
      cb(res);
    });
}

/**
 * as we need a pointer which is the last key of the item in the previous list
 * so this needs to be the first key of the next list 
 * for this reason we always will have one item in previous and next list
 * which is not necessarily bad idea, at least it gives a context
 */
PageFire.prototype.next = function(cb){
  var self = this;

  self._ref
		.limit(self._pageSize)
    .endAt(null, self._last)
    .once('value', function(result){
			var res = result.val();
			var keys = Object.keys(res);
      self._last = keys[0];
      self._first = keys[keys.length-1];
      self._page = res;
      self._currentPage += 1;
      cb(res);
    });
}

/**
 *
 * TODO
 * the counter here might be way off as the list might change during iteration
 * we need a solid method to recognize whether (newest == first)
 */
PageFire.prototype.previous = function(cb){
  var self = this;

  self._ref
		.limit(self._pageSize)
    .startAt(null, self._first)
    .once('value', function(result){
			var res = result.val();
			var keys = Object.keys(res);
      self._last = keys[0];
      self._first = keys[keys.length-1];
      self._page = res;
			//TODO are we sotring this values in array or retrieveing it - what is less inconvinient???
      self._currentPage -= 1;
      cb(res);
    });
}

PageFire.prototype.isOnFisrPage = function(cb){
	return this._currentPage == 0;
}

PageFire.prototype.isOnLastPage = function(cb){
	// the last page always has less number of elements
	// as the last element is the first element of the next page
	return this._page.length < this._pageSize;
}
