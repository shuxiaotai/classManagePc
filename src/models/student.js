import * as studentServices from '../services/student';
import {message} from "antd/lib/index";

export default {

    namespace: 'student',

    state: {
        studentList: [],
        studentModalVisible: false
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
        *addStudent({ payload }, { call, put }) {
            let data = yield call(studentServices.addStudent, {currentAddStudent : payload.currentAddStudent});
            yield put({ type: 'handleStudentModal', payload: data });
            if (data.addStudentSuccess) {
                message.success('创建成功');
                yield put({ type: 'fetchStudentList' });
            }
        },
    },

    reducers: {
        saveStudentList(state, action) {
            return { ...state, studentList: action.payload.studentList };
        },
        handleStudentModal(state, action) {
            return { ...state, studentModalVisible: action.payload.addStudentSuccess ? !action.payload.addStudentSuccess : action.payload.studentModalVisible};
        },
    },

};
