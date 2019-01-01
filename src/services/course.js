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

export function fetchCurrentCourse( { id }) {
    return request('/api/currentCourse', {
        method: 'post',
        body: JSON.stringify({
            courseId: id
        })
    });
}

export function editCourse( { currentEditCourse }) {
    return request('/api/editCourse', {
        method: 'post',
        body: JSON.stringify({
            currentEditCourse: currentEditCourse
        })
    });
}

