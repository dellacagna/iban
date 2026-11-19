[![npm version](https://badge.fury.io/js/@dellacagna%2Fiban.svg)](https://badge.fury.io/js/@dellacagna%2Fiban)
[![CI](https://github.com/dellacagna/iban/actions/workflows/ci.yml/badge.svg)](https://github.com/dellacagna/iban/actions/workflows/ci.yml)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/dellacagna/iban/master/LICENSE)

# IBAN Library

A small, dependency-free TypeScript library for validating, formatting, parsing and generating IBAN numbers.

- Validates country, length, format and the ISO 7064 mod-97 checksum
- Formats IBANs for screen (`GB82 WEST 1234 5698 7654 32`) or machines (`GB82WEST12345698765432`)
- Extracts the BBAN and fields such as bank code, branch code and account number
- Generates random, valid IBANs for testing
- Supports 111 countries: every country in the [SWIFT IBAN Registry (ISO 13616)](https://www.swift.com/standards/data-standards/iban-international-bank-account-number), plus [countries that use IBAN outside the registry](#supported-countries)

## Installation

```sh
npm install @dellacagna/iban
```

## Usage

```ts
import { IBAN } from '@dellacagna/iban';

const iban = new IBAN('GB82 WEST 1234 5698 7654 32');

if (iban.isValid()) {
  console.log(iban.toPrintFormat()); // GB82 WEST 1234 5698 7654 32
} else {
  console.log(iban.getError()); // e.g. CHECKSUM_FAILED
}
```

CommonJS works too:

```js
const { IBAN } = require('@dellacagna/iban');
```

## API

### `new IBAN(iban: string)`

Creates an IBAN object. Input is case-insensitive, and spaces and hyphens are ignored.

### `isValid(): boolean`

Returns `true` for a valid IBAN or `false` if invalid.

```ts
const iban = new IBAN('GB82 WEST 1234 5698 7654 32');
iban.isValid(); // true
```

### `getError(): string | undefined`

Returns why the IBAN is invalid, or `undefined` if it is valid. The possible values are exported as `errorCodes`:

| `errorCodes`     | Value             | Meaning                                                |
| ---------------- | ----------------- | ------------------------------------------------------ |
| `invalidCountry` | `INVALID_COUNTRY` | The country code is not supported                      |
| `invalidLength`  | `INVALID_LENGTH`  | Wrong length for the country                           |
| `invalidFormat`  | `INVALID_FORMAT`  | Characters don't match the country's BBAN format       |
| `checksumFailed` | `CHECKSUM_FAILED` | The check digits are wrong (e.g. a typo in the number) |

```ts
import { IBAN, errorCodes } from '@dellacagna/iban';

const iban = new IBAN('GB82 WEST 1234');
iban.getError(); // 'INVALID_LENGTH'

if (iban.getError() === errorCodes.invalidLength) {
  // ...
}
```

### `getOriginal(): string`

Returns the original input, unchanged.

```ts
new IBAN('GB82 weST 123456987654   32').getOriginal(); // 'GB82 weST 123456987654   32'
```

### `toElectronicFormat(): string`

Returns the IBAN in upper case with all spaces and hyphens removed.

```ts
new IBAN('GB82 weST 123456987654   32').toElectronicFormat(); // 'GB82WEST12345698765432'
```

### `toPrintFormat(): string`

Returns the IBAN in upper case, in groups of four characters.

```ts
new IBAN('GB82 weST 123456987654   32').toPrintFormat(); // 'GB82 WEST 1234 5698 7654 32'
```

### `getBBAN(): string`

Returns the BBAN (Basic Bank Account Number): the IBAN without the country code and check digits.

```ts
new IBAN('GB82 WeST 1234 5698 7654 32').getBBAN(); // 'WEST12345698765432'
```

### `getFields(): Fields | undefined`

Returns the fields contained in the IBAN. Fields that don't apply to the country are left out. Returns `undefined` for unsupported countries and for countries with no published field layout.

```ts
interface Fields {
  countryCode: string;
  country: string;
  checkDigits: string;
  accountNumber?: string;
  currencyCode?: string;
  ownerAccountNumber?: string;
  accountNumberPrefix?: string;
  bankCode?: string;
  bicBankCode?: string;
  branchCode?: string;
  accountType?: string;
  nationalCheckDigit?: string;
}
```

```ts
new IBAN('BA39 1290 0794 0102 8494').getFields();
// {
//   countryCode: 'BA',
//   country: 'Bosnia and Herzegovina',
//   checkDigits: '39',
//   accountNumber: '94010284',
//   bankCode: '129',
//   branchCode: '007',
//   nationalCheckDigit: '94',
// }
```

`getFields()` does not check that the IBAN is valid; call `isValid()` first.

### `IBAN.random(countryCode?: string): string`

Generates a random IBAN with valid check digits, in print format. Pass a country code to choose the country; otherwise one is picked at random. The result is structurally valid but almost certainly not a real account, so it is only meant for tests and fake data.

```ts
IBAN.random(); // e.g. 'GB82 WEST 1234 5698 7654 32'
IBAN.random('IT'); // e.g. 'IT60 X054 2811 1010 0000 0123 456'
```

> If the country code is not supported, an IBAN for a random country is returned.

### Static helpers

The formatting methods are also available without creating an object:

```ts
IBAN.electronicFormat('gb82 west 1234 5698 7654 32'); // 'GB82WEST12345698765432'
IBAN.printFormat('GB82WEST12345698765432'); // 'GB82 WEST 1234 5698 7654 32'
IBAN.bban('GB82 WEST 1234 5698 7654 32'); // 'WEST12345698765432'
IBAN.extractFields('BA39 1290 0794 0102 8494'); // same as getFields()
```

## Supported countries

The library covers every country in the SWIFT IBAN Registry, including recent additions such as the Falkland Islands, Mongolia, Oman, Somalia and Yemen.

It also supports 23 countries that use IBAN but are not in the official registry. Their formats come from national banks and are not guaranteed by SWIFT, and `getFields()` returns `undefined` for them:

Algeria (DZ), Angola (AO), Benin (BJ), Burkina Faso (BF), Cabo Verde (CV), Cameroon (CM), Central African Republic (CF), Chad (TD), Comoros (KM), Congo (CG), Côte d'Ivoire (CI), Equatorial Guinea (GQ), Gabon (GA), Guinea-Bissau (GW), Honduras (HN), Iran (IR), Madagascar (MG), Mali (ML), Morocco (MA), Mozambique (MZ), Niger (NE), Senegal (SN), Togo (TG).

## Development

```sh
npm install
npm test          # Jest
npm run lint      # ESLint
npm run typecheck # tsc --noEmit
npm run build     # compile to dist/
```

## Resources

- [Changelog](https://github.com/dellacagna/iban/blob/master/CHANGELOG.md)
- [License](https://raw.githubusercontent.com/dellacagna/iban/master/LICENSE)
