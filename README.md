[![npm version](https://badge.fury.io/js/@dellacagna%2Fiban.svg)](https://badge.fury.io/js/@dellacagna%2Fiban)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/dellacagna/iban/master/LICENSE)

# IBAN Library
A simple library for validating, formatting and generating fake IBAN numbers.

This library follows the [ISO 13616 IBAN Registry technical specification](https://www.swift.com/standards/data-standards/iban-international-bank-account-number) and supports 107 countries.

## Usage
### NodeJS
```ts
import { IBAN } from '../index';  
let iban = new IBAN('GB82 WEST 1234 5698 7654 32');
if (iban.isValid()) {
    console.log('The IBAN is valid');
}
```
## API
### isValid()
Returns **true** for a valid IBAN or **false** if invalid.

example:
```ts
let iban = new IBAN('GB82 WEST 1234 5698 7654 32');
if (iban.isValid()) {
    console.log('The IBAN is valid');
}
```

### getError()
If the IBAN is invalid, one of the following errors will be returned as a string:
```
INVALID_COUNTRY
INVALID_LENGTH
INVALID_FORMAT
CHECKSUM_FAILED
```


example:
```ts

let iban = new IBAN('GB82 WEST 1234');
if (!iban.isValid()) {
    console.log(!iban.getError()); //prints INVALID_LENGTH
}
```

### getOriginal()
Returns the original unformatted IBAN that was used to instantiate the object.

example:
```ts
let iban = new IBAN('GB82 weST 123456987654   32');
let unformatted = iban.getOriginal()
console.log(unformatted); //prints GB82 weST 123456987654   32
```

### toElectronicFormat()
Returns the IBAN capitalized with all spaces removed.

example:
```ts
let iban = new IBAN('GB82 weST 123456987654   32');
let formatted = iban.toElectronicFormat()
console.log(formatted); //prints GB82WEST12345698765432
```

### toPrintFormat()
Returns the IBAN capitalized with spaces placed as per country format.

example:
```ts
let iban = new IBAN('GB82 weST 123456987654   32');
let formatted = iban.toPrintFormat()
console.log(formatted); //prints GB82 WEST 1234 5698 7654 32
```

### getBBAN()
Returns the BBAN (Basic Bank Account Number) capitalized with all spaces removed.

example:
```ts
let iban = new IBAN('GB82 WeST 1234 5698 7654 32');
let bban = iban.getBBAN()
console.log(bban); //prints WEST12345698765432
```

### getFields()
Returns an object with extracted information from a valid IBAN. Empty keys will not be returned:

```
{
  countryCode: string;
  country: string;
  checkDigits: string;
  accountNumber?: string;
  currencyCode?: string;
  ownerAccountNumber?: string;
  accountNumberPrefix?: string;
  bicBankCode?: string;
  branchCode?: string;
  accountType?: string;
  nationalCheckDigit?: string;
 }
```

example:
```ts
let iban = new IBAN('BA39 1290 0794 0102 8494');
let fields = iban.getFields()
console.log(fields);

/* This will output:
  {
    countryCode: 'BA',
    country: 'Bosnia and Herzegovina',
    checkDigits: '39',
    accountNumber: '94010284',
    bankCode: '129',
    branchCode: '007',
    nationalCheckDigit: '94',
 } 
*/
```
### random()
Generate a random IBAN number and return it as a string in print format. You can optionally pass the country code to specify a random IBAN for that country

example (random country):
```ts
let iban = IBAN.random();
console.log(iban); //example output: GB82 WEST 1234 5698 7654 32
```

example (specified country):
```ts
let iban = IBAN.random('IT');
console.log(iban); //example output: IT60 X054 2811 1010 0000 0123 456
```

## Resources
* [Changelog](https://github.com/dellacagna/iban/blob/master/CHANGELOG.md)
* [License](https://raw.githubusercontent.com/dellacagna/iban/master/LICENSE)
