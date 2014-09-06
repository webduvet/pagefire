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
var PageFire = module.exports = function(ref){

	var args = arguments.shift();

	this._pageSize = args[0];
	this._ref = ref;

  var self = this;

  this._page = null;
  this._currentPage = 0;
  this._last = null;
  this._first = null;
  this._previousLast = null;

}

PaginateFire.prototype.first = function(cb){
  var self = this;

  ref.limit(pageSize)
    .once('child_added', function(result){
      console.log(result);
      self._last = result[result.length-1].name();
      self._first = result[0].name();
      self._page = result;
      cb(result);
    });
}

PaginateFire.prototype.next = function(cb){
  var self = this;

  self._ref.limit(self._pageSize)
    .endAt(self._first)
    .once('child_added', function(result){
      console.log(result);
      self._last = result[result.length-1].name();
      self._first = result[0].name();
      self._page = result;
      self._currentPage += 1;
      self._previousLast = self._last;
      cb(results);
    });
}

PaginateFire.prototype.previous = function(cb){
  var self = this;

  self._ref.limit(self._pageSize)
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
