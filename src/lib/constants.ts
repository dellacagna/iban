export const enum fieldChar {
  accountNumber = 'C',
  currencyCode = 'M',
  ownerAccountNumber = 'N',
  accountNumberPrefix = 'P',
  bicBankCode = 'Q',
  bankCode = 'B',
  branchCode = 'S',
  accountType = 'T',
  nationalCheckDigit = 'X',
}

export const enum errorCodes {
  invalidCountry = 'INVALID_COUNTRY',
  invalidLength = 'INVALID_LENGTH',
  invalidFormat = 'INVALID_FORMAT',
  checksumFailed = 'CHECKSUM_FAILED',
}
