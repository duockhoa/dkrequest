import axios from './customize-axios';
import Cookies from 'js-cookie'; // Import thư viện js-cookie

async function checkTokenService() {
    const token = Cookies.get('token'); // Lấy token từ cookie

    try {
        const response = await axios.get(`/login/token?token=${token}`);
        return response;
    } catch (error) {
        // Kiểm tra nếu lỗi là 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            // Xóa token khỏi cookie
            Cookies.remove('token');
            return null;
        }

        // Ném lỗi để xử lý ở nơi gọi hàm
        throw error;
    }
}

export { checkTokenService };
