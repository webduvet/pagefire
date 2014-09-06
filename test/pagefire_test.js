'use strict';

var Firebase = require('firebase');
var PageFire = require('../lib/pagefire.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

/**
 * TODO maybe to put this into some test settings
 * to avoid refering to my test account :)
 */
var test_ref = new Firebase('https://sagavera.firebaseio.com/pageFireTest');

var PageFireTests;

var testData = [
	{name:"Eric", surname:"Cartman"},
	{name:"Kenny", surname:"McCormicn"},
	{name:"Kyle", surname:"Broflowski"},
	{name:"Stan", surname:"March"},
	{name:"Herbert", surname:"Garisson"},
	{name:"Butters", surname:"Stotch"},
	{name:"Wendy", surname:"Testaburger"},
	{name:"Token", surname:"Black"},
	{name:"Babe", surname:"Stevensen"}
	];

var testItem = 3;



function init(cb){
	test_ref.remove(function(){
		var counter = testData.length;
		testData.forEach(function(item){
			var item_ref = test_ref.push(item,function(obj){
				counter--;
				if (counter === 0 ) {
					cb();
				}
			});
			console.log(item_ref.name());
			//item_ref.on('child_added', function(c){
			//	console.log(c.val());
			//});
		});
	});
}


module.exports = {
  'test PageFire': {
    'setUp': function(done) {
      // setup here
			init(function(){
				done();
			});
    },

    'do we have the firebase reference?': function(test) {
      test.expect(1);
      var paginate = new(PageFire)(test_ref);
      test.ok(!!paginate, "expcting new reference to JobbrAdminFire instance");
      test.done();
    },

  }
};
