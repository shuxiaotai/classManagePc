import React, { Component } from 'react';
import { Table, Divider, Pagination } from 'antd';
import { connect } from 'dva';
import styles from './index.css';

const columns = [{
    title: '年级',
    dataIndex: 'grade',
    key: 'grade',
    render: text => <a>{text}</a>,
},{
    title: '班级名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
}, {
    title: '课程头像',
    dataIndex: 'img_url',
    key: 'img_url',
    render: text => <img className={styles.img} src={`http://localhost:3389` + text} />,
},  {
    title: '班主任',
    dataIndex: 'teacher_name',
    key: 'teacher_name',
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
class ClassScreen extends Component {
    componentDidMount() {
        const { fetchClassList } = this.props;
        fetchClassList();
    }
    render() {
        const { classList } = this.props;
        const pagination = {
            defaultPageSize: 7
        };
        return(
            <div>
                <Table
                    columns={columns}
                    dataSource={classList}
                    rowKey="id"
                    pagination={pagination}
                />
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        classList: state.classModels.classList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchClassList(){
            dispatch({type: 'classModels/fetchClassList'});
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassScreen);
