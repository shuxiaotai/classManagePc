import React, { Component } from 'react';
import { Table, Divider } from 'antd';
import { connect } from 'dva';
import styles from './index.css';

const columns = [{
    title: '模板名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
}, {
    title: '模板头像',
    dataIndex: 'img_url',
    key: 'img_url',
    render: text => <img className={styles.img} src={`http://localhost:3389` + text} />,
}, {
    title: '分数',
    dataIndex: 'score',
    key: 'score',
},  {
    title: '默认点评模板',
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

class TemplateScreen extends Component {
    componentDidMount() {
        const { fetchTemplateList } = this.props;
        fetchTemplateList(0);
    }
    render() {
        const { templateList } = this.props;
        return(
            <div>
                <Table
                    columns={columns}
                    dataSource={templateList}
                    rowKey="id"
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        templateList: state.template.templateList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchTemplateList(isPraise){
            dispatch({type: 'template/fetchTemplateList', payload: { isPraise } });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateScreen);
