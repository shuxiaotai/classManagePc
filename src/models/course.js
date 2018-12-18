import * as courseServices from '../services/course';

export default {

    namespace: 'course',

    state: {
        courseList: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
        },
    },

    effects: {
        *fetchCourseList({ payload }, { call, put }) {
            let data = yield call(courseServices.fetchCourseList);
            yield put({ type: 'saveCourseList', payload: data });
        },
    },

    reducers: {
        saveCourseList(state, action) {
            return { ...state, courseList: action.payload.courseList };
        },
    },

};
