import React, { Component } from 'react';
import { Table, Divider, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.css';
import {getProtocol} from "../utils/getProtocol";


const columns = [{
    title: '模板名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
}, {
    title: '模板头像',
    dataIndex: 'img_url',
    key: 'img_url',
    render: text => <img className={styles.img} src={getProtocol() + text} />,
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
    constructor() {
        super();
        this.state = {
            templateType: true
        }
    }
    componentDidMount() {
        const { fetchTemplateList } = this.props;
        fetchTemplateList(0);
    }
    changeTemplateType = () => {
        const { templateType } = this.state;
        const { fetchTemplateList } = this.props;
        this.setState({
            templateType: !templateType
        });
        if (templateType === true) {
            fetchTemplateList(1);
        } else {
            fetchTemplateList(0);
        }
    };
    render() {
        const { templateList } = this.props;
        const { templateType } = this.state;
        return(
            <div style={{ position: 'relative' }}>
                <Button type="primary" className={styles.createBtn}>
                    创建模板
                </Button>
                <Button type="primary"
                    className={styles.templateBtn}
                    onClick={this.changeTemplateType}
                >
                    切换到{(templateType === true) ? '批评' : '表扬'}模板
                </Button>
                <div style={{position: 'absolute', right: 10, top: 10 }}>当前为{(templateType === true) ? '表扬' : '批评'}模板</div>
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
