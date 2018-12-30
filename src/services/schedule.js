import request from '../utils/request';

export function fetchScheduleList() {
    return request('/api/scheduleList', {
        method: 'post'
    });
}

export function addSchedule( { currentAddSchedule }) {
    return request('/api/addSchedule', {
        method: 'post',
        body: JSON.stringify({
            currentAddSchedule: currentAddSchedule
        })
    });
}

export function deleteSchedule( { id }) {
    return request('/api/deleteSchedule', {
        method: 'post',
        body: JSON.stringify({
            scheduleId: id
        })
    });
}
