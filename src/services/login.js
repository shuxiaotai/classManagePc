import request from '../utils/request';

export function login({ user }) {
    return request('/api/login', {
        method: 'post',
        body: JSON.stringify({
            user: user
        })
    });
}

export function register({ user }) {
    return request('/api/register', {
        method: 'post',
        body: JSON.stringify({
            user: user
        })
    });
}

export function checkLogin({ token }) {
    return request('/api/checkLogin', {
        method: 'post',
        body: JSON.stringify({
            token: token
        })
    });
}
