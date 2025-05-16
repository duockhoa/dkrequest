import axios from './customize-axios';

async function updateAvatarService(payload) {
    try {
        // Kiểm tra payload
        if (!payload || !payload.get('avatar')) {
            throw new Error('Không tìm thấy file ảnh');
        }

        const response = await axios.put('/user/updateavatar', payload, {
            headers: {
                // Sửa Headers thành headers
                'Content-Type': 'multipart/form-data',
            },
        });

        // Kiểm tra response
        if (response.status === 200) {
            return response;
        } else {
            throw new Error('Cập nhật avatar thất bại');
        }
    } catch (error) {
        // Xử lý các loại lỗi cụ thể
        if (error.response) {
            // Lỗi từ server
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            // Lỗi không nhận được response
            throw new Error('Không thể kết nối đến server');
        } else {
            // Lỗi khi set up request
            throw new Error(error.message || 'Đã xảy ra lỗi khi tải ảnh lên');
        }
    }
}

export { updateAvatarService };
