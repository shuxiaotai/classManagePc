import request from '../utils/request';

export function fetchClassList() {
    return request('/api/classList', {
        method: 'post',
    });
}
export function addClass( { currentAddClass }) {
    return request('/api/addClass', {
        method: 'post',
        body: JSON.stringify({
            currentAddClass: currentAddClass
        })
    });
}

export function fetchMasterTeacherList() {
    return request('/api/selectMasterTeacher', {
        method: 'post',
    });
}

export function deleteClass( { id }) {
    return request('/api/deleteClass', {
        method: 'post',
        body: JSON.stringify({
            classId: id
        })
    });
}
