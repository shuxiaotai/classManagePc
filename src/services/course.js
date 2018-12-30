import request from '../utils/request';

export function fetchCourseList() {
    return request('/api/courseList', {
        method: 'post'
    });
}

export function addCourse( { currentAddCourse }) {
    return request('/api/addCourse', {
        method: 'post',
        body: JSON.stringify({
            currentAddCourse: currentAddCourse
        })
    });
}

export function deleteCourse( { id }) {
    return request('/api/deleteCourse', {
        method: 'post',
        body: JSON.stringify({
            courseId: id
        })
    });
}
