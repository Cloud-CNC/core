/**
 * @fileoverview Update tests
 */

//Imports
const expect = require('chai').expect;
const update = require('../../../lib/update.js');

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
    update(data, {}, {
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

  it('should update all properties', () =>
  {
    const doc = {
      key1: 'opq',
      key2: 'rst',
      key3: 'uvw',
      key4: 'xyz'
    };

    update(data, doc, {
      key1: /^\w+$/,
      key2: /^\w+$/,
      key3: /^\w+$/,
      key4: /^\w+$/
    });

    expect(doc).to.eql(data);
  });

  it('should update some properties', () =>
  {
    const doc = {
      key1: 'opq',
      key2: 'rst',
      key3: 'uvw',
      key4: 'xyz'
    };

    update(data, doc, {
      key1: /^\w+$/,
      key3: /^\w+$/
    });

    expect(doc).to.eql({
      key1: 'abc',
      key2: 'rst',
      key3: 'ghi',
      key4: 'xyz'
    });
  });

  it('should update no properties', () =>
  {
    const doc = {
      key1: 'opq',
      key2: 'rst',
      key3: 'uvw',
      key4: 'xyz'
    };

    update(data, doc, {});

    expect(doc).to.eql(doc);
  });
};