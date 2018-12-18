import * as scheduleServices from '../services/schedule';

export default {

    namespace: 'schedule',

    state: {
        scheduleList: []
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
    },

    reducers: {
        saveScheduleList(state, action) {
            return { ...state, scheduleList: action.payload.scheduleList };
        },
    },

};
