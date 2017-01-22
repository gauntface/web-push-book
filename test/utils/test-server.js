const path = require('path');
const express = require('express');
const serveIndex = require('serve-index');
const serveStatic = require('serve-static');

class TestServer {
  start(port) {
    if (this._server) {
      return Promise.reject(new Error('Server already started.'));
    }

    if (typeof port === 'undefined') {
      port = 0;
    }

    const siteDirectory = path.join(__dirname, '..', '..', 'build', '_site');
    this._app = express();
    this._app.use('/', express.static(siteDirectory));
    this._app.use(serveStatic(siteDirectory));
    this._app.use(serveIndex(siteDirectory, {view: 'details'}));

    return new Promise((resolve, reject) => {
      this._server = this._app.listen(port, 'localhost', () => {
        if (process.env.TRAVIS) {
          /* eslint-disable no-console */
          console.log(`[Debug Info] Test Server: ` +
            `http://localhost:${this._server.address().port}`);
          console.log('');
          /* eslint-enable no-console */
        }
        resolve(`http://localhost:${this._server.address().port}`);
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      this._server.close(resolve);
      this._server = null;
    });
  }
}

module.exports = new TestServer();
