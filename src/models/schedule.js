import * as scheduleServices from '../services/schedule';
import {message} from "antd/lib/index";

export default {

    namespace: 'schedule',

    state: {
        scheduleList: [],
        scheduleModalVisible: false
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
    },

    reducers: {
        saveScheduleList(state, action) {
            return { ...state, scheduleList: action.payload.scheduleList };
        },
        handleScheduleModal(state, action) {
            return { ...state, scheduleModalVisible: action.payload.addScheduleSuccess ? !action.payload.addScheduleSuccess : action.payload.scheduleModalVisible};
        },
    },

};
