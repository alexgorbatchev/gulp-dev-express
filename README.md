# gulp-dev-express

[![NPM downloads](https://img.shields.io/npm/dt/gulp-dev-express.svg)](https://npmjs.org/package/gulp-dev-express)
[![GitTip](http://img.shields.io/gittip/alexgorbatchev.svg)](https://gittip.com/alexgorbatchev)
[![Dependency status](https://img.shields.io/david/alexgorbatchev/gulp-dev-express.svg)](https://david-dm.org/alexgorbatchev/gulp-dev-express)
[![devDependency Status](https://img.shields.io/david/dev/alexgorbatchev/gulp-dev-express.svg)](https://david-dm.org/alexgorbatchev/gulp-dev-express#info=devDependencies)
[![Build Status](https://img.shields.io/travis/alexgorbatchev/gulp-dev-express.svg)](https://travis-ci.org/alexgorbatchev/gulp-dev-express)

This is a [gulp](http://gulpjs.com) plugin that restars [Express.js](http://expressjs.com/) server using a fibonacci backoff. This is useful when you want to monitor server files for changes and restart Express server. Why do this? If your server fails to start for whatever reason, you don't want to continuously hammer on it trying to restart it in a loop. When you make a change and server start up, the backoff will reset.

## Installation

```sh
npm install gulp-dev-express
```

## Usage Example

`gulpfile.js` example:

```javascript
var gulp = require('gulp');
var express = require('gulp-dev-express');

gulp.task('dev', function () {
  gulp.watch('src/**/*.js', express('src/server.js'));
});
```

`server.js` needs to call `process.send()` to let the watcher know that it's ready:

```javascript
var express = require('express');
var app = express();

...

app.listen(3000, function () {
  process.send && process.send('express ready');
});
```

## API

### express(serverFilePath, {message, initialDelay, maxDelay})

* `serverFilePath` is a string file path to the express server.
* `message` is a string with default value of `express ready` that server needs to `process.send` when it's ready.
* `initialDelay` is a number of ms by at which fibonacci back off begins its delay.
* `maxDelay` is a number of ms at which finobachi backoff will max out its delay.

## License

The MIT License (MIT)

Copyright 2015 Alex Gorbatchev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
