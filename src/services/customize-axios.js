import axios from 'axios';

const tokenMatch = document.cookie.match(/token=([^;]+)/);
const token = tokenMatch ? tokenMatch[1] : null;

const instance = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
    timeout: 120000, // 2 phút
    headers: { 'X-Custom-Header': 'foobar', Authorization: token },
});

// Retry logic: thử lại tối đa 3 lần nếu lỗi mạng hoặc timeout
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;
        if (!config || config.__retryCount >= 3) {
            return Promise.reject(error);
        }
        config.__retryCount = config.__retryCount ? config.__retryCount + 1 : 1;
        // Chỉ retry nếu là lỗi mạng hoặc timeout
        if (error.code === 'ECONNABORTED' || !error.response) {
            return instance(config);
        }
        return Promise.reject(error);
    },
);

export default instance;
