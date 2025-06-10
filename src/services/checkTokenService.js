import axios from './customize-axios';
import Cookies from 'js-cookie';
import { domain } from './domain';

async function checkTokenService(retryCount = 0) {
    const token = Cookies.get('token');
    if (!token) {
        return null;
    }

    try {
        const response = await axios.get(`/auth/checktoken?token=${token}`);
        if (response.status !== 200) {
            throw new Error('Token validation failed');
        }

        // Refresh token expiration (7 days)
        Cookies.set('token', token, {
            expires: 7,
            domain: domain,
            path: '/',
        });

        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            // Clear token cookie
            Cookies.remove('token', {
                domain: domain,
                path: '/',
            });
            return null;
        }

        // Retry logic for network errors
        if (retryCount < 3 && (!error.response || error.response.status >= 500)) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
            return checkTokenService(retryCount + 1);
        }

        throw error;
    }
}

export { checkTokenService };
