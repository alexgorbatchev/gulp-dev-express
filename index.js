'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _child_process = require('child_process');

var _gulpUtil = require('gulp-util');

var _backoff = require('backoff');

var _backoff2 = _interopRequireDefault(_backoff);

exports['default'] = function (filepath) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var message = _ref.message;
  var initialDelay = _ref.initialDelay;
  var maxDelay = _ref.maxDelay;

  var server = undefined;
  var stopped = undefined;

  var expressBackoff = _backoff2['default'].fibonacci({
    initialDelay: isNaN(initialDelay) ? 1000 : initialDelay,
    maxDelay: isNaN(maxDelay) ? 15000 : maxDelay
  });

  function start() {
    stopped = false;
    server = (0, _child_process.fork)(filepath);

    server.on('message', function (msg) {
      return msg === (message || 'express ready') && expressBackoff.reset();
    });

    server.once('exit', function (code, signal) {
      if (signal === 'SIGKILL' && stopped) {
        start();
      } else if (code !== null && code !== 0) {
        (0, _gulpUtil.log)('Express exited with ' + code);
        expressBackoff.backoff();
      }
    });
  }

  function stop() {
    if (server) {
      server.kill('SIGKILL');
      server = undefined;
      stopped = true;
      expressBackoff.reset();
    }
  }

  function restart() {
    stop();
    start();
  }

  expressBackoff.on('ready', function () {
    return start(true);
  });
  expressBackoff.on('backoff', function (number, delay) {
    return (0, _gulpUtil.log)('Restarting express in ' + delay + 'ms');
  });

  start();

  return restart;
};

module.exports = exports['default'];

