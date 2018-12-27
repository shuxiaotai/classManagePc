import React, { Component } from 'react';
import { Table, Divider, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.css';
import {getProtocol} from "../utils/getProtocol";


const columns = [{
    title: '日程名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
}, {
    title: '日程头像',
    dataIndex: 'img_url',
    key: 'img_url',
    render: text => <img className={styles.img} src={getProtocol() + text} />,
},  {
    title: '默认日程',
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
class ScheduleScreen extends Component {
    componentDidMount() {
        const { fetchScheduleList } = this.props;
        fetchScheduleList();
    }
    render() {
        const { scheduleList } = this.props;
        return(
            <div>
                <Button type="primary" className={styles.createBtn}>
                    创建日程
                </Button>
                <Table
                    columns={columns}
                    dataSource={scheduleList}
                    rowKey="id"
                />
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        scheduleList: state.schedule.scheduleList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchScheduleList(){
            dispatch({type: 'schedule/fetchScheduleList'});
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleScreen);
