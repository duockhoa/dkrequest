import axios from './customize-axios';

async function getLeaveHours(userId) {
    try {
        const response = await axios.get(`/leavehour/getbyuserid/${userId}`);
        if (response.status === 200) {
            return response.data.result;
        } else {
            throw new Error('Không thể lấy danh sách giờ nghỉ phép');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi lấy danh sách giờ nghỉ phép');
        }
    }
}
export { getLeaveHours };
