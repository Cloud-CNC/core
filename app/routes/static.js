/**
 * @fileoverview Static routes
 */

//Imports
const parcel = require('parcel');
const path = require('path');
const router = require('express').Router();

//Bundler
const bundler = new parcel(['./app/src/index.html', './app/src/worker.js'], {
  logLevel: process.env.NODE_ENV == 'development' ? 1 : 2,
  watch: process.env.NODE_ENV == 'development',
  hmr: false,
  outDir: './app/dist/'
});

//Routes
router.use(bundler.middleware());
router.use((req, res) =>
{
  return res.sendFile(path.resolve('./app/dist/index.html'));
});

//Export
module.exports = router;