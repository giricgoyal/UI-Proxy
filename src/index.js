const path = require('path')
const {
  PORT,
  SSL_CERT_PATH = path.resolve(__dirname, '../sslcert/server.crt'),
  SSL_CERT_KEY_PATH = path.resolve(__dirname, '../sslcert/server.key'),
  ...local_urls
} = process.env
const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router(path.resolve(__dirname, './db.json'))
const middlewares = jsonServer.defaults()
const routes = require('./routes.json')
const customMiddleware = require('./middleware')

const fs = require('fs');
const https = require('https');
const privateKey = fs.readFileSync(SSL_CERT_KEY_PATH, 'utf8');
const certificate = fs.readFileSync(SSL_CERT_PATH, 'utf8');
const {proxy_paths, apps, remotes} = require('./conf.json')
const overrides = require('./override-routes.json')
const credentials = {
  key: privateKey,
  cert: certificate,
  rejectUnauthorized: false
};

// Create Express App
const app = express();
// Logging
app.use(morgan('dev'));

const remoteUrls = Object.entries(remotes).reduce((accum, [key, value]) => {
  accum[`${local_urls[key]}`] = value
  return accum
}, {})

// Proxy endpoints

for (let [appName, spas] of Object.entries(apps)) {
  for (let {spa, port} of spas) {
    const url = !!spa ? `/${appName}/${spa}` : `/${appName}`
    app.use(url, createProxyMiddleware({
      target: `http://localhost:${port}/`,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        [`^/${appName}/${spa}`]: '',
      },
    }));
  }
}

app.use(`/`, createProxyMiddleware({
  target: 'https://devui.test.apps.ciena.com',
  changeOrigin: true,
  secure: false,
  ws: true,
  router: {...remoteUrls, ...overrides},
  logLevel: 'debug'
}));


const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT);


/**
 * JSON Server Code
 */

 server.use(middlewares)

 // Custom middleware code
 server.use(customMiddleware)

 // Use custom rewrite rules
 server.use(jsonServer.rewriter(routes))

 server.use(router)
 server.listen(3003, () => {
   console.log('JSON Server is up and running')
 })
