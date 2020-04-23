/**
 * @fileoverview Docker Health Check
 */

//Imports
const config = require('config');
const https = require('https');
const syswideCA = require('syswide-cas');

//Enable self signed certificate
if (config.get('core.cryptography.selfSigned'))
{
  syswideCA.addCAs(config.get('core.cryptography.cert'));
}

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