import request from '../utils/request';

export function fetchStudentList() {
    return request('/api/studentList', {
        method: 'post'
    });
}
export function addStudent( { currentAddStudent }) {
    return request('/api/addStudent', {
        method: 'post',
        body: JSON.stringify({
            currentAddStudent: currentAddStudent
        })
    });
}
