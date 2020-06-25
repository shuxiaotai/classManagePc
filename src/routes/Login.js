import React from "react";
import styles from "./login.css";
import { Layout, Form, Icon, Input, Button } from "antd";
import { connect } from "dva";

const FormItem = Form.Item;
const { Footer } = Layout;

class NormalLoginForm extends React.Component {
  constructor() {
    super();
  }
  handleClick = e => {
    const { history, login, isLogin, register } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        if (isLogin) {
          login(values, history);
        } else {
          register(values);
        }
      }
    });
  };
  toLoginOrRegister = () => {
    const { changeLoginOrRegister, isLogin } = this.props;
    changeLoginOrRegister(!isLogin);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { isLogin } = this.props;
    return (
      <div>
        <div className={styles.loginContainer}>
          <Form className={styles.loginForm}>
            <div className={styles.loginTop}>
              <img
                src={require("../assets/classManage.jpg")}
                className={styles.classManageImg}
              />
              <span className={styles.loginTitle}>
                小学课堂管理软件管理员{isLogin ? "登录" : "注册"}
              </span>
            </div>
            <FormItem>
              {getFieldDecorator("username", {
                rules: [{ required: true, message: "请输入用户名!" }]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="用户名"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator("password", {
                rules: [{ required: true, message: "请输入密码!" }]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              )}
            </FormItem>
            <Button
              type="primary"
              onClick={this.handleClick}
              className={styles.loginFormButton}
            >
              {isLogin ? "登录" : "注册"}
            </Button>
            <span className={styles.tips} onClick={this.toLoginOrRegister}>
              {!isLogin ? "去登录" : "去注册"}
            </span>
          </Form>
        </div>
        <Footer
          style={{
            textAlign: "center",
            position: "absolute",
            right: 0,
            left: 0,
            bottom: 0
          }}
        >
          课堂管理 ©2020 Created by shuxiaotai{" "}
          <a
            onClick={() =>
              window.open("http://www.beian.miit.gov.cn", "_blank")
            }
          >
            浙ICP备18045486号
          </a>
        </Footer>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    isLogin: state.login.isLogin
  };
};
const mapDispatchToProps = dispatch => {
  return {
    login(user, history) {
      dispatch({ type: "login/login", payload: { user, history } });
    },
    register(user) {
      dispatch({ type: "login/register", payload: { user } });
    },
    changeLoginOrRegister(isLogin) {
      dispatch({ type: "login/changeLoginOrRegister", payload: { isLogin } });
    }
  };
};

const Login = Form.create()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NormalLoginForm)
);

export default Login;
