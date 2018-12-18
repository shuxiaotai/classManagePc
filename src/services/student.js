import request from '../utils/request';

export function fetchStudentList() {
    return request('/api/studentList', {
        method: 'post'
    });
}
