/**
 * @fileoverview HTTP server factory
 */

//Imports
import {createSecureServer as createHttp2Server, Http2ServerRequest, Http2ServerResponse} from 'http2';
import {createServer as createHttpServer, IncomingMessage, ServerResponse} from 'http';
import {createServer as createHttpsServer} from 'https';
import {http} from './config';

//Generic HTTP server listener
type Listener = (req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse) => void;

//Export
export default (listener: Listener) =>
{
  //Plain HTTP server
  if (!http.tls)
  {
    return createHttpServer(listener);
  }
  //HTTPS server
  else if (!http.http2)
  {
    return createHttpsServer({
      cert: http.certificate,
      key: http.key,
      minVersion: 'TLSv1.2'
    }, listener);
  }
  //HTTP2 server
  else
  {
    return createHttp2Server({
      allowHTTP1: true,
      cert: http.certificate,
      key: http.key,
      minVersion: 'TLSv1.1'
    }, listener);
  }
};