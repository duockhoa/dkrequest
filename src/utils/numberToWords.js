// Function to convert number to Vietnamese words
const numberToVietnameseWords = (num) => {
    if (!num || num === 0) return '';

    const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const tens = [
        '',
        '',
        'hai mươi',
        'ba mươi',
        'bốn mươi',
        'năm mươi',
        'sáu mươi',
        'bảy mươi',
        'tám mươi',
        'chín mươi',
    ];
    const scales = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];

    const convertThreeDigits = (n) => {
        let result = '';
        const hundreds = Math.floor(n / 100);
        const remainder = n % 100;
        const tensDigit = Math.floor(remainder / 10);
        const onesDigit = remainder % 10;

        if (hundreds > 0) {
            result += ones[hundreds] + ' trăm';
        }

        if (tensDigit === 1) {
            result += (result ? ' ' : '') + 'mười';
            if (onesDigit === 5 && hundreds > 0) {
                result += ' lăm';
            } else if (onesDigit > 0) {
                result += ' ' + ones[onesDigit];
            }
        } else if (tensDigit > 1) {
            result += (result ? ' ' : '') + tens[tensDigit];
            if (onesDigit === 1) {
                result += ' một';
            } else if (onesDigit === 5) {
                result += ' lăm';
            } else if (onesDigit > 0) {
                result += ' ' + ones[onesDigit];
            }
        } else if (onesDigit > 0) {
            if (onesDigit === 1 && hundreds > 0) {
                result += (result ? ' ' : '') + 'một';
            } else {
                result += (result ? ' ' : '') + ones[onesDigit];
            }
        }

        return result.trim();
    };

    const numberStr = num.toString();
    const groups = [];

    // Split number into groups of 3 digits from right to left
    for (let i = numberStr.length; i > 0; i -= 3) {
        const start = Math.max(0, i - 3);
        groups.unshift(parseInt(numberStr.substring(start, i)));
    }

    let result = '';
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        const scaleIndex = groups.length - 1 - i;

        if (group > 0) {
            const groupWords = convertThreeDigits(group);
            if (result) result += ' ';
            result += groupWords;
            if (scaleIndex > 0 && scaleIndex < scales.length) {
                result += ' ' + scales[scaleIndex];
            }
        }
    }

    // Capitalize first letter
    return result.charAt(0).toUpperCase() + result.slice(1) + ' đồng';
};
const formatNumberWithCommas = (value) => {
    if (value === null || value === undefined || value === '') return '';

    const { integerPart, decimalPart, hasDecimalSeparator } = getFormattedNumberParts(value);
    const normalizedInteger = integerPart.replace(/^0+(?=\d)/, '') || '0';
    const formattedInteger = formatIntegerWithCommas(normalizedInteger);

    if (!hasDecimalSeparator) {
        return formattedInteger;
    }

    if (!decimalPart) {
        return value.toString().trim().endsWith('.') || value.toString().trim().endsWith(',')
            ? `${formattedInteger}.`
            : formattedInteger;
    }

    const normalizedDecimal = decimalPart.replace(/0+$/, '');

    if (!normalizedDecimal) {
        return formattedInteger;
    }

    return `${formattedInteger}.${normalizedDecimal}`;
};

// Function to parse formatted number back to number
const parseFormattedNumber = (formattedValue) => {
    if (formattedValue === null || formattedValue === undefined || formattedValue === '') return 0;

    const { integerPart, decimalPart, hasDecimalSeparator } = getFormattedNumberParts(formattedValue);
    const normalizedValue = `${integerPart || '0'}${hasDecimalSeparator ? `.${decimalPart}` : ''}`;

    return parseFloat(normalizedValue) || 0;
};

const formatIntegerWithCommas = (value) => {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const isCommaGroupedIntegerCandidate = (value) => {
    const groups = value.split(',');
    const lastGroup = groups[groups.length - 1];

    return (
        groups.length > 1 &&
        groups[0].length > 0 &&
        groups[0].length <= 3 &&
        lastGroup.length >= 3 &&
        groups.slice(1, -1).every((group) => group.length === 3)
    );
};

const getFormattedNumberParts = (value) => {
    const rawValue = value.toString().replace(/[^\d.,]/g, '');
    if (!rawValue) {
        return { integerPart: '', decimalPart: '', hasDecimalSeparator: false };
    }

    const commaIndex = rawValue.lastIndexOf(',');
    const dotIndex = rawValue.lastIndexOf('.');
    const hasComma = commaIndex !== -1;
    const hasDot = dotIndex !== -1;

    if (!hasComma && !hasDot) {
        return {
            integerPart: rawValue.replace(/\D/g, ''),
            decimalPart: '',
            hasDecimalSeparator: false,
        };
    }

    if (hasComma && !hasDot && isCommaGroupedIntegerCandidate(rawValue)) {
        return {
            integerPart: rawValue.replace(/\D/g, ''),
            decimalPart: '',
            hasDecimalSeparator: false,
        };
    }

    const decimalSeparatorIndex = hasDot ? dotIndex : commaIndex;
    const integerPart = rawValue.slice(0, decimalSeparatorIndex).replace(/\D/g, '');
    const decimalPart = rawValue.slice(decimalSeparatorIndex + 1).replace(/\D/g, '');

    return {
        integerPart,
        decimalPart,
        hasDecimalSeparator: true,
    };
};

const formatCurrencyAmountInput = (value) => {
    return formatNumberWithCommas(value);
};

const parseCurrencyAmountInput = (formattedValue) => {
    return parseFormattedNumber(formattedValue);
};

export {
    numberToVietnameseWords,
    formatNumberWithCommas,
    parseFormattedNumber,
    formatCurrencyAmountInput,
    parseCurrencyAmountInput,
};
