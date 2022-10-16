import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import 'localstorage-polyfill';
import {withCache} from '@ngx-ssr/cache/express';
import {LRUCache} from '@ngx-ssr/cache';

// const domino = require('domino');
// const fs = require('fs');
// const path = require('path');
//
// const distFolder1 = join(process.cwd(), 'dist/angular-ui/browser');
// const template = fs.readFileSync(path.join(distFolder1, 'index.html')).toString();

// const win = domino.createWindow(template.toString());
global['localStorage'] = localStorage;
// global['window'] = win;
// global['document'] = win.document;
// global['self'] = win;
// global['IDBIndex'] = win.IDBIndex;
// global['document'] = win.document;
// global['navigator'] = win.navigator;
// global['getComputedStyle'] = win.getComputedStyle;

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/angular-ui/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  // server.engine('html', ngExpressEngine({
  //   bootstrap: AppServerModule,
  // }));

  server.engine('html',
    withCache(
      new LRUCache({maxAge: 10 * 60_000, maxSize: 100}),
      ngExpressEngine({
        bootstrap: AppServerModule,
      })
    ));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });

  /**
   * MAIN BASE GET PATH
   */

  server.get('/callback/**', (req, res) => {
    res.send('<div style="width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center"><h1 style="color: blueviolet">API RUNNING...</h1><p style="color: lightcoral">Powered by SOFTLAB IT TEAM</p></div>');
  });

  server.post('/callback/payment/cancel', (req, res) => {
    res.redirect(301, 'https://esquireelectronicsltd.com/payment/cancel');
    // console.log(req.body);
    // res.status(200).json({
    //   data: req.body,
    //   message: 'Data Retrieved Successfully!'
    // });

  });

  server.post('/callback/payment/success', (req, res) => {

    res.redirect(301, 'https://esquireelectronicsltd.com/payment/success');
    // console.log(req.body);
    // res.status(200).json({
    //   data: req.body,
    //   message: 'Data Retrieved Successfully!'
    // });

  });

  server.post('/callback/payment/fail', (req, res) => {

    res.redirect(301, 'https://esquireelectronicsltd.com/payment/fail');
    // console.log(req.body);
    // res.status(200).json({
    //   data: req.body,
    //   message: 'Data Retrieved Successfully!'
    // });

  });

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    // console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
