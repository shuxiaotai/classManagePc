import * as classServices from '../services/classServices';

export default {

    namespace: 'classModels',

    state: {
        classList: []
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
    },

    reducers: {
        saveClassList(state, action) {
            return { ...state, classList: action.payload.classList };
        },
    },

};
