import * as courseServices from '../services/course';
import {message} from "antd/lib/index";

export default {

    namespace: 'course',

    state: {
        courseList: [],
        courseModalVisible: false
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
        *addCourse({ payload }, { call, put }) {
            let data = yield call(courseServices.addCourse, {currentAddCourse : payload.currentAddCourse});
            yield put({ type: 'handleCourseModal', payload: data });
            if (data.addCourseSuccess) {
                message.success('创建成功');
                yield put({ type: 'fetchCourseList' });
            }
        },
    },

    reducers: {
        saveCourseList(state, action) {
            return { ...state, courseList: action.payload.courseList };
        },
        handleCourseModal(state, action) {
            return { ...state, courseModalVisible: action.payload.addCourseSuccess ? !action.payload.addCourseSuccess : action.payload.courseModalVisible};
        },
    },

};
