import request from '../utils/request';

export function fetchCourseList() {
    return request('/api/courseList', {
        method: 'post'
    });
}
