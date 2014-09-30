# pagefire

![Build Status](https://travis-ci.org/webduvet/pagefire.svg?branch=master)

paginator for firebase endless ordered list
While it probably can be used as moodule on client side it is designed
to work on node.js server to create API. Originally ot was a part of a bigger
private project, but I thought this small part could be shared. 

## Getting Started
Install the module with: `npm install pagefire`

```javascript
var Pagefire = require('pagefire');

var pagefire = new(PageFire)(firebase_ref, SET_PAGE_SIZE);
pagefire
	.next()
	.then(function(page){}, function(reason){});


```

## Documentation
PageFire needs to be initialized with valid Firebase reference. The application can have multiple instances of PageFires for different Firebase url.
It can be instances of the same conection or diferent connection.
.next() method returns promise to get the next page.  The last item of the previous page is always the first item of the last page.
This is because firebase does not have queries for number of items in the list and the page can be queried either by priority or by id. Typically the push By ID list 
is ordered by autoID with the latest item at the end. Pagefire lists the latest item as the first.

later implementation will take options for latest first - last items as well as option to order the list by priorities.

note:
This is promise based verion. The original event - callback version is in v0.0.3.

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
v0.0.3 event-callback version, see the branch


## License
Copyright (c) 2014 andrej bartko  
Licensed under the MIT license.
