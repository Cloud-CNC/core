/**
 * @fileoverview App config
 * 
 * There are a few guiding principles for the config:
 * 1. There should be no required fields
 * 2. All values must be coerced, parsed, or validated
 * 3. All values should default to a sane, production-ready state (Unless this conflicts with #1, then warn the user)
 * 4. If a value needs processing, it should be done here
 * 5. Use named exports
 */

//Imports
import 'dotenv/config';
import {existsSync, readFileSync} from 'fs';
import {randomBytes} from 'crypto';
import log from './log';

//Fatally log and crash
const panic = (message: string) =>
{
  //Log
  log.fatal(message);

  //Crash
  process.exit(1);
};

//Authentication
const auth = {
  secret: process.env.AUTH_SECRET || ''
};

//Debugging mode
const debug = process.env.NODE_ENV == 'development';

//HTTP
const http = {
  port: parseInt(process.env.PORT || '', 10) || 80,

  tls: !!process.env.TLS_ENABLED,
  certificate: process.env.TLS_CERTIFICATE,
  key: process.env.TLS_KEY,

  http2: !!process.env.HTTP2
};

//Pretty print log
const pretty = !!process.env.PRETTY;

//Redis URL (For multi-instance deployments)
const redisUrl = process.env.REDIS_URL;

//Validate config
const entropy = 512;
if (Buffer.byteLength(auth.secret) < entropy)
{
  //Generate crypto-safe random secret
  auth.secret = randomBytes(entropy).toString();

  //Log
  log.warn('Auth secret was either too short or not provided, generating new secret!');
}

if (http.http2 && !http.tls)
{
  //Panic with message
  panic('Cannot enable HTTP2 without TLS!');
}

if (http.tls && (http.certificate == null || !existsSync(http.certificate)))
{
  //Panic with message
  panic(`Invalid TLS certificate ${http.certificate}!`);
}
else if (http.tls)
{
  //Read certificate
  http.certificate = readFileSync(http.certificate!, 'utf-8');
}

if (http.tls && (http.key == null || !existsSync(http.key)))
{
  //Panic with message
  panic(`Invalid TLS key ${http.key}!`);
}
else if (http.tls)
{
  //Read key
  http.key = readFileSync(http.key!, 'utf-8');
}

if (redisUrl == null)
{
  //Log
  log.warn('Redis URL wasn\'t provided, running in single instance mode!');
}

//Exports
export
{
  auth,
  debug,
  http,
  pretty,
  redisUrl
};