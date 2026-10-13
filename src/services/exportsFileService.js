import axios from './customize-axios';
import { FUEL_REPORT_TYPE } from '../utils/fuelPayment';

function downloadReport(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    try {
        link.click();
    } finally {
        link.remove();
        // Allow the browser to start the download before releasing the URL.
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    }
}

async function getReportError(error) {
    const data = error.response?.data;
    if (data instanceof Blob) {
        try {
            const body = JSON.parse(await data.text());
            return new Error(body.message || body.error || 'Không thể xuất báo cáo');
        } catch {
            return new Error('Không thể xuất báo cáo. Vui lòng kiểm tra quyền truy cập và thử lại.');
        }
    }
    return new Error(data?.message || error.message || 'Không thể xuất báo cáo');
}

async function exportsFileDocService(requestId) {
    try {
        const response = await axios.post('/file/exportdoc', { requestId }, { responseType: 'blob' });

        if (response.status === 200) {
            // Create a link element to trigger the download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `request-${requestId}.doc`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            throw new Error('Failed to export file');
        }
    } catch (error) {
        console.error('Error exporting file:', error);
        throw error; // Re-throw the error for further handling if needed
    }
}

async function exportsReportService(data) {
    try {
        const response = await axios.post('exportreport', data, {
            responseType: 'blob', // Set response type to blob for file download
        });

        if (response.status === 200) {
            const contentType = response.headers?.['content-type'] || response.data?.type || '';
            if (/json|text\//i.test(contentType)) {
                const reportError = new Error('Máy chủ không trả về file Excel');
                reportError.response = response;
                throw reportError;
            }
            const isFuelReport = data.reportType === FUEL_REPORT_TYPE;
            if (isFuelReport && response.headers?.['x-report-type'] !== FUEL_REPORT_TYPE) {
                throw new Error('Máy chủ chưa xác nhận báo cáo xăng dầu. Vui lòng liên hệ bộ phận hỗ trợ.');
            }
            const filename = isFuelReport
                ? `thanh-toan-xang-dau-${data.year}-${String(data.month).padStart(2, '0')}.xlsx`
                : 'report.xlsx';
            downloadReport(response.data instanceof Blob ? response.data : new Blob([response.data]), filename);
        } else {
            throw new Error('Failed to export report');
        }
    } catch (error) {
        throw await getReportError(error);
    }
}

export { exportsFileDocService, exportsReportService };
