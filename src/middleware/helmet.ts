/**
 * @fileoverview Helmet security middleware
 */

//Imports
import compose from 'koa-compose';
import {contentSecurityPolicy, expectCt, frameguard, hsts, ieNoOpen, noSniff, permittedCrossDomainPolicies, referrerPolicy, xssFilter} from 'koa-helmet';
import {http} from '../lib/config';

//Middleware
const middlewares = [
  contentSecurityPolicy({
    directives: {
      defaultSrc: ['\'self\'']
    }
  }),
  referrerPolicy({
    policy: 'no-referrer'
  }),
  noSniff(),
  ieNoOpen(),
  frameguard({
    action: 'deny'
  }),
  permittedCrossDomainPolicies({
    permittedPolicies: 'none'
  }),
  xssFilter()
];

//TLS-only middleware
if (http.tls)
{
  middlewares.push(
    expectCt({
      enforce: true,
      maxAge: 86400
    }),
    hsts({
      includeSubDomains: false,
      maxAge: 15552000
    })
  );
}

//Compose
const middleware = compose(middlewares);

//Export
export default middleware;