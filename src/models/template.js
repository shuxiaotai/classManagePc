import * as templateServices from '../services/template';
import { message } from 'antd';

export default {

    namespace: 'template',

    state: {
        templateList: [],
        templateModalVisible: false
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
        *addTemplate({ payload }, { call, put }) {
            let data = yield call(templateServices.addTemplate, {currentAddTemplate : payload.currentAddTemplate});
            yield put({ type: 'handleTemplateModal', payload: data });
            if (data.addTemplateSuccess) {
                message.success('创建成功');
                yield put({ type: 'fetchTemplateList', payload: {isPraise : payload.currentAddTemplate.isPraise ? 0 : 1} });
            }
        },
    },

    reducers: {
        saveTemplateList(state, action) {
            return { ...state, templateList: action.payload.templateList };
        },
        handleTemplateModal(state, action) {
            return { ...state, templateModalVisible: action.payload.addTemplateSuccess ? !action.payload.addTemplateSuccess : action.payload.templateModalVisible};
        },
    },

};
