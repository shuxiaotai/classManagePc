import * as classServices from '../services/classServices';
import {message} from "antd/lib/index";

export default {

    namespace: 'classModels',

    state: {
        classList: [],
        classModalVisible: false,
        masterTeacherList: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
        },
    },

    effects: {
        *fetchClassList({ payload }, { call, put }) {
            let data = yield call(classServices.fetchClassList);
            yield put({ type: 'saveClassList', payload: data });
        },
        *addClass({ payload }, { call, put }) {
            let data = yield call(classServices.addClass, {currentAddClass : payload.currentAddClass});
            yield put({ type: 'handleClassModal', payload: data });
            if (data.addClassSuccess) {
                message.success('创建成功');
                yield put({ type: 'fetchClassList' });
            }
        },
        *fetchMasterTeacherList({ payload }, { call, put }) {
            let data = yield call(classServices.fetchMasterTeacherList);
            yield put({ type: 'saveMasterTeacherList', payload: data });
        },
        *deleteClass({ payload }, { call, put }) {
            let data = yield call(classServices.deleteClass, {id : payload.id});
            if (data.deleteClassSuccess) {
                message.success('删除成功');
                yield put({ type: 'fetchClassList' });
            }
        },
    },

    reducers: {
        saveClassList(state, action) {
            return { ...state, classList: action.payload.classList };
        },
        handleClassModal(state, action) {
            return { ...state, classModalVisible: action.payload.addClassSuccess ? !action.payload.addClassSuccess : action.payload.classModalVisible};
        },
        saveMasterTeacherList(state, action) {
            return { ...state, masterTeacherList: action.payload.masterTeacherList };
        },
    },

};
