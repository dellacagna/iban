export class IBAN {
    private iban: string;

    constructor(iban: string) {
        this.iban = iban;
    }

    public isValid(): boolean {
        // remove spaces and dashes
        let iban = this.iban.replace(/[\s-]/g, '').toUpperCase();

        // check length and valid characters
        if (!/^[A-Z]{2}\d{2}[A-Z\d]{1,30}$/.test(iban)) {
            return false;
        }

        // move first 4 characters to end
        iban = iban.slice(4) + iban.slice(0, 4);

        // replace all letters with their number equivalents
        iban = iban.replace(/[A-Z]/g, (c) => {
            return (c.charCodeAt(0) - 55).toString();
        });

        // calculate mod 97
        return IBAN.mod97(iban) === 1;
    }

    private static mod97(a: string): number {
        let result = 0;
        for (const i of a) {
            result = (result * 10 + parseInt(i, 10)) % 97;
        }
        return result;
    }
}
