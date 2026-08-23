import axios from 'axios';
import { addAuthenticationInterceptors } from './authSession';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL + '/api/v1',
    timeout: 120000,
    headers: { 'X-Custom-Header': 'foobar' },
});

addAuthenticationInterceptors(instance);

export default instance;
