import * as templateServices from '../services/template';
import { message } from 'antd';
import {getProtocol} from "../utils/getProtocol";

export default {

    namespace: 'template',

    state: {
        templateList: [],
        templateModalVisible: false,
        currentTemplate: '',
        fileList: [],
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
        *deleteTemplate({ payload }, { call, put }) {
            let data = yield call(templateServices.deleteTemplate, {id : payload.id});
            if (data.deleteTemplateSuccess) {
                message.success('删除成功');
                yield put({ type: 'fetchTemplateList', payload: {isPraise : payload.isPraise ? 0 : 1} });
            }
        },
        *fetchCurrentTemplate({ payload }, { call, put }) {
            let data = yield call(templateServices.fetchCurrentTemplate, {id : payload.id});
            yield put({ type: 'saveCurrentTemplate', payload: data });
            let index = data.currentTemplate['img_url'].lastIndexOf('/');
            let imgName = data.currentTemplate['img_url'].slice(index + 1);
            const fileList = [{
                uid: data.currentTemplate['img_url'],
                name: imgName,
                status: 'done',
                thumbUrl: getProtocol() + data.currentTemplate['img_url']
            }];
            yield put({ type: 'saveFileList', payload: { fileList } });
        },
        *editTemplate({ payload }, { call, put }) {
            let data = yield call(templateServices.editTemplate, {currentEditTemplate : payload.currentEditTemplate});
            yield put({ type: 'handleTemplateModal', payload: data });
            if (data.editTemplateSuccess) {
                message.success('修改成功');
                yield put({ type: 'fetchTemplateList', payload: {isPraise : payload.currentEditTemplate.isPraise ? 0 : 1} });
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
        saveCurrentTemplate(state, action) {
            return { ...state, currentTemplate: action.payload.currentTemplate };
        },
        saveFileList(state, action) {
            return { ...state, fileList: action.payload.fileList };
        },
    },

};
