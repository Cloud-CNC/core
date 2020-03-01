/**
 * @fileoverview Static routes
 */

//Imports
const express = require('express');
const path = require('path');
const router = require('express').Router();

//Routes
router.use(express.static(path.resolve('./app/frontend/dist')));
router.use((req, res) =>
{
  return res.sendFile(path.resolve('./app/frontend/dist/index.html'));
});

//Export
module.exports = router;