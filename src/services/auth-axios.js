import axios from 'axios';
import { addAuthenticationInterceptors } from './authSession';

const instance = axios.create({
    baseURL: process.env.REACT_APP_AUTH_URL,
    timeout: 12000,
    headers: { 'X-Custom-Header': 'foobar' },
});

addAuthenticationInterceptors(instance);

export default instance;
