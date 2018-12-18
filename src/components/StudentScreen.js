import React, { Component } from 'react';
import { Table, Divider } from 'antd';
import { connect } from 'dva';
import styles from './index.css';

const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
}, {
    title: '头像',
    dataIndex: 'avatar_url',
    key: 'avatar_url',
    render: text => <img className={styles.img} src={`http://localhost:3389` + text} />,
}, {
    title: '班级',
    dataIndex: 'class_grade',
    key: 'class_grade',
    render: text => <div>{text === null ? '尚未加入班级' : text}</div>,
},
    {
    title: '班级',
    dataIndex: 'class_name',
    key: 'class_name',
    render: text => <div>{text === null ? '尚未加入班级' : text}</div>,
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
class StudentScreen extends Component {
    componentDidMount() {
        const { fetchStudentList } = this.props;
        fetchStudentList();
    }
    render() {
        const { studentList } = this.props;
        const pagination = {
            defaultPageSize: 7
        };
        return(
            <div>
                <Table
                    columns={columns}
                    dataSource={studentList}
                    rowKey="id"
                    pagination={pagination}
                />
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        studentList: state.student.studentList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchStudentList(){
            dispatch({type: 'student/fetchStudentList'});
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentScreen);
