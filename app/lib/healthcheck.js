/**
 * @fileoverview Docker Health Check
 */

//Imports
const https = require('https');
const syswideCA = require('syswide-cas');
const {core} = require('../../config');

//Enable self signed certificate
syswideCA.addCAs(core.cert);

//Test
https.get({host: '127.0.0.1', port: 443, timeout: 10}, res =>
{
  if (res.statusCode == 200)
  {
    process.exit(0);
  }
  else
  {
    console.error(res.statusCode);
    process.exit(1);
  }
}).on('error', err =>
{
  console.error(err);
  process.exit(1);
});