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
            showUploadList: false
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
        const { defaultTemplateCheck } = this.state;
        const { addSchedule } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.isDefault = defaultTemplateCheck;
                values.scheduleImg = values.scheduleImg.file;
                addSchedule(values);
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
    render() {
        const { scheduleList, scheduleModalVisible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const fileList = [];
        const uploadProps = {
            action: 'http://localhost:3389/api/addSchedule',
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
                    <a href="javascript:;">编辑</a>
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
                    title="创建日程"
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
                            })(
                                <Upload
                                    {...uploadProps}
                                    onChange={this.changeImg}
                                    showUploadList={this.state.showUploadList}
                                >
                                    <Button>
                                        <Icon type="upload" /> 上传日程头像
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                        <FormItem
                            label="默认日程"
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
        scheduleList: state.schedule.scheduleList,
        scheduleModalVisible: state.schedule.scheduleModalVisible
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
        }
    }
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(ScheduleScreen));
