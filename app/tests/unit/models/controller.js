/**
 * @fileoverview Controller model tests
 */

//Imports
const expect = require('chai').expect;
const model = require('../../../models/controller.js');

//Export
module.exports = () =>
{
  it('should reject null parameters', async () =>
  {
    const doc = new model();
    await doc.validate(err =>
    {
      expect(err).to.not.be.null;
    });
  });

  it('should accept valid parameters', async () =>
  {
    const doc = new model({
      name: 'abc',
      key: 'at592VFeO0ogmSOalVNHGTpw8TcXpZFgySWVTlHYhLIqHQbMO2fh63HihfSd8Zgx53WS6G2NbSX5sLUeNCJPN3evPePTGCI9YgbzwGWiEJg0M25mCGIfPsbrXN0qTGQO4sbgZWJQGEExKZttXCgOwY47Lb42zCBB9RKXO9XnO6DJcx6YRuRhVSS7wcxMp5rBOGZ4li2Zl2gM30upbZstzfTh06SHwE2HIut30FAgjA572xzvFtkyqP0kgcfuM9A0GEDJaVNFYAgd08FczeAyB3jn61nR5INn80td5nm3jMToIsVMwjonojL9ytYV1yh4eu0Xje7xppBP51AZKayscFsOaFp4VHuocfKSdcAGsDPqEXZxUBGGQTZvCnrLIrdIseuYKLR7CdDFUaeLqz3B9Hl600I5gvmFKfmW8KywKxlJQhEWwPEpSOTxS4N6y6T9MRGRq5pX12h2eVYSHrKgP9ReBOBha1WEd7o9akw2RhMHuzohOpoY1EHUnCbWa6MD'
    });
    await doc.validate(err =>
    {
      expect(err).to.be.null;
    });
  });
};