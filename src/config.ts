/**
 * @fileoverview App config
 * 
 * There are a few guiding principles for the config:
 * 1. There should be no required fields
 * 2. All values must be coerced, parsed, or validated
 * 3. All values should default to a sane, production-ready state (Unless this conflicts with #1, then warn the user)
 * 4. Use named exports
 */

//Imports
import 'dotenv/config';
import {existsSync} from 'fs';
import {randomBytes} from 'crypto';

//Fields
const auth = {
  secret: process.env.AUTH_SECRET || ''
};
const debug = process.env.NODE_ENV == 'development';
const port = parseInt(process.env.PORT || '', 10) || 80;
const pretty = !!process.env.PRETTY;
const tls = {
  enabled: !!process.env.TLS_ENABLED,
  certificate: process.env.TLS_CERTIFICATE,
  key: process.env.TLS_KEY
};

//Validate config
const entropy = 512;
if (Buffer.byteLength(auth.secret) < entropy)
{
  //Generate crypto-safe random secret
  auth.secret = randomBytes(entropy).toString();

  //Log
  console.warn('Auth secret was either too short or not provided, generating new secret!');
}

if (tls.enabled && (tls.certificate == null || !existsSync(tls.certificate)))
{
  //Crash
  throw `Invalid TLS certificate ${tls.certificate}!`;
}

if (tls.enabled && (tls.key == null || !existsSync(tls.key)))
{
  //Crash
  throw `Invalid TLS key ${tls.key}!`;
}

//Exports
export {
  auth,
  debug,
  port,
  pretty,
  tls
};