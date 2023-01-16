import { IBAN } from '../index';

test('isValid IBAN', () => {
    let ibanObj = new IBAN('GB82 WEST 1234 5698 7654 32');
    expect(ibanObj.isValid()).toBe(true);
});

test('isInvalid IBAN', () => {
    let ibanObj = new IBAN('GB82 WEST 1234 5698 7654 ');
    expect(ibanObj.isValid()).toBe(false);
});
