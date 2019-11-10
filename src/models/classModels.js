import * as classServices from "../services/classServices";
import { message } from "antd/lib/index";
import { getProtocol } from "../utils/getProtocol";

export default {
  namespace: "classModels",

  state: {
    classList: [],
    classModalVisible: false,
    masterTeacherList: [],
    currentClass: "",
    fileList: []
  },

  subscriptions: {
    setup({ dispatch, history }) {}
  },

  effects: {
    *fetchClassList({ payload }, { call, put }) {
      let data = yield call(classServices.fetchClassList);
      yield put({ type: "saveClassList", payload: data });
    },
    *addClass({ payload }, { call, put }) {
      let data = yield call(classServices.addClass, {
        currentAddClass: payload.currentAddClass
      });
      yield put({ type: "handleClassModal", payload: data });
      if (data.addClassSuccess) {
        message.success("创建成功");
        yield put({ type: "fetchClassList" });
      }
    },
    *fetchMasterTeacherList({ payload }, { call, put }) {
      let data = yield call(classServices.fetchMasterTeacherList);
      yield put({ type: "saveMasterTeacherList", payload: data });
    },
    *deleteClass({ payload }, { call, put }) {
      let data = yield call(classServices.deleteClass, { id: payload.id });
      if (data.deleteClassSuccess) {
        message.success("删除成功");
        yield put({ type: "fetchClassList" });
      }
    },
    *fetchCurrentClass({ payload }, { call, put }) {
      let data = yield call(classServices.fetchCurrentClass, {
        id: payload.id
      });
      yield put({ type: "saveCurrentClass", payload: data });
      let index = data.currentClass["img_url"].lastIndexOf("/");
      let imgName = data.currentClass["img_url"].slice(index + 1);
      const fileList = [
        {
          uid: data.currentClass["img_url"],
          name: imgName,
          status: "done",
          thumbUrl: getProtocol() + data.currentClass["img_url"]
        }
      ];
      yield put({ type: "saveFileList", payload: { fileList } });
    },
    *editClass({ payload }, { call, put }) {
      let data = yield call(classServices.editClass, {
        currentEditClass: payload.currentEditClass
      });
      yield put({ type: "handleClassModal", payload: data });
      if (data.editClassSuccess) {
        message.success("修改成功");
        yield put({ type: "fetchClassList" });
      }
    }
  },

  reducers: {
    saveClassList(state, action) {
      return { ...state, classList: action.payload.classList };
    },
    handleClassModal(state, action) {
      return {
        ...state,
        classModalVisible: action.payload.addClassSuccess
          ? !action.payload.addClassSuccess
          : action.payload.classModalVisible
      };
    },
    saveMasterTeacherList(state, action) {
      return { ...state, masterTeacherList: action.payload.masterTeacherList };
    },
    saveCurrentClass(state, action) {
      return { ...state, currentClass: action.payload.currentClass };
    },
    saveFileList(state, action) {
      return { ...state, fileList: action.payload.fileList };
    }
  }
};
