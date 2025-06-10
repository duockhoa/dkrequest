import axios from './customize-axios';
import Cookies from 'js-cookie';
import { domain } from './domain';
async function logoutService(payload) {
    Cookies.remove('token', {
        domain: domain,
    });
    try {
        const response = await axios.delete('/auth/logout', {
            data: payload,
        });

        // Check response status
        if (response.status === 200) {
            return response;
        } else {
            throw new Error('Đăng xuất thất bại');
        }
    } catch (error) {
        console.log(error);
    }
}

export { logoutService };
