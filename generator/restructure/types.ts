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
 * HTTP request field
 */
export interface Field
{
  /**
   * Field name
   */
  name: string;

  /**
   * Field description
   */
  description: string;

  /**
   * Jou field type literal
   */
  joiType: string;

  /**
   * TypeScript field type literal
   */
  typescriptType: string;

  /**
   * Whether or not the field is required
   */
  required: boolean;
}

/**
 * Generic operation types
 */
enum OperationType
{
  ALL = 'all',
  CREATE = 'create',
  GET = 'get',
  UPDATE = 'update',
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
   * Endpoint operation type (If applicable)
   */
  type?: OperationType;

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

  /**
   * Endpoint body fields
   */
  fields: Field[];
}

/**
 * Path parameter
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