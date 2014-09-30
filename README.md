# pagefire

[![Build Status](https://travis-ci.org/webduvet/pagefire.svg?branch=master)]

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
	.init()
	.on('ready',function(){});


```

## Documentation
PageFire needs to be initialized with valid Firebase reference. The application can have multiple instances of PageFires for different Firebase url.
.init initializes the pagefire and set the newest item on the list. PigeFire inhertits from EventEmitter so when the initialization is ready the 'ready' event is emitted.

Original Idea was to implement Promises but with events with works as well.

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 andrej bartko  
Licensed under the MIT license.
