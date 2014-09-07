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

var testItem = 1; //looking to get Kenny McCormic, this will be replaced with auto_id string

var allIds = new(Array);  // this is going to hold all new test IDs


function init(cb){
	test_ref.remove(function(){
		var counter = testData.length;
		allIds = new(Array);
		testData.forEach(function(item,index){
			var item_ref = test_ref.push(item,function(obj){
				counter--;
				if (counter === 0 ) {
					cb();
				}
			});
			allIds.push(item_ref.name());
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

    'need to instantiate it properly': function(test) {
      test.expect(1);
      var paginate = new(PageFire)(test_ref);
      test.ok(!!paginate, "expcting new reference to JobbrAdminFire instance");
      test.done();
    },

		'testing get user by user id': function(test) {
			test.expect(1);
      var paginate = new(PageFire)(test_ref);
			console.log('getting this one', allIds[1]);
			test_ref
				.child(allIds[1])
				.once('value', function(ss){
					console.log(ss.val());
					test.equals(ss.val().name, testData[1].name, "expecting '" + testData[1].name + "' and got '"+  ss.val().name + "'");
					test.done();
				});
		}
  }
};
