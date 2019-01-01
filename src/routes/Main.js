import React from 'react';
import styles from './main.css';
import { Layout, Menu, Icon, Button} from 'antd';
import TemplateScreen from "../components/TemplateScreen";
import ProjectScreen from "../components/ScheduleScreen";
import CourseScreen from "../components/CourseScreen";
import ClassScreen from "../components/ClassScreen";
import StudentScreen from "../components/StudentScreen";
import { connect } from 'dva';
import jwt_decode from "jwt-decode";


const { Content, Footer, Sider } = Layout;

class Main extends React.Component {
    state = {
      collapsed: false,
      selectKey: '1',
    };
    componentDidMount() {
        const { checkLogin, history } = this.props;
        let token = localStorage.getItem('token');
        if (!token) {
            history.push('/');
        } else {
            checkLogin(token);
        }
    }
    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    };
    getPathName = () => {
        const { selectKey } = this.state;
        let pathTips = '';
        switch (selectKey) {
            case '1':
                pathTips = '模板管理';
                break;
            case '2':
                pathTips = '日程管理';
                break;
            case '3':
                pathTips = '课程管理';
                break;
            case '4':
                pathTips = '班级管理';
                break;
            case '5':
                pathTips = '学生管理';
                break;
        }
        return(
            <div>
                {pathTips}
            </div>
        )
    };
    selectMenu = ({ key }) => {
        this.setState({
          selectKey: key
        });
    };
    toLogout = () => {
        const { history } = this.props;
        localStorage.removeItem('token');
        history.push('/');
    };
    render() {
        const { selectKey, collapsed } = this.state;
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    <div className={styles.logo} >
                        <img src={require('../assets/classManage.jpg')} className={!collapsed ? styles.classManageImg :  styles.classManageImgHidden} />
                    </div>
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        onClick={this.selectMenu}
                    >
                        <Menu.Item key="1">
                            <Icon type="pie-chart" />
                            <span>模板管理</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="desktop" />
                            <span>日程管理</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="file" />
                            <span>课程管理</span>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Icon type="team" />
                            <span>班级管理</span>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Icon type="user" />
                            <span>学生管理</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    {/*<Header style={{ background: '#fff', padding: 0 }} />*/}
                    <Content style={{ margin: '0 16px' }}>
                        <div
                            style={{ margin: '16px 0' }}
                        >
                            {this.getPathName()}
                            <div className={styles.userContainer}>
                                <span className={styles.userText}>欢迎您 {jwt_decode(localStorage.getItem('token')).username} </span>
                                <Button
                                    type="primary"
                                    onClick={this.toLogout}
                                >
                                    退出
                                </Button>
                            </div>
                        </div>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            {
                                selectKey === '1' ? <TemplateScreen /> : null
                            }
                            {
                                selectKey === '2' ? <ProjectScreen /> : null
                            }
                            {
                                selectKey === '3' ? <CourseScreen /> : null
                            }
                            {
                                selectKey === '4' ? <ClassScreen /> : null
                            }
                            {
                                selectKey === '5' ? <StudentScreen /> : null
                            }

                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        课堂管理 ©2018 Created by shuxiaotai
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        checkLogin(token, history){
            dispatch({type: 'login/checkLogin', payload: { token, history } });
        }
    }
};

export default connect(null, mapDispatchToProps)(Main);
