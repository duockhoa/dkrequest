import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Simulate } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PaymentRequestForm from './PaymentRequestForm';
import ExportReportForm from './ExportReportForm';
import requestFormDataReducer from '../../redux/slice/requestFormDataSlice';
import { exportsReportService } from '../../services/exportsFileService';

jest.mock('../../services/exportsFileService', () => ({ exportsReportService: jest.fn() }));
jest.mock('../../services/requestService', () => ({ createRequestService: jest.fn() }));

global.IS_REACT_ACT_ENVIRONMENT = true;
let container;
let root;
let store;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    store = configureStore({
        reducer: {
            requestFormData: requestFormDataReducer,
            requestId: () => ({ requestTypeId: 1 }),
            user: () => ({ userInfo: { id: 10, name: 'Người đề nghị', department: 'TC' } }),
        },
        preloadedState: { requestFormData: {
            value: { payment_request: { payment_type: 'fuel', fuel_liters: '' }, files: {} },
            errors: { invoices: 'Thanh toán xăng dầu cần đính kèm ít nhất một hóa đơn' },
            loading: false, error: null,
        } },
    });
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
    jest.clearAllMocks();
});

function render(component) {
    act(() => root.render(<Provider store={store}>{component}</Provider>));
}

test('shows the fuel fields and invoice error, keeping fractional zeros during typing', () => {
    render(<PaymentRequestForm />);
    expect(container.textContent).toContain('Hóa đơn xăng dầu (*)');
    expect(container.textContent).toContain('cần đính kèm ít nhất một hóa đơn');
    const input = container.querySelector('input[name="fuel_liters"]');
    for (const value of ['1', '1.', '1.0', '1.05']) {
        act(() => Simulate.change(input, { target: { name: 'fuel_liters', value } }));
        expect(input.value).toBe(value);
    }
    expect(store.getState().requestFormData.value.payment_request.fuel_liters).toBe('1.05');
});

test('changing away from fuel hides the liters field and clears its draft value', () => {
    render(<PaymentRequestForm />);
    act(() => Simulate.mouseDown(container.querySelector('.MuiSelect-select'), { button: 0 }));
    const option = Array.from(document.querySelectorAll('[role="option"]')).find((item) => item.textContent === 'Không hóa đơn');
    act(() => Simulate.click(option));
    expect(container.querySelector('input[name="fuel_liters"]')).toBeNull();
    expect(store.getState().requestFormData.value.payment_request).not.toHaveProperty('fuel_liters');
});

test('fuel-only report users submit the selected month without generic filters', async () => {
    const onClose = jest.fn();
    exportsReportService.mockResolvedValue(undefined);
    render(<ExportReportForm onClose={onClose} allowGeneralReport={false} />);
    expect(container.querySelector('input[name="startDate"]')).toBeNull();
    const input = container.querySelector('input[name="reportMonth"]');
    act(() => Simulate.change(input, { target: { value: '2026-10' } }));
    await act(async () => Simulate.submit(container.querySelector('form')));
    expect(exportsReportService).toHaveBeenCalledWith({ requestTypeId: 1, reportType: 'fuel_payment', year: 2026, month: 10 });
    expect(onClose).toHaveBeenCalledTimes(1);
});

test('rejects a month before October 2026 without calling the server', async () => {
    render(<ExportReportForm onClose={jest.fn()} allowGeneralReport={false} />);
    act(() => Simulate.change(container.querySelector('input[name="reportMonth"]'), { target: { value: '2026-09' } }));
    await act(async () => Simulate.submit(container.querySelector('form')));
    expect(exportsReportService).not.toHaveBeenCalled();
    expect(container.querySelector('[role="alert"]').textContent).toContain('10/2026');
});

test('prevents duplicate exports, shows failure, and allows retry', async () => {
    let rejectExport;
    exportsReportService.mockImplementationOnce(() => new Promise((resolve, reject) => { rejectExport = reject; }));
    const onClose = jest.fn();
    render(<ExportReportForm onClose={onClose} allowGeneralReport={false} />);
    act(() => {
        Simulate.submit(container.querySelector('form'));
        Simulate.submit(container.querySelector('form'));
    });
    expect(exportsReportService).toHaveBeenCalledTimes(1);
    expect(container.querySelector('button[type="submit"]').disabled).toBe(true);
    await act(async () => rejectExport(new Error('Không có quyền xuất')));
    expect(container.querySelector('[role="alert"]').textContent).toBe('Không có quyền xuất');
    expect(onClose).not.toHaveBeenCalled();
    expect(container.querySelector('button[type="submit"]').disabled).toBe(false);
    exportsReportService.mockResolvedValueOnce(undefined);
    await act(async () => Simulate.submit(container.querySelector('form')));
    expect(exportsReportService).toHaveBeenCalledTimes(2);
    expect(onClose).toHaveBeenCalledTimes(1);
});
