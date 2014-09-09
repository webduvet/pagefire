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
var PAGE_SIZE = 5, NEW_ITEMS = PAGE_SIZE -1;

var testData = [
	{name:"Eric", surname:"Cartman"},
	{name:"Kenny", surname:"McCormicn"},
	{name:"Kyle", surname:"Broflovski"},
	{name:"Gerald", surname:"Broflovski"},
	{name:"Sheila", surname:"Broflovski"},
	{name:"Ike", surname:"Broflovski"},
	{name:"Stan", surname:"Marsh jr"},
	{name:"Herbert", surname:"Garisson"},
	{name:"Butters", surname:"Stotch"},
	{name:"Wendy", surname:"Testaburger"},
	{name:"Token", surname:"Black"},
	{name:"Randy", surname:"Marsh Ra"},
	{name:"Sharon", surname:"Marsh Sh"},
	{name:"Jimy", surname:"Valmer"},
	{name:"Timmy", surname:"Burch"},
	{name:"Clyde", surname:"Donovan"},
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
			//console.log(item_ref.name());
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

    'pageFire to contain valid firebase reference': function(test) {
      test.expect(2);
      var paginate = new(PageFire)(test_ref);
      test.ok(paginate._ref instanceof Firebase, "expcting new reference to JobbrAdminFire instance");
			test.equals(paginate._pageSize, PAGE_SIZE, "incorrect config for pageSize");
      test.done();
    },

		'instantiate pagefire with ._newest pointing to correct name': function(test) {
			test.expect(1);
      var paginate = new(PageFire)(test_ref);

			paginate
				.init()
				.on('ready', function(paginate){
					test.equals(paginate._newest, allIds[allIds.length-1], "expecting the newest key in the list, got this: " + paginate._newest);	
					test.done();
				});
		},

		'test get first page, get nextPage and get Previous Page' : function(test) {
			test.expect(8);
			var paginate = new(PageFire)(test_ref, PAGE_SIZE);
			paginate
				.init()
				.on('ready', function(paginate){
					paginate.first(function(result){
						var keys = Object.keys(result);
						test.ok(typeof result === 'object', "expecting object");
						test.equals(keys.length, PAGE_SIZE, "expecting '" + PAGE_SIZE + "' results ang got "+ keys.length);
						test.equals(result[keys[PAGE_SIZE-1]].surname, testData[testData.length-1].surname, "expecting the newest item be the first item in the list");
						test.equals(result[keys[0]].surname, testData[testData.length -1 - NEW_ITEMS].surname, "the last item on page is the fith item from the first");

						paginate.next(function(result){
							var keys = Object.keys(result);
							test.ok(typeof result === 'object', "expecting object");
							test.equals(keys.length, PAGE_SIZE, "expecting '" + PAGE_SIZE + "' results ang got "+ keys.length);
							test.equals(result[keys[PAGE_SIZE-1]].surname, testData[testData.length - 1 - NEW_ITEMS].surname, "expecting the newest item from next page  be the first item in the list");
							test.equals(result[keys[0]].surname, testData[testData.length-1 - 2*NEW_ITEMS].surname, "the last item on next page is the fith item from the first");

							paginate.previous(function(result){
								var keys = Object.keys(result);
								test.ok(typeof result === 'object', "expecting object");
								test.equals(keys.length, PAGE_SIZE, "expecting '" + PAGE_SIZE + "' results ang got "+ keys.length);
								test.equals(result[keys[PAGE_SIZE-1]].surname, testData[testData.length-1].surname, "expecting the newest item be the first item in the list");
								test.equals(result[keys[0]].surname, testData[testData.length -1 - NEW_ITEMS].surname, "the last item on page is the fith item from the first");

								test.done();
							});
						});

					});
				});
		}
  }
};
