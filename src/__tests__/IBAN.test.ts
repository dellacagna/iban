import { IBAN } from '../index';
import { errorCodes } from '../lib/constants';

const validIBANS = [
  {
    code: 'BA',
    original: 'BA39 1290 0794 0102 8494',
    electronic: 'BA391290079401028494',
    print: 'BA39 1290 0794 0102 8494',
    bban: '1290079401028494',
  },
  {
    code: 'BE',
    original: 'be685390 0754   7034',
    electronic: 'BE68539007547034',
    print: 'BE68 5390 0754 7034',
    bban: '539007547034',
  },
  {
    code: 'GB',
    original: ' GB82 WeST 12345698 7654 32',
    electronic: 'GB82WEST12345698765432',
    print: 'GB82 WEST 1234 5698 7654 32',
    bban: 'WEST12345698765432',
  },
  {
    code: 'GB',
    original: 'GB29 NWBK 6016 1331 9268 19',
    electronic: 'GB29NWBK60161331926819',
    print: 'GB29 NWBK 6016 1331 9268 19',
    bban: 'NWBK60161331926819',
  },
  {
    code: 'GE',
    original: 'GE29 NB00 0000 0101 9049 17  ',
    electronic: 'GE29NB0000000101904917',
    print: 'GE29 NB00 0000 0101 9049 17',
    bban: 'NB0000000101904917',
  },
];

test('isValid IBAN', () => {
  validIBANS.forEach((validIBAN) => {
    const iban = new IBAN(validIBAN.original);
    expect(iban.isValid()).toBe(true);
  });
});

test('isInvalid IBAN', () => {
  const iban = new IBAN('GB82 WEST 1234 5698 7654 ');
  expect(iban.isValid()).toBe(false);
});

test('error INVALID_COUNTRY', () => {
  const iban = new IBAN('ZA82 WEST 1234 5698 7654 32');
  expect(iban.getError()).toBe(errorCodes.invalidCountry);
});

test('error INVALID_LENGTH (Too Long)', () => {
  const iban = new IBAN('GB82 WEST 1234 5698 7654 333');
  expect(iban.getError()).toBe(errorCodes.invalidLength);
});

test('error INVALID_LENGTH (Too Short)', () => {
  const iban = new IBAN('GB82 WEST 1234 5698 7654');
  expect(iban.getError()).toBe(errorCodes.invalidLength);
});

test('error INVALID_FORMAT', () => {
  const iban = new IBAN('GB82 WEST 1234 56K8 7654 32');
  expect(iban.getError()).toBe(errorCodes.invalidFormat);
});

test('error CHECKSUM_FAILED', () => {
  const iban = new IBAN('GB82 WEST 1234 5628 7654 32');
  expect(iban.getError()).toBe(errorCodes.checksumFailed);
});

test('getOriginal', () => {
  validIBANS.forEach((validIBAN) => {
    const iban = new IBAN(validIBAN.original);
    expect(iban.getOriginal()).toBe(validIBAN.original);
  });
});

test('toElectronicFormat', () => {
  validIBANS.forEach((validIBAN) => {
    const iban = new IBAN(validIBAN.original);
    expect(iban.toElectronicFormat()).toBe(validIBAN.electronic);
  });
});

test('toPrintFormat', () => {
  validIBANS.forEach((validIBAN) => {
    const iban = new IBAN(validIBAN.original);
    expect(iban.toPrintFormat()).toBe(validIBAN.print);
  });
});

test('getBBAN', () => {
  validIBANS.forEach((validIBAN) => {
    const iban = new IBAN(validIBAN.original);
    expect(iban.getBBAN()).toBe(validIBAN.bban);
  });
});

test('getFields', () => {
  const iban = new IBAN('BA39 1290 0794 0102 8494');
  const expected = {
    countryCode: 'BA',
    country: 'Bosnia and Herzegovina',
    checkDigits: '39',
    accountNumber: '94010284',
    bankCode: '129',
    branchCode: '007',
    nationalCheckDigit: '94',
  };

  expect(iban.getFields()).toStrictEqual(expected);
});
