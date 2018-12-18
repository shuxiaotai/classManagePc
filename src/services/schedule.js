import request from '../utils/request';

export function fetchScheduleList() {
    return request('/api/scheduleList', {
        method: 'post'
    });
}
