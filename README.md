[![npm version](https://badge.fury.io/js/@dellacagna%2Fiban.svg)](https://badge.fury.io/js/@dellacagna%2Fiban)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/dellacagna/iban/master/LICENSE)

# IBAN Library
A simple library for validating, formatting and generating fake IBAN numbers.

This library follows the [ISO 13616 IBAN Registry technical specification](https://www.swift.com/standards/data-standards/iban-international-bank-account-number) and supports 82 countries.

## Usage
### NodeJS
```
import { IBAN } from '../index';  
let iban = new IBAN('GB82 WEST 1234 5698 7654 32');
if (iban.isValid()) {
    console.log('The IBAN is valid)
}
```
