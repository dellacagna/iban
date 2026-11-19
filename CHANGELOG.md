Changelog
=========

### 2.0.0

* Release TBD
  * **Breaking:** `IBAN.random()` throws a `RangeError` for unsupported country codes instead of returning an IBAN for a random country
  * **Breaking:** `getError()` returns the `errorCodes` enum type instead of `string` (runtime values unchanged)
  * **Breaking:** requires Node.js 18+; output targets ES2018 instead of ES5
  * **Breaking:** added an `exports` map, so deep imports into `dist/` are no longer possible
  * Ships native ES modules alongside CommonJS, each with its own type declarations
  * Added `IBAN.supportedCountries()` and `IBAN.isSupportedCountry()`
  * See the [migration guide](README.md#migrating-to-20)

### 1.2.0

* Release Nov 19, 2026
  * Added countries from recent SWIFT IBAN registry releases: Falkland Islands (FK), Mongolia (MN), Oman (OM), Somalia (SO) and Yemen (YE)
  * Updated Burundi (BI) to the 27-character registry format
  * Updated Nicaragua (NI) to the 28-character registry format
  * Fixed Jordan (JO) rejecting valid IBANs with letters in the account number
  * Added `bankCode` to the `Fields` type (it was already returned by `getFields()`)
  * `errorCodes` is now exported, along with the `Fields` and `IbanSpecification` types
  * Error codes and field characters are now regular enums instead of `const enum`, so they work with `isolatedModules` (Vite, esbuild, swc)
  * Format validation now anchors the end of the pattern
  * Tests cover every supported country, plus the SWIFT registry example IBANs for new and changed countries
  * Tooling: TypeScript 5, Jest 30, Prettier 3, ESLint (replacing the deprecated TSLint), GitHub Actions CI

### 1.1.1

* Release Jan 24, 2023
  * Fixed IBAN generator bug

### 1.1.0

* Release Jan 24, 2023
  * Added IBAN generator

### 1.0.0

* Release Jan 23, 2023
    * Added a country specification list for countries supporting IBAN to validate against
    * It is possible to format IBANs into electronic and print formats
    * Extract BBAN
    * Extract data from Iban such as BIC

### 0.0.1

* Release Jan 16, 2023
    * Initial Release supporting only checksum validation.
