/**
 * @fileoverview Create tests
 */

//Imports
const create = require('../../../lib/create.js');
const expect = require('chai').expect;

//Data
const data = {
  key1: 'abc',
  key2: 'def',
  key3: 'ghi',
  key4: 'jkl'
};

//Export
module.exports = () =>
{
  it('shouldn\'t validate data', done =>
  {
    create(data, {
      key1: /^\w$/,
      key2: /^\w+$/,
      key3: /^\w+$/,
      key4: /^\w+$/
    }, {
      status: code =>
      {
        expect(code).to.equal(422);
        return {
          json: data =>
          {
            expect(data.error.name).to.equal('Invalid Parameter');
            expect(data.error.description).to.equal('"key1" must match the specified filter!');
            done();
          }
        };
      }
    });
  });

  it('should return a constructor with all properties', () =>
  {
    const constructor = create(data, {
      key1: /^\w+$/,
      key2: /^\w+$/,
      key3: /^\w+$/,
      key4: /^\w+$/
    });

    expect(constructor).to.eql({
      key1: 'abc',
      key2: 'def',
      key3: 'ghi',
      key4: 'jkl'
    });
  });

  it('should return a constructor with some properties', () =>
  {
    const constructor = create(data, {
      key1: /^\w+$/,
      key3: /^\w+$/
    });

    expect(constructor).to.eql({
      key1: 'abc',
      key3: 'ghi'
    });
  });

  it('should return a constructor with no properties', () =>
  {
    const constructor = create(data, []);
    expect(constructor).to.eql({});
  });
};