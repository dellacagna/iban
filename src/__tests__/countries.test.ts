import { IBAN, errorCodes } from '../index';
import { specifications } from '../lib/specifications';

// Example IBANs from the SWIFT IBAN registry for countries added or changed in 1.2.0
const registryExamples: Record<string, string> = {
  BI: 'BI42 10000 10001 00003320451 81',
  FK: 'FK88 SC12 3456 7890 12',
  JO: 'JO94 CBJO 0010 0000 0000 0131 0003 02',
  MN: 'MN12 1234 1234 5678 9123',
  NI: 'NI45 BAPR 0000 0013 0000 0355 8124',
  OM: 'OM81 0180 0000 0129 9123 456',
  SO: 'SO21 1000 0010 0100 0100 141',
  YE: 'YE15 CBYE 0001 0188 6123 4567 8912 34',
  BY: 'BY13 NBRB 3600 9000 0000 2Z00 AB00',
  GT: 'GT82 TRAJ 0102 0000 0012 1002 9690',
  VA: 'VA59 0011 2300 0012 3456 78',
  XK: 'XK05 1212 0123 4567 8906',
};

describe.each(Object.entries(registryExamples))('registry example %s', (code, example) => {
  const iban = new IBAN(example);

  test('is valid', () => {
    expect(iban.getError()).toBeUndefined();
    expect(iban.isValid()).toBe(true);
  });

  test('round-trips through print format', () => {
    expect(IBAN.electronicFormat(iban.toPrintFormat())).toBe(iban.toElectronicFormat());
    expect(iban.getFields()?.countryCode).toBe(code);
  });
});

test('Jordan accepts alphanumeric account numbers', () => {
  expect(new IBAN(IBAN.random('JO')).isValid()).toBe(true);
});

test('getFields extracts bank, branch and account for new countries', () => {
  expect(new IBAN(registryExamples.SO).getFields()).toEqual({
    countryCode: 'SO',
    country: 'Somalia',
    checkDigits: '21',
    bankCode: '1000',
    branchCode: '001',
    accountNumber: '001000100141',
  });
  expect(new IBAN(registryExamples.FK).getFields()).toEqual({
    countryCode: 'FK',
    country: 'Falkland Islands',
    checkDigits: '88',
    bankCode: 'SC',
    accountNumber: '123456789012',
  });
});

test('error codes are exported', () => {
  expect(new IBAN('ZZ00 1234').getError()).toBe(errorCodes.invalidCountry);
  expect(errorCodes.checksumFailed).toBe('CHECKSUM_FAILED');
});

describe.each(specifications.map((s) => [s.code, s] as const))('specification %s', (code, spec) => {
  test('is internally consistent', () => {
    const bbanLength = spec.formatRules.reduce((n, rule) => n + Number(rule.match(/\{(\d+)\}$/)![1]), 0);
    expect(bbanLength).toBe(spec.length - 4);
    if (spec.fields) {
      expect(spec.fields).toHaveLength(spec.length - 4);
    }
  });

  test('random IBANs are valid and print without stray spaces', () => {
    for (let i = 0; i < 5; i++) {
      const printed = IBAN.random(code);
      expect(printed.slice(0, 2)).toBe(code);
      expect(printed).toBe(printed.trim());
      expect(printed).not.toMatch(/ {2}/);
      expect(new IBAN(printed).isValid()).toBe(true);
    }
  });
});

test('country codes are unique and sorted', () => {
  const codes = specifications.map((s) => s.code);
  expect(new Set(codes).size).toBe(codes.length);
  expect([...codes].sort()).toEqual(codes);
});
