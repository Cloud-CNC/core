/**
 * @fileoverview Restructured types
 */

/**
 * HTTP method
 */
export enum Method
{
  GET = 'get',
  PUT = 'put',
  POST = 'post',
  PATCH = 'patch',
  DELETE = 'delete'
}

/**
 * HTTP endpoint that acts upon an entity
 */
export interface Endpoint
{
  /**
   * Endpoint name
   */
  name: string;

  /**
   * Endpoint description
   */
  description: string;

  /**
   * Endpoint path
   */
  path: string;

  /**
   * Endpoint method
   */
  method: Method;
}

/**
 * Route parameter
 */
export interface Parameter
{
  /**
   * Parameter name
   */
  name: string;

  /**
   * Parameter description
   */
  description: string;
}

/**
 * Group of endpoints accessible under the same URL but a different HTTP method
 */
export interface Route
{
  /**
   * Route parameters
   */
  parameters: Parameter[];

  /**
   * Route endpoints
   */
  endpoints: Endpoint[];
}

/**
 * Group of related routes that act upon the same entity
 */
export interface Entity
{
  /**
   * Fully-qualified file locations
   */
  file: {
    model: string;
    routes: string;
  }

  /**
   * Entity name
   */
  name: string;

  /**
   * Entity description
   */
  description: string;

  /**
   * Entity routes
   */
  routes: Route[];
}