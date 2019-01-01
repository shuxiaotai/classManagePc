import React, { Component } from 'react';
import { Table, Divider, Button, Modal, Form, Input, Switch, Upload, Icon, Popconfirm } from 'antd';
import { connect } from 'dva';
import styles from './index.css';
import {getProtocol} from "../utils/getProtocol";

const FormItem = Form.Item;


const formItemLayout = {
    labelCol: {span: 4, offset: 0},
    wrapperCol: {span: 18, offset: 1},
};
class ScheduleScreen extends Component {
    constructor() {
        super();
        this.state = {
            defaultTemplateCheck: true,
            showUploadList: false,
            isCreate: true,
        }
    }
    componentDidMount() {
        const { fetchScheduleList } = this.props;
        fetchScheduleList();
    }
    showModal = () => {
        const { handleScheduleModal } = this.props;
        handleScheduleModal(true);
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
    handleOk = (e) => {
        const { defaultTemplateCheck, isCreate } = this.state;
        const { addSchedule, currentSchedule, editSchedule } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (isCreate) {
                    values.isDefault = defaultTemplateCheck;
                    values.scheduleImg = values.scheduleImg.file;
                    addSchedule(values);
                } else {
                    values.id = currentSchedule.id;
                    values.scheduleImg = values.scheduleImg[0] ? values.scheduleImg[0] : values.scheduleImg.file;
                    editSchedule(values);
                    this.props.form.resetFields();
                }
            }
        });
    };
    handleCancel = (e) => {
        const { handleScheduleModal } = this.props;
        handleScheduleModal(false);
    };
    onChange = (checked) => {
        this.setState({
            defaultTemplateCheck: checked
        });
    };
    handleDelete = (id) => {
        const { deleteSchedule } = this.props;
        deleteSchedule(id);
    };
    handleEdit = (id) => {
        const { handleScheduleModal, fetchCurrentSchedule } = this.props;
        fetchCurrentSchedule(id);
        handleScheduleModal(true);
        this.setState({
            isCreate: false,
            showUploadList: true
        });

    };
    removeFileList = () => {
        const { saveFileList } = this.props;
        saveFileList([]);
    };
    changeEditImg = (e) => {
        const { saveFileList } = this.props;
        if (e.fileList.length === 2) {
            e.fileList.shift();
        }
        saveFileList(e.fileList);
    };
    render() {
        const { scheduleList, scheduleModalVisible, currentSchedule, fileList } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { isCreate } = this.state;
        const uploadProps = {
            action: `${isCreate ? 'http://localhost:3389/api/addSchedule' : 'http://localhost:3389/api/editSchedule'}`,
            listType: 'picture',
            defaultFileList: [...fileList],
        };
        const pagination = {
            defaultPageSize: 6
        };
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
                     <Popconfirm
                         title="确认修改?"
                         onConfirm={() => this.handleEdit(record.id)}
                         okText="确认"
                         cancelText="取消"
                     >
                        <a href="javascript:;">修改</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => this.handleDelete(record.id)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </span>
            ),
        }];
        return(
            <div>
                <Button
                    type="primary"
                    className={styles.createBtn}
                    onClick={this.showModal}
                >
                    创建日程
                </Button>
                <Table
                    columns={columns}
                    dataSource={scheduleList}
                    rowKey="id"
                    pagination={pagination}
                />
                <Modal
                    title={isCreate ? '创建日程' : '修改日程'}
                    visible={scheduleModalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消"
                >
                    <Form>
                        <FormItem
                            label="日程名称"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('scheduleName', {
                                rules: [{ required: true, message: '请输入日程名称!' }],
                                initialValue: isCreate ? '' : (currentSchedule !== '' ? currentSchedule.name : '')
                            })(
                                <Input
                                />
                            )}
                        </FormItem>
                        <FormItem
                            label="日程头像"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('scheduleImg', {
                                rules: [{ required: true, message: '请选择日程头像!' }],
                                initialValue: isCreate ? '' : (currentSchedule !== '' ? fileList : '')
                            })(
                                isCreate ?
                                    <Upload
                                        {...uploadProps}
                                        onChange={this.changeImg}
                                        showUploadList={this.state.showUploadList}
                                    >
                                        <Button>
                                            <Icon type="upload" /> 上传日程头像
                                        </Button>
                                    </Upload> :
                                    <Upload
                                        {...uploadProps}
                                        onChange={this.changeEditImg}
                                        showUploadList={this.state.showUploadList}
                                        fileList={fileList}
                                        onRemove={this.removeFileList}
                                    >
                                        <Button>
                                            <Icon type="upload" /> 修改日程头像
                                        </Button>
                                    </Upload>
                            )}
                        </FormItem>
                        {
                            isCreate ?
                                <FormItem
                                    label="默认日程"
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
        scheduleList: state.schedule.scheduleList,
        scheduleModalVisible: state.schedule.scheduleModalVisible,
        currentSchedule: state.schedule.currentSchedule,
        fileList: state.schedule.fileList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchScheduleList(){
            dispatch({type: 'schedule/fetchScheduleList'});
        },
        addSchedule(currentAddSchedule){
            dispatch({type: 'schedule/addSchedule', payload: { currentAddSchedule } });
        },
        handleScheduleModal(scheduleModalVisible){
            dispatch({type: 'schedule/handleScheduleModal', payload: { scheduleModalVisible } });
        },
        deleteSchedule(id){
            dispatch({type: 'schedule/deleteSchedule', payload: { id } });
        },
        fetchCurrentSchedule(id){
            dispatch({type: 'schedule/fetchCurrentSchedule', payload: { id } });
        },
        saveFileList(fileList){
            dispatch({type: 'schedule/saveFileList', payload: { fileList } });
        },
        editSchedule(currentEditSchedule){
            dispatch({type: 'schedule/editSchedule', payload: { currentEditSchedule } });
        },
    }
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(ScheduleScreen));
