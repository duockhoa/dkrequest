import axios from 'axios';
import Cookies from 'js-cookie';

const domain = process.env.REACT_APP_DOMAIN;

const cookieOptions = {
    domain,
    secure: window.location.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
};

// All API clients import this module, so simultaneous 401 responses share one
// refresh request instead of racing to rotate the same refresh token.
let refreshPromise = null;
let isRedirectingToLogin = false;

function getRequestAccessToken(config) {
    const authorization = config.headers?.get
        ? config.headers.get('Authorization')
        : config.headers?.Authorization;

    return authorization?.replace(/^Bearer\s+/i, '');
}

async function refreshAccessToken(failedAccessToken) {
    const currentAccessToken = Cookies.get('accessToken');

    // A different request may have already refreshed the token while this 401
    // response was still in flight. Retry with that token, do not refresh again.
    if (currentAccessToken && currentAccessToken !== failedAccessToken) {
        return currentAccessToken;
    }

    if (!refreshPromise) {
        const refreshToken = Cookies.get('refreshToken');

        if (!refreshToken) {
            return Promise.reject(new Error('Không tìm thấy refresh token'));
        }

        const refreshClient = axios.create({
            baseURL: process.env.REACT_APP_AUTH_URL,
            timeout: 12000,
        });

        refreshPromise = refreshClient
            .post('/auth/refresh-token', { refreshToken })
            .then((response) => {
                const newAccessToken = response.data?.accessToken;

                if (!newAccessToken) {
                    throw new Error('Refresh token không trả về access token');
                }

                Cookies.set('accessToken', newAccessToken, cookieOptions);
                return newAccessToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

function restoreAccessToken() {
    const accessToken = Cookies.get('accessToken');

    if (accessToken) {
        return Promise.resolve(accessToken);
    }

    return refreshAccessToken();
}

function clearSessionAndRedirect() {
    Cookies.remove('accessToken', cookieOptions);
    Cookies.remove('refreshToken', cookieOptions);
    Cookies.remove('id', cookieOptions);

    if (!isRedirectingToLogin) {
        isRedirectingToLogin = true;
        window.location.href = process.env.REACT_APP_FRONTEND_ROOT_URL + '/login';
    }
}

function addAuthenticationInterceptors(instance) {
    instance.interceptors.request.use((config) => {
        const token = Cookies.get('accessToken');

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken(getRequestAccessToken(originalRequest));
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return instance(originalRequest);
            } catch (refreshError) {
                clearSessionAndRedirect();
                return Promise.reject(refreshError);
            }
        },
    );
}

export { addAuthenticationInterceptors, restoreAccessToken };
