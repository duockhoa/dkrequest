
import axios from './auth-axios';

async function getAllUsersService() {
    try {
        const response = await axios.get('/user/getall');
        if (response.status === 200) {
            return response.data.result;
        } else {
            throw new Error('Không thể lấy danh sách người dùng');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi lấy danh sách người dùng');
        }
    }
}


async function  changePasswordService(data) {
   try {
       const response = await axios.put('/user/changepassword', data);
       if (response.status === 200) {
           return response.data.result;
       } else {
          throw new Error('Không thể thay đổi mật khẩu');
       }
   } catch (error) {
       if (error.response) {
           throw new Error(error.response.data.error || 'Lỗi từ server');
       } else if (error.request) {
           throw new Error('Không thể kết nối đến server');
       } else {
           throw new Error(error.message || 'Đã xảy ra lỗi khi thay đổi mật khẩu');
       }
   }
}




export { getAllUsersService , changePasswordService };
