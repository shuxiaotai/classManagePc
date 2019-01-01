import * as studentServices from '../services/student';
import {message} from "antd/lib/index";
import {getProtocol} from "../utils/getProtocol";

export default {

    namespace: 'student',

    state: {
        studentList: [],
        studentModalVisible: false,
        currentStudent: '',
        fileList: [],
    },

    subscriptions: {
        setup({ dispatch, history }) {
        },
    },

    effects: {
        *fetchStudentList({ payload }, { call, put }) {
            let data = yield call(studentServices.fetchStudentList);
            console.log('====');
            console.log(data);
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
        *deleteStudent({ payload }, { call, put }) {
            let data = yield call(studentServices.deleteStudent, {id : payload.id});
            if (data.deleteStudentSuccess) {
                message.success('删除成功');
                yield put({ type: 'fetchStudentList' });
            }
        },
        *fetchCurrentStudent({ payload }, { call, put }) {
            let data = yield call(studentServices.fetchCurrentStudent, {id : payload.id});
            yield put({ type: 'saveCurrentStudent', payload: data });
            let index = data.currentStudent['avatar_url'].lastIndexOf('/');
            let imgName = data.currentStudent['avatar_url'].slice(index + 1);
            const fileList = [{
                uid: data.currentStudent['avatar_url'],
                name: imgName,
                status: 'done',
                thumbUrl: getProtocol() + data.currentStudent['avatar_url']
            }];
            yield put({ type: 'saveFileList', payload: { fileList } });
        },
        *editStudent({ payload }, { call, put }) {
            let data = yield call(studentServices.editStudent, {currentEditStudent : payload.currentEditStudent});
            yield put({ type: 'handleStudentModal', payload: data });
            if (data.editStudentSuccess) {
                message.success('修改成功');
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
        saveCurrentStudent(state, action) {
            return { ...state, currentStudent: action.payload.currentStudent };
        },
        saveFileList(state, action) {
            return { ...state, fileList: action.payload.fileList };
        },
    },

};
