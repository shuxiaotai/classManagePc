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

export function fetchCurrentSchedule( { id }) {
    return request('/api/currentSchedule', {
        method: 'post',
        body: JSON.stringify({
            scheduleId: id
        })
    });
}

export function editSchedule( { currentEditSchedule }) {
    return request('/api/editSchedule', {
        method: 'post',
        body: JSON.stringify({
            currentEditSchedule: currentEditSchedule
        })
    });
}
