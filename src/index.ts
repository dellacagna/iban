import { IbanSpecification, specifications } from './lib/specifications';
import { errorCodes, fieldChar } from './lib/constants';
import { Fields } from './lib/types';

export class IBAN {
  private readonly original: string;
  private error: string | undefined;

  constructor(iban: string) {
    this.original = iban;
  }

  public getOriginal(): string {
    return this.original;
  }

  public toElectronicFormat(): string {
    return IBAN.electronicFormat(this.original);
  }

  public toPrintFormat(): string {
    return IBAN.printFormat(this.original);
  }

  public getBBAN(): string {
    return IBAN.bban(this.original);
  }

  public getFields(): Fields | undefined {
    return IBAN.extractFields(this.original);
  }

  public getError(): string | undefined {
    if (!this.error) {
      this.isValid();
    }
    return this.error;
  }

  public isValid(): boolean {
    let iban = this.toElectronicFormat();
    const code = iban.slice(0, 2);
    const spec = IBAN.getCountrySpecification(code);

    if (!spec) {
      this.error = errorCodes.invalidCountry;
      return false;
    }

    if (iban.length !== spec.length) {
      this.error = errorCodes.invalidLength;
      return false;
    }

    const re = new RegExp('^[A-Z]{2}\\d{2}' + spec.formatRules.join(''));
    // check length and valid characters
    if (!re.test(iban)) {
      this.error = errorCodes.invalidFormat;
      return false;
    }

    // move first 4 characters to end
    iban = iban.slice(4) + iban.slice(0, 4);

    // replace all letters with their number equivalents
    iban = iban.replace(/[A-Z]/g, (c) => {
      return (c.charCodeAt(0) - 55).toString();
    });

    // calculate mod 97
    if (IBAN.mod97(iban) !== 1) {
      this.error = errorCodes.checksumFailed;
      return false;
    }

    return true;
  }

  private static getCountrySpecification(countryCode: string): IbanSpecification | null {
    const result = specifications.filter((spec) => spec.code === countryCode);
    return result ? result[0] : null;
  }

  private static getRandomCountrySpecification(): IbanSpecification {
    return specifications[Math.floor(Math.random() * specifications.length)];
  }

  private static mod97(a: string): number {
    let result = 0;
    for (const i of a) {
      result = (result * 10 + parseInt(i, 10)) % 97;
    }
    return result;
  }

  private static formatSpacing(iban: string, indices: number[]): string {
    for (const index of indices) {
      iban = iban.slice(0, index) + ' ' + iban.slice(index);
    }
    return iban;
  }

  public static electronicFormat(iban: string) {
    return iban.replace(/[\s-]/g, '').toUpperCase();
  }

  public static printFormat(iban: string) {
    iban = IBAN.electronicFormat(iban);
    const code = iban.slice(0, 2);
    const spec = IBAN.getCountrySpecification(code);
    if (!spec) {
      return iban;
    }
    return IBAN.formatSpacing(iban, spec.spacingRules);
  }

  public static bban(iban: string) {
    return IBAN.electronicFormat(iban).slice(4);
  }

  public static extractFields(iban: string): Fields | undefined {
    iban = IBAN.electronicFormat(iban);
    const code = iban.slice(0, 2);
    const check = iban.slice(2, 4);
    const spec = IBAN.getCountrySpecification(code);
    if (!spec || !spec.fields) {
      return;
    }

    const fields = {
      countryCode: code,
      country: spec.country,
      checkDigits: check,
      accountNumber: '',
      currencyCode: '',
      ownerAccountNumber: '',
      accountNumberPrefix: '',
      bankCode: '',
      bicBankCode: '',
      branchCode: '',
      accountType: '',
      nationalCheckDigit: '',
    };

    const bban = IBAN.bban(iban);
    spec.fields.split('').forEach((char, index) => {
      switch (char) {
        case fieldChar.accountNumber: {
          fields.accountNumber += bban[index];
          break;
        }
        case fieldChar.currencyCode: {
          fields.currencyCode += bban[index];
          break;
        }
        case fieldChar.ownerAccountNumber: {
          fields.ownerAccountNumber += bban[index];
          break;
        }
        case fieldChar.accountNumberPrefix: {
          fields.accountNumberPrefix += bban[index];
          break;
        }
        case fieldChar.bankCode: {
          fields.bankCode += bban[index];
          break;
        }
        case fieldChar.bicBankCode: {
          fields.bicBankCode += bban[index];
          break;
        }
        case fieldChar.branchCode: {
          fields.branchCode += bban[index];
          break;
        }
        case fieldChar.accountType: {
          fields.accountType += bban[index];
          break;
        }
        case fieldChar.nationalCheckDigit: {
          fields.nationalCheckDigit += bban[index];
          break;
        }
      }
    });

    // @ts-ignore
    Object.keys(fields).forEach((k) => fields[k] === '' && delete fields[k]);

    return fields;
  }

  public static random(countryCode: string | null = null): string {
    const spec = countryCode
      ? IBAN.getCountrySpecification(countryCode.toUpperCase())
      : IBAN.getRandomCountrySpecification();

    if (!spec) {
      return IBAN.random();
    }

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let bban = '';
    spec.formatRules.forEach((rule) => {
      const [type, repeat] = rule.slice(0, -1).split('{');
      for (let i = 0; i < +repeat; i++) {
        if (type === '[A-Z]') {
          bban += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        } else if (type === '\\d') {
          bban += Math.floor(Math.random() * 10);
        } else {
          bban += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
        }
      }
    });

    // Calculate Check Digit
    let tempIBAN = bban + spec.code + '00';
    tempIBAN = tempIBAN.replace(/[A-Z]/g, (c) => {
      return (c.charCodeAt(0) - 55).toString();
    });
    let checkDigit = (98 - IBAN.mod97(tempIBAN)).toString();
    checkDigit = checkDigit.length === 1 ? '0' + checkDigit : checkDigit;

    return IBAN.printFormat(spec.code + checkDigit + bban);
  }
}
