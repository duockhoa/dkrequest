import {
    formatCurrencyAmountInput,
    formatNumberWithCommas,
    parseCurrencyAmountInput,
    parseFormattedNumber,
} from './numberToWords';

describe('number formatting helpers', () => {
    test('uses comma grouping for every currency', () => {
        expect(formatNumberWithCommas('1234567')).toBe('1,234,567');
        expect(parseFormattedNumber('1,234,567')).toBe(1234567);
        expect(formatCurrencyAmountInput('1234567', 'VND')).toBe('1,234,567');
        expect(formatCurrencyAmountInput('1234567', 'USD')).toBe('1,234,567');
        expect(parseCurrencyAmountInput('1,234,567', 'VND')).toBe(1234567);
        expect(parseCurrencyAmountInput('1,234,567', 'USD')).toBe(1234567);
    });

    test('normalizes decimal comma input to decimal dot output', () => {
        expect(formatCurrencyAmountInput('1,2', 'USD')).toBe('1.2');
        expect(parseCurrencyAmountInput('1,2', 'USD')).toBe(1.2);
    });

    test('keeps decimal dot output and trims trailing zero decimals', () => {
        expect(formatCurrencyAmountInput('1.25', 'USD')).toBe('1.25');
        expect(formatCurrencyAmountInput('1.0', 'USD')).toBe('1');
        expect(formatCurrencyAmountInput('1.20', 'USD')).toBe('1.2');
        expect(parseCurrencyAmountInput('1.25', 'USD')).toBe(1.25);
    });

    test('uses comma grouping and decimal dot for larger values', () => {
        expect(formatCurrencyAmountInput('1234,5', 'USD')).toBe('1,234.5');
        expect(parseCurrencyAmountInput('1,234.5', 'USD')).toBe(1234.5);
        expect(formatCurrencyAmountInput('1000', 'USD')).toBe('1,000');
    });

    test('keeps allowing more digits after auto comma grouping while typing', () => {
        expect(formatCurrencyAmountInput('1,0000', 'USD')).toBe('10,000');
        expect(formatCurrencyAmountInput('10,0000', 'USD')).toBe('100,000');
        expect(formatCurrencyAmountInput('100,0000', 'USD')).toBe('1,000,000');
        expect(parseCurrencyAmountInput('1,0000', 'USD')).toBe(10000);
    });
});
