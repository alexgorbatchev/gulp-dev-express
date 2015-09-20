import {fork} from 'child_process';
import {log} from 'gulp-util';
import backoff from 'backoff';

export default function (filepath, {message, initialDelay, maxDelay} = {}) {
  let server;
  let stopped;

  const expressBackoff = backoff.fibonacci({
    initialDelay: isNaN(initialDelay) ? 1000 : initialDelay,
    maxDelay: isNaN(maxDelay) ? 15000 : maxDelay
  });

  function start() {
    stopped = false;
    server = fork(filepath);

    server.on('message', (msg) => msg === (message || 'express ready') && expressBackoff.reset());

    server.once('exit', function (code, signal) {
      if (signal === 'SIGKILL' && stopped) {
        start();
      } else if (code !== null && code !== 0) {
        log(`Express exited with ${code}`);
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

  expressBackoff.on('ready', () => start(true));
  expressBackoff.on('backoff', (number, delay) => log(`Restarting express in ${delay}ms`));

  start();

  return restart;
}
