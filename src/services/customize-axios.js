import axios from 'axios';
const tokenMatch = document.cookie.match(/token=([^;]+)/);
const token = tokenMatch ? tokenMatch[1] : null;

const instance = axios.create({
    baseURL: 'https://mysql.dkpharma.io.vn/api/v1',
    timeout: 30000,
    headers: { 'X-Custom-Header': 'foobar', Authorization: token },
});

export default instance;
