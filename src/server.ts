/**
 * @fileoverview HTTP server generator
 */

//Imports
import {createSecureServer as createHttp2Server} from 'http2';
import {createServer as createHttpServer} from 'http';
import {createServer as createHttpsServer} from 'https';
import {http} from './config';

//Export
export default () =>
{
  //Plain HTTP server
  if (!http.tls)
  {
    return createHttpServer();
  }
  //HTTPS server
  else if (!http.http2)
  {
    return createHttpsServer({
      cert: http.certificate,
      key: http.key
    });
  }
  //HTTP2 server
  else
  {
    return createHttp2Server({
      allowHTTP1: true,
      cert: http.certificate,
      key: http.key
    });
  }
};