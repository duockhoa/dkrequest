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
    if (!value) return '';
    // Remove all non-digits
    const numericValue = value.toString().replace(/\D/g, '');
    // Add commas every 3 digits
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Function to parse formatted number back to number
const parseFormattedNumber = (formattedValue) => {
    if (!formattedValue) return 0;
    return parseFloat(formattedValue.replace(/,/g, '')) || 0;
};

export { numberToVietnameseWords, formatNumberWithCommas, parseFormattedNumber };
