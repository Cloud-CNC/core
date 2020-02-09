/**
 * @fileoverview Static routes
 */

//Imports
const parcel = require('parcel');
const path = require('path');
const router = require('express').Router();

//Bundler
const dev = process.env.NODE_ENV == 'development';
const bundler = new parcel(['./app/src/index.html', './app/src/worker.js'], {
  hmr: false,
  logLevel: dev ? 1 : 2,
  minify: !dev,
  outDir: './app/dist/',
  watch: dev
});

//Routes
router.use(bundler.middleware());
router.use((req, res) =>
{
  return res.sendFile(path.resolve('./app/dist/index.html'));
});

//Export
module.exports = router;