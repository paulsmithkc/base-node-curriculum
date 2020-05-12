const debug = require('debug')('app:server');
const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
  debug(`${request.method} ${request.url}`);

  const url = new URL(request.url, `http://${request.headers.host}`);
  switch (url.pathname) {
    case '/': {
      // Home Page
      serveStaticFile(response, '/index.html');
      break;
    }
    case '/contact': {
      // Contact Form
      if (request.method == 'POST') {
        let body = '';
        request.on('data', (chunk) => {
          body += chunk;
        });
        request.on('end', () => {
          debug(body);
          const params = querystring.parse(body);

          debug('Message Received!');
          debug(`\temail: ${params.email}`);
          debug(`\tsubject: ${params.subject}`);
          debug(`\tmessage: ${params.message}`);

          if (params.email && params.subject && params.message) {
            serveStaticFile(response, '/contact_sent.html');
          } else {
            serveStaticFile(response, '/contact_error.html');
          }
        });
      } else {
        serveStaticFile(response, '/contact.html');
      }
      break;
    }
    default: {
      // Otherwise, serve static files from public dir
      serveStaticFile(response, url.pathname);
      break;
    }
  }
});

server.listen(port, hostname, () => {
  debug(`Server running at http://${hostname}:${port}/`);
});

/**
 * Send a static file to the browser
 * @param {http.ServerResponse} response the server response object
 * @param {string} pathname the path that was requested (starts with /)
 */
function serveStaticFile(response, pathname) {
  const filename = __dirname + '/public' + pathname;
  fs.exists(filename, (exists) => {
    if (!exists) {
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/plain');
      response.end('FILE NOT FOUND');
      debug(`FILE NOT FOUND ${filename}`);
    } else {
      fs.readFile(filename, (err, data) => {
        if (err) {
          response.statusCode = 404;
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify(err));
          debug(`ERROR ${filename}`);
        } else {
          response.statusCode = 200;
          response.end(data);
          // debugFiles(`SERVED ${filename}`);
        }
      });
    }
  });
}