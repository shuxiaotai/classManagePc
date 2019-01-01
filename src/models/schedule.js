import * as scheduleServices from '../services/schedule';
import {message} from "antd/lib/index";
import {getProtocol} from "../utils/getProtocol";

export default {

    namespace: 'schedule',

    state: {
        scheduleList: [],
        scheduleModalVisible: false,
        currentSchedule: '',
        fileList: [],
    },

    subscriptions: {
        setup({ dispatch, history }) {
        },
    },

    effects: {
        *fetchScheduleList({ payload }, { call, put }) {
            let data = yield call(scheduleServices.fetchScheduleList);
            yield put({ type: 'saveScheduleList', payload: data });
        },
        *addSchedule({ payload }, { call, put }) {
            let data = yield call(scheduleServices.addSchedule, {currentAddSchedule : payload.currentAddSchedule});
            yield put({ type: 'handleScheduleModal', payload: data });
            if (data.addScheduleSuccess) {
                message.success('创建成功');
                yield put({ type: 'fetchScheduleList' });
            }
        },
        *deleteSchedule({ payload }, { call, put }) {
            let data = yield call(scheduleServices.deleteSchedule, {id : payload.id});
            if (data.deleteScheduleSuccess) {
                message.success('删除成功');
                yield put({ type: 'fetchScheduleList' });
            }
        },
        *fetchCurrentSchedule({ payload }, { call, put }) {
            let data = yield call(scheduleServices.fetchCurrentSchedule, {id : payload.id});
            yield put({ type: 'saveCurrentSchedule', payload: data });
            let index = data.currentSchedule['img_url'].lastIndexOf('/');
            let imgName = data.currentSchedule['img_url'].slice(index + 1);
            const fileList = [{
                uid: data.currentSchedule['img_url'],
                name: imgName,
                status: 'done',
                thumbUrl: getProtocol() + data.currentSchedule['img_url']
            }];
            yield put({ type: 'saveFileList', payload: { fileList } });
        },
        *editSchedule({ payload }, { call, put }) {
            let data = yield call(scheduleServices.editSchedule, {currentEditSchedule : payload.currentEditSchedule});
            yield put({ type: 'handleScheduleModal', payload: data });
            if (data.editScheduleSuccess) {
                message.success('修改成功');
                yield put({ type: 'fetchScheduleList' });
            }
        },
    },

    reducers: {
        saveScheduleList(state, action) {
            return { ...state, scheduleList: action.payload.scheduleList };
        },
        handleScheduleModal(state, action) {
            return { ...state, scheduleModalVisible: action.payload.addScheduleSuccess ? !action.payload.addScheduleSuccess : action.payload.scheduleModalVisible};
        },
        saveCurrentSchedule(state, action) {
            return { ...state, currentSchedule: action.payload.currentSchedule };
        },
        saveFileList(state, action) {
            return { ...state, fileList: action.payload.fileList };
        },
    },

};
