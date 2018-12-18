import request from '../utils/request';

export function fetchClassList() {
    return request('/api/classList', {
        method: 'post',
    });
}
