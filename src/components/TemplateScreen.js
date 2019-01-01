import React, { Component } from 'react';
import { Table, Divider, Button, Modal, Form, Input, Upload, Icon, Popconfirm, Switch } from 'antd';
import { connect } from 'dva';
import styles from './index.css';
import {getProtocol} from "../utils/getProtocol";

const FormItem = Form.Item;

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
            showUploadList: false,
            isCreate: true,
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
            showUploadList: false,
            isCreate: true
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
    changeEditImg = (e) => {
        const { saveFileList } = this.props;
        if (e.fileList.length === 2) {
            e.fileList.shift();
        }
        saveFileList(e.fileList);
    };
    handleOk = (e) => {
        const { defaultTemplateCheck, templateType, isCreate } = this.state;
        const { addTemplate, currentTemplate, editTemplate } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (isCreate) {
                    values.isDefault = defaultTemplateCheck;
                    values.templateImg = values.templateImg.file;
                    values.isPraise = templateType;
                    addTemplate(values);
                } else {
                    values.isPraise = templateType;
                    values.templateImg = values.templateImg[0] ? values.templateImg[0] : values.templateImg.file;
                    values.id = currentTemplate.id;
                    editTemplate(values);
                    this.props.form.resetFields();
                }
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
    handleDelete = (id, isPraise) => {
        const { deleteTemplate } = this.props;
        deleteTemplate(id, isPraise);
    };
    handleEdit = (id, isPraise) => {
        const { handleTemplateModal, fetchCurrentTemplate } = this.props;
        fetchCurrentTemplate(id);
        handleTemplateModal(true);
        this.setState({
            isCreate: false,
            showUploadList: true
        });

    };
    removeFileList = () => {
        const { saveFileList } = this.props;
        saveFileList([]);
    };
    render() {
        const { templateList, templateModalVisible, currentTemplate, fileList } = this.props;
        const { templateType, isCreate } = this.state;
        const { getFieldDecorator } = this.props.form;
        const uploadProps = {
            action: `${isCreate ? `${getProtocol()}/api/addTemplate` : `${getProtocol()}/api/editTemplate`}`,
            listType: 'picture',
            defaultFileList: [...fileList],
        };
        const pagination = {
            defaultPageSize: 6
        };
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
                     <Popconfirm
                         title="确认修改?"
                         onConfirm={() => this.handleEdit(record.id, this.state.templateType)}
                         okText="确认"
                         cancelText="取消"
                     >
                        <a href="javascript:;">修改</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => this.handleDelete(record.id, this.state.templateType)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </span>
            ),
        }];
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
                    title={isCreate ? '创建模板' : '修改模板'}
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
                                initialValue: isCreate ? '' : (currentTemplate !== '' ? currentTemplate.name : '')
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            label="模板头像"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('templateImg', {
                                rules: [{ required: true, message: '请选择模板图片!' }],
                                initialValue: isCreate ? '' : (currentTemplate !== '' ? fileList : '')
                            })(
                                isCreate ?
                                    (<Upload
                                        {...uploadProps}
                                        onChange={this.changeImg}
                                        showUploadList={this.state.showUploadList}
                                    >
                                        <Button>
                                            <Icon type="upload" /> 上传模板图片
                                        </Button>
                                    </Upload>)
                                    :
                                    (<Upload
                                        {...uploadProps}
                                        onChange={this.changeEditImg}
                                        showUploadList={this.state.showUploadList}
                                        fileList={fileList}
                                        onRemove={this.removeFileList}
                                    >
                                        <Button>
                                            <Icon type="upload" /> 修改模板图片
                                        </Button>
                                    </Upload>)
                            )}
                        </FormItem>
                        <FormItem
                            label="分数"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('templateScore', {
                                rules: [{ required: true, message: '请输入模板分数!' }],
                                initialValue: isCreate ? '' : (currentTemplate !== '' ? currentTemplate.score : '')
                            })(
                                <Input />
                            )}
                        </FormItem>
                        {
                            isCreate ? <FormItem
                                label="默认点评"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('isDefault', {
                                })(
                                    <Switch defaultChecked onChange={this.onChange} />
                                )}
                            </FormItem> : null
                        }

                    </Form>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        templateList: state.template.templateList,
        templateModalVisible: state.template.templateModalVisible,
        currentTemplate: state.template.currentTemplate,
        fileList: state.template.fileList
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
        },
        deleteTemplate(id, isPraise){
            dispatch({type: 'template/deleteTemplate', payload: { id, isPraise } });
        },
        fetchCurrentTemplate(id){
            dispatch({type: 'template/fetchCurrentTemplate', payload: { id } });
        },
        saveFileList(fileList){
            dispatch({type: 'template/saveFileList', payload: { fileList } });
        },
        editTemplate(currentEditTemplate){
            dispatch({type: 'template/editTemplate', payload: { currentEditTemplate } });
        },
    }
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(TemplateScreen));
