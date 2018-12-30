import React, { Component } from 'react';
import { Table, Divider, Button, Modal, Form, Input, Switch, Upload, Icon } from 'antd';
import { connect } from 'dva';
import styles from './index.css';
import {getProtocol} from "../utils/getProtocol";

const FormItem = Form.Item;

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

const formItemLayout = {
    labelCol: {span: 4, offset: 0},
    wrapperCol: {span: 18, offset: 1},
};
class TemplateScreen extends Component {
    constructor() {
        super();
        this.state = {
            templateType: true,
            defaultTemplateCheck: true,
            showUploadList: false
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
    showModal = () => {
        const { handleTemplateModal } = this.props;
        handleTemplateModal(true);
        this.props.form.resetFields();
        this.setState({
            defaultTemplateCheck: true,
            showUploadList: false
        });
    };
    changeImg = (e) => {
        if (e.fileList.length === 2) {
            e.fileList.shift();
        }
        this.setState({
            showUploadList: true
        });
    };
    handleOk = (e) => {
        const { defaultTemplateCheck, templateType } = this.state;
        const { addTemplate } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.isDefault = defaultTemplateCheck;
                values.templateImg = values.templateImg.file;
                values.isPraise = templateType;
                addTemplate(values);
            }
        });
    };
    handleCancel = (e) => {
        const { handleTemplateModal } = this.props;
        handleTemplateModal(false);
    };
    onChange = (checked) => {
        this.setState({
            defaultTemplateCheck: checked
        });
    };
    render() {
        const { templateList, templateModalVisible } = this.props;
        const { templateType } = this.state;
        const { getFieldDecorator } = this.props.form;
        const fileList = [];
        const uploadProps = {
            action: 'http://localhost:3389/api/addTemplate',
            listType: 'picture',
            defaultFileList: [...fileList],
        };
        const pagination = {
            defaultPageSize: 6
        };
        return(
            <div style={{ position: 'relative' }}>
                <Button type="primary"
                    className={styles.createBtn}
                    onClick={this.showModal}
                >
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
                    pagination={pagination}
                />
                <Modal
                    title="创建模板"
                    visible={templateModalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消"
                >
                    <Form>
                        <FormItem
                            label="模板名称"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('templateName', {
                                rules: [{ required: true, message: '请输入模板名称!' }],
                            })(
                                <Input
                                />
                            )}
                        </FormItem>
                        <FormItem
                            label="模板头像"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('templateImg', {
                                rules: [{ required: true, message: '请选择模板图片!' }],
                            })(
                                <Upload
                                    {...uploadProps}
                                    onChange={this.changeImg}
                                    showUploadList={this.state.showUploadList}
                                >
                                    <Button>
                                        <Icon type="upload" /> 上传模板图片
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                        <FormItem
                            label="分数"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('templateScore', {
                                rules: [{ required: true, message: '请输入模板分数!' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label="默认点评"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('isDefault', {
                            })(
                                <Switch defaultChecked onChange={this.onChange} />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        templateList: state.template.templateList,
        templateModalVisible: state.template.templateModalVisible
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchTemplateList(isPraise){
            dispatch({type: 'template/fetchTemplateList', payload: { isPraise } });
        },
        addTemplate(currentAddTemplate){
            dispatch({type: 'template/addTemplate', payload: { currentAddTemplate } });
        },
        handleTemplateModal(templateModalVisible){
            dispatch({type: 'template/handleTemplateModal', payload: { templateModalVisible } });
        }
    }
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(TemplateScreen));
