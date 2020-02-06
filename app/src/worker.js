/**
 * @fileoverview Workbox service worker
 */

//Imports
const {domain} = require('../../config.js').core;

//Disable logging
workbox.setConfig({
  debug: false
});

//SPA
workbox.routing.registerRoute(new workbox.routing.NavigationRoute(event =>
{
  return new workbox.strategies.CacheFirst().makeRequest({
    request: '/index.html'
  });
}));

//API
workbox.routing.registerRoute(new RegExp(`/https:\/\/${domain}`), new workbox.strategies.NetworkOnly());

//Static resources
workbox.routing.setDefaultHandler(new workbox.strategies.CacheFirst());