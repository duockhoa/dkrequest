import axios from './customize-axios';

async function loginService(payload) {
    try {
        const response = await axios.post('/login', payload);
        // Check response status
        if (response.status === 200) {
            return response;
        } else {
            throw new Error('Đăng nhập thất bại');
        }
    } catch (error) {
        // Handle specific error types
        if (error.response) {
            // Server responded with error status
            switch (error.response.status) {
                case 401:
                    throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
                case 403:
                    throw new Error('Tài khoản của bạn đã bị khóa');
                case 404:
                    throw new Error('Không tìm thấy tài khoản');
                default:
                    throw new Error(error.response.data.message || 'Lỗi từ server');
            }
        } else if (error.request) {
            // Request made but no response received
            throw new Error('Không thể kết nối đến server');
        } else {
            // Error setting up request
            throw new Error(error.message || 'Đã xảy ra lỗi khi đăng nhập');
        }
    }
}

export { loginService };
