import {
    normalizeFuelLiters, validateFuelPayment, preparePaymentSubmission,
    buildFuelReportPayload, getVietnamReportMonth, canExportFuelPaymentReport,
} from './fuelPayment';
import objectToFormData from './makeFromDataFromObject';

const invoice = () => ({ file: new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' }), file_group: 'invoices' });

test.each(['', '0', '0.000', '-1', '1abc', '1.2.3', '1,2,3', '1.2345', '1000000000', 'Infinity'])('rejects invalid liters %s', (value) => {
    expect(normalizeFuelLiters(value)).toBeNull();
});

test.each([['1.05', '1.05'], ['40,250', '40.25'], ['0.001', '0.001'], ['001.050', '1.05'], ['999999999.999', '999999999.999']])('normalizes %s without rounding', (value, expected) => {
    expect(normalizeFuelLiters(value)).toBe(expected);
});

test('requires a real, nonempty invoice for fuel and rejects removal of the last invoice', () => {
    const data = { payment_request: { payment_type: 'fuel', fuel_liters: '40,25' }, files: { invoices: [invoice()] } };
    expect(validateFuelPayment(data)).toEqual({});
    expect(validateFuelPayment({ ...data, files: { invoices: [] } })).toHaveProperty('invoices');
    expect(validateFuelPayment({ ...data, files: { invoices: [{ name: 'fake.pdf' }] } })).toHaveProperty('invoices');
    expect(validateFuelPayment({ ...data, files: { invoices: [{ file: new File([], 'empty.pdf') }] } })).toHaveProperty('invoices');
    expect(validateFuelPayment({ payment_request: { payment_type: 'fuel' } })).toHaveProperty('fuel_liters');
});

test('leaves legacy payment validation unchanged', () => {
    expect(validateFuelPayment({ payment_request: { payment_type: 'invoice' } })).toEqual({});
    expect(validateFuelPayment({ payment_request: { payment_type: 'no_invoice' } })).toEqual({});
});

test('submits decimal liters, currency and actual invoice without hidden receipts or mutating the draft', () => {
    const data = { payment_request: { payment_type: 'fuel', fuel_liters: '40,250' }, files: { invoices: [invoice()], receipts: [invoice()], otherAttachments: [invoice()] } };
    const payload = preparePaymentSubmission(data);
    const multipart = objectToFormData(payload);
    expect(multipart.get('payment_request[fuel_liters]')).toBe('40.25');
    expect(multipart.get('payment_request[currency]')).toBe('VND');
    expect(multipart.get('files[invoices][0][file]')).toBeInstanceOf(File);
    expect(multipart.has('files[receipts][0][file]')).toBe(false);
    expect(multipart.has('files[otherAttachments][0][file]')).toBe(true);
    expect(data.payment_request.fuel_liters).toBe('40,250');
    expect(data.files.receipts).toHaveLength(1);
});

test('omits fuel liters and inactive invoice group for a non-fuel payment', () => {
    const payload = preparePaymentSubmission({ payment_request: { payment_type: 'no_invoice', fuel_liters: '40' }, files: { invoices: [invoice()], receipts: [invoice()] } });
    expect(payload.payment_request).not.toHaveProperty('fuel_liters');
    expect(payload.files).not.toHaveProperty('invoices');
    expect(payload.files.receipts).toHaveLength(1);
});

test('requests the server-side fuel report for the selected approval month', () => {
    expect(buildFuelReportPayload('2026-10')).toEqual({ requestTypeId: 1, reportType: 'fuel_payment', year: 2026, month: 10 });
    for (const value of ['', '2026-09', '2026-13', '2026-1', 'bad']) {
        expect(() => buildFuelReportPayload(value)).toThrow();
    }
});

test('defaults to the Vietnam month at the UTC month boundary', () => {
    expect(getVietnamReportMonth(new Date('2026-09-30T18:00:00Z'))).toBe('2026-10');
});

test('requires an explicit backend permission for additional report users', () => {
    expect(canExportFuelPaymentReport({ permissions: { exportFuelPaymentReport: true } })).toBe(true);
    expect(canExportFuelPaymentReport({ department: 'HC' })).toBe(false);
    expect(canExportFuelPaymentReport({ permissions: { exportFuelPaymentReport: 'true' } })).toBe(false);
});
