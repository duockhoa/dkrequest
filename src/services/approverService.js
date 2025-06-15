import axios from './customize-axios';

async function approverUpdateStatus(payload) {
    try {
        const response = await axios.put('/approver/updatestatus', payload);
        if (response.status === 200) {
            return response.data.result;
        } else {
            throw new Error('Không thể cập nhật trạng thái phê duyệt');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi cập nhật trạng thái phê duyệt');
        }
    }
}

async function approverForward(payload) {
    try {
        const response = await axios.put('/approver/forward', payload);
        if (response.status === 200) {
            return response.data.result;
        } else {
            throw new Error('Không thể chuyển tiếp yêu cầu phê duyệt');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi chuyển tiếp yêu cầu phê duyệt');
        }
    }
}

export { approverUpdateStatus, approverForward };
