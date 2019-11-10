import * as loginServices from "../services/login";
import { message } from "antd/lib/index";
import { getProtocol } from "../utils/getProtocol";

export default {
  namespace: "login",

  state: {
    isLogin: true
  },

  subscriptions: {
    setup({ dispatch, history }) {}
  },

  effects: {
    *login({ payload }, { call, put }) {
      let data = yield call(loginServices.login, { user: payload.user });
      if (data.loginSuccess) {
        message.success("登录成功");
        localStorage.setItem("token", data.token);
        payload.history.push("/main");
      }
    },
    *register({ payload }, { call, put }) {
      let data = yield call(loginServices.register, { user: payload.user });
      if (data.registerSuccess) {
        message.success("注册成功");
        yield put({
          type: "changeLoginOrRegister",
          payload: { isLogin: true }
        });
      }
    },
    *checkLogin({ payload }, { call, put }) {
      let data = yield call(loginServices.checkLogin, { token: payload.token });
      if (!data.checkResult) {
        message.success("身份登录过期，请重新登录");
        payload.history.push("/");
      }
    }
  },

  reducers: {
    changeLoginOrRegister(state, action) {
      return { ...state, isLogin: action.payload.isLogin };
    }
  }
};
