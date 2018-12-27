import React, { Component } from 'react';
import { Table, Divider, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.css';
import {getProtocol} from "../utils/getProtocol";

const columns = [{
    title: '课程名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
}, {
    title: '课程头像',
    dataIndex: 'img_url',
    key: 'img_url',
    render: text => <img className={styles.img} src={getProtocol() + text} />,
},  {
    title: '默认课程',
    dataIndex: 'is_default',
    key: 'is_default',
    render: text => <div>{text === '0' ? '是' : '否'}</div>,
},{
    title: '操作',
    key: 'action',
    render: (text, record) => (
        <span>
            <a href="javascript:;">编辑</a>
            <Divider type="vertical" />
            <a href="javascript:;">删除</a>
        </span>
    ),
}];
class CourseScreen extends Component {
    componentDidMount() {
        const { fetchCourseList } = this.props;
        fetchCourseList();
    }
    render() {
        const { courseList } = this.props;
        return(
            <div>
                <Button type="primary" className={styles.createBtn}>
                    创建课程
                </Button>
                <Table
                    columns={columns}
                    dataSource={courseList}
                    rowKey="id"
                />
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        courseList: state.course.courseList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCourseList(){
            dispatch({type: 'course/fetchCourseList'});
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseScreen);
