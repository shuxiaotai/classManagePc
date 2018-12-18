import * as templateServices from '../services/template';

export default {

    namespace: 'template',

    state: {
        templateList: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
        },
    },

    effects: {
        *fetchTemplateList({ payload }, { call, put }) {
            let data = yield call(templateServices.fetchTemplateList, {isPraise : payload.isPraise});
            yield put({ type: 'saveTemplateList', payload: data });
        },
    },

    reducers: {
        saveTemplateList(state, action) {
            return { ...state, templateList: action.payload.templateList };
        },
    },

};
