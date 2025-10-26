import axios from './customize-axios';

async function updateInvoiceItems(invoiceItems) {
    try {
        const response = await axios.put(`/invoiceitems/`, invoiceItems);
        if (response.status === 200) {
            return response.data.results;
        } else {
            throw new Error('Không thể cập nhật danh sách hoá đơn');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi cập nhật danh sách hoá đơn');
        }
    }
}

export { updateInvoiceItems };
