import React from 'react';
import styles from './login.css';
import { Form, Icon, Input, Button } from 'antd';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
    handleClick = (e) => {
        const { history } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
            console.log('Received values of form: ', values);
            }
        });
        history.push('/main');
    };

    render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <div className={styles.loginContainer}>
            <Form className={styles.loginForm}>
                <FormItem>
                {getFieldDecorator('userName', {
                  // rules: [{ required: true, message: '请输入用户名!' }],
                })(
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                )}
                </FormItem>
                <FormItem>
                {getFieldDecorator('password', {
                  // rules: [{ required: true, message: '请输入密码!' }],
                })(
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                )}
                </FormItem>
                <Button type="primary" onClick={this.handleClick} className={styles.loginFormButton}>
                登录
                </Button>
            </Form>
        </div>
    );
    }
}

const Login = Form.create()(NormalLoginForm);

export default Login;
