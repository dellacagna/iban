import { IBAN } from '../index';

test('isValid IBAN', () => {
    let iban = new IBAN('GB82 WEST 1234 5698 7654 32');
    expect(iban.isValid()).toBe(true);
});

test('isInvalid IBAN', () => {
    let iban = new IBAN('GB82 WEST 1234 5698 7654 ');
    expect(iban.isValid()).toBe(false);
});
