export const FUEL_PAYMENT_TYPE = 'fuel';
export const FUEL_PAYMENT_LABEL = 'Thanh toán xăng dầu xe ô tô';
export const FUEL_REPORT_TYPE = 'fuel_payment';

// Keep the input string while typing; normalize only when submitting.
// DECIMAL(12,3): nine integer digits and up to three fractional digits.
export function normalizeFuelLiters(value) {
    const input = String(value ?? '').trim().replace(',', '.');
    if (!/^\d{1,9}(?:\.\d{1,3})?$/.test(input) || !/[1-9]/.test(input)) return null;
    const [integer, decimal] = input.split('.');
    const normalizedInteger = integer.replace(/^0+(?=\d)/, '');
    const normalizedDecimal = decimal?.replace(/0+$/, '');
    return normalizedDecimal ? `${normalizedInteger}.${normalizedDecimal}` : normalizedInteger;
}

export function validateFuelPayment(formData) {
    if (formData.payment_request?.payment_type !== FUEL_PAYMENT_TYPE) return {};
    const errors = {};
    if (!normalizeFuelLiters(formData.payment_request.fuel_liters)) {
        errors.fuel_liters = 'Nhập số lít lớn hơn 0, tối đa 9 chữ số phần nguyên và 3 chữ số thập phân';
    }
    if (!formData.files?.invoices?.some((item) => item.file instanceof File && item.file.size > 0)) {
        errors.invoices = 'Thanh toán xăng dầu cần đính kèm ít nhất một hóa đơn';
    }
    return errors;
}

export function preparePaymentSubmission(formData) {
    const payment = { ...formData.payment_request, currency: formData.payment_request?.currency || 'VND' };
    if (payment.payment_type === FUEL_PAYMENT_TYPE) {
        payment.fuel_liters = normalizeFuelLiters(payment.fuel_liters);
    } else {
        delete payment.fuel_liters;
    }
    const files = { ...formData.files };
    if (payment.payment_type === 'no_invoice') delete files.invoices;
    else delete files.receipts;
    return { ...formData, payment_request: payment, files };
}

export function getVietnamReportMonth(now = new Date()) {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit',
    }).formatToParts(now);
    return `${parts.find((part) => part.type === 'year').value}-${parts.find((part) => part.type === 'month').value}`;
}

export function buildFuelReportPayload(month) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month || '') || month < '2026-10') {
        throw new Error('Chọn tháng báo cáo từ tháng 10/2026');
    }
    const [year, monthNumber] = month.split('-').map(Number);
    return { requestTypeId: 1, reportType: FUEL_REPORT_TYPE, year, month: monthNumber };
}

export function canExportFuelPaymentReport(user) {
    return user?.permissions?.exportFuelPaymentReport === true;
}
