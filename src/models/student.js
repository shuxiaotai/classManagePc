import * as studentServices from '../services/student';

export default {

    namespace: 'student',

    state: {
        studentList: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
        },
    },

    effects: {
        *fetchStudentList({ payload }, { call, put }) {
            let data = yield call(studentServices.fetchStudentList);
            yield put({ type: 'saveStudentList', payload: data });
        },
    },

    reducers: {
        saveStudentList(state, action) {
            return { ...state, studentList: action.payload.studentList };
        },
    },

};
