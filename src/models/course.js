import * as courseServices from "../services/course";
import { message } from "antd/lib/index";
import { getProtocol } from "../utils/getProtocol";

export default {
  namespace: "course",

  state: {
    courseList: [],
    courseModalVisible: false,
    currentCourse: "",
    fileList: []
  },

  subscriptions: {
    setup({ dispatch, history }) {}
  },

  effects: {
    *fetchCourseList({ payload }, { call, put }) {
      let data = yield call(courseServices.fetchCourseList);
      yield put({ type: "saveCourseList", payload: data });
    },
    *addCourse({ payload }, { call, put }) {
      let data = yield call(courseServices.addCourse, {
        currentAddCourse: payload.currentAddCourse
      });
      yield put({ type: "handleCourseModal", payload: data });
      if (data.addCourseSuccess) {
        message.success("创建成功");
        yield put({ type: "fetchCourseList" });
      }
    },
    *deleteCourse({ payload }, { call, put }) {
      let data = yield call(courseServices.deleteCourse, { id: payload.id });
      if (data.deleteCourseSuccess) {
        message.success("删除成功");
        yield put({ type: "fetchCourseList" });
      }
    },
    *fetchCurrentCourse({ payload }, { call, put }) {
      let data = yield call(courseServices.fetchCurrentCourse, {
        id: payload.id
      });
      yield put({ type: "saveCurrentCourse", payload: data });
      let index = data.currentCourse["img_url"].lastIndexOf("/");
      let imgName = data.currentCourse["img_url"].slice(index + 1);
      const fileList = [
        {
          uid: data.currentCourse["img_url"],
          name: imgName,
          status: "done",
          thumbUrl: getProtocol() + data.currentCourse["img_url"]
        }
      ];
      yield put({ type: "saveFileList", payload: { fileList } });
    },
    *editCourse({ payload }, { call, put }) {
      let data = yield call(courseServices.editCourse, {
        currentEditCourse: payload.currentEditCourse
      });
      yield put({ type: "handleCourseModal", payload: data });
      if (data.editCourseSuccess) {
        message.success("修改成功");
        yield put({ type: "fetchCourseList" });
      }
    }
  },

  reducers: {
    saveCourseList(state, action) {
      return { ...state, courseList: action.payload.courseList };
    },
    handleCourseModal(state, action) {
      return {
        ...state,
        courseModalVisible: action.payload.addCourseSuccess
          ? !action.payload.addCourseSuccess
          : action.payload.courseModalVisible
      };
    },
    saveCurrentCourse(state, action) {
      return { ...state, currentCourse: action.payload.currentCourse };
    },
    saveFileList(state, action) {
      return { ...state, fileList: action.payload.fileList };
    }
  }
};
