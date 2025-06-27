import axios from './customize-axios';
async function getRequestApprover(requestTypeId, userId) {
    try {
        const response = await axios.get(`/requestfollower/getbytype/${requestTypeId}/${userId}`);
        if (response.status === 200) {
            return response.data.result;
        } else {
            throw new Error('Không thể lấy danh sách người phê duyệt yêu cầu');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi lấy danh sách yêu cầu');
        }
    }
}

export { getRequestApprover };
