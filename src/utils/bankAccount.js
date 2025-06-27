// Alternative: Using built-in normalize method (more concise)
const removeAccentsAndUppercase = (str) => {
    if (!str) return str;
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toUpperCase();
};

// Function to format number with commas

// Function to format bank account number with spaces every 4 digits
const formatBankAccountNumber = (value) => {
    if (!value) return '';
    // Remove all non-digits and spaces
    const numericValue = value.toString().replace(/\D/g, '');
    // Add spaces every 4 digits
    return numericValue.replace(/(\d{4})(?=\d)/g, '$1 ');
};

// Function to parse formatted bank account back to clean number
const parseBankAccountNumber = (formattedValue) => {
    if (!formattedValue) return '';
    return formattedValue.replace(/\s/g, '');
};

const bankNameList = [];

export { removeAccentsAndUppercase, formatBankAccountNumber, parseBankAccountNumber };
