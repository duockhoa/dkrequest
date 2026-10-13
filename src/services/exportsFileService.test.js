import axios from './customize-axios';
import { exportsReportService } from './exportsFileService';

jest.mock('./customize-axios', () => ({ post: jest.fn() }));

const fuelPayload = { requestTypeId: 1, reportType: 'fuel_payment', year: 2026, month: 10 };
let clickedFilename;

beforeEach(() => {
    jest.useFakeTimers();
    clickedFilename = null;
    window.URL.createObjectURL = jest.fn(() => 'blob:report');
    window.URL.revokeObjectURL = jest.fn();
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () { clickedFilename = this.download; });
});

afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    jest.clearAllMocks();
});

test('downloads the confirmed fuel workbook with a month-specific name and releases its URL', async () => {
    axios.post.mockResolvedValue({ status: 200, data: new Blob(['excel']), headers: { 'x-report-type': 'fuel_payment' } });
    await exportsReportService(fuelPayload);
    expect(axios.post).toHaveBeenCalledWith('exportreport', fuelPayload, { responseType: 'blob' });
    expect(clickedFilename).toBe('thanh-toan-xang-dau-2026-10.xlsx');
    expect(document.querySelector('a')).toBeNull();
    jest.runOnlyPendingTimers();
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:report');
});

test('does not download a legacy generic report returned for a fuel request', async () => {
    axios.post.mockResolvedValue({ status: 200, data: new Blob(['wrong workbook']), headers: {} });
    await expect(exportsReportService(fuelPayload)).rejects.toThrow('chưa xác nhận báo cáo xăng dầu');
    expect(window.URL.createObjectURL).not.toHaveBeenCalled();
});

test('keeps the existing generic report request and filename', async () => {
    axios.post.mockResolvedValue({ status: 200, data: new Blob(['excel']), headers: {} });
    await exportsReportService({ requestTypeId: 2, startDate: '2026-10-01', endDate: '2026-10-31', status: 'all', userId: 10 });
    expect(clickedFilename).toBe('report.xlsx');
});

test.each([200, 403])('shows the server JSON error rather than saving it as Excel (HTTP %s)', async (status) => {
    const data = new Blob(['{"message":"Bạn không có quyền xuất báo cáo"}'], { type: 'application/json' });
    data.text = async () => '{"message":"Bạn không có quyền xuất báo cáo"}';
    const response = { status, data, headers: { 'content-type': 'application/json' } };
    if (status === 200) axios.post.mockResolvedValue(response);
    else axios.post.mockRejectedValue({ response });
    await expect(exportsReportService(fuelPayload)).rejects.toThrow('Bạn không có quyền xuất báo cáo');
    expect(window.URL.createObjectURL).not.toHaveBeenCalled();
});
