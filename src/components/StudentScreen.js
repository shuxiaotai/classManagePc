import React, { Component } from 'react';
import { Table, Divider, Button, Modal, Form, Input, Select, Upload, Icon } from 'antd';
import { connect } from 'dva';
import styles from './index.css';
import {getProtocol} from "../utils/getProtocol";

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: {span: 4, offset: 0},
    wrapperCol: {span: 18, offset: 1},
};
const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
}, {
    title: '头像',
    dataIndex: 'avatar_url',
    key: 'avatar_url',
    render: text => <img className={styles.img} src={getProtocol() + text} />,
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
    constructor() {
        super();
        this.state = {
            showUploadList: false
        }
    }
    componentDidMount() {
        const { fetchStudentList } = this.props;
        fetchStudentList();
    }
    showModal = () => {
        const { handleStudentModal, fetchClassList } = this.props;
        handleStudentModal(true);
        this.props.form.resetFields();
        fetchClassList();
        this.setState({
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
        const { addStudent } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.studentImg = values.studentImg.file;
                addStudent(values);
            }
        });
    };
    handleCancel = (e) => {
        const { handleStudentModal } = this.props;
        handleStudentModal(false);
    };
    handleChange = (value) => {
        console.log(`selected ${value}`);
    };
    render() {
        const { studentList, studentModalVisible, classList } = this.props;
        const { getFieldDecorator } = this.props.form;
        const fileList = [];
        const uploadProps = {
            action: 'http://localhost:3389/api/addStudent',
            listType: 'picture',
            defaultFileList: [...fileList],
        };
        const pagination = {
            defaultPageSize: 6
        };
        return(
            <div>
                <Button
                    type="primary"
                    className={styles.createBtn}
                    onClick={this.showModal}
                >
                    创建学生
                </Button>
                <Table
                    columns={columns}
                    dataSource={studentList}
                    rowKey="id"
                    pagination={pagination}
                />
                <Modal
                    title="创建学生"
                    visible={studentModalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消"
                >
                    <Form>
                        <FormItem
                            label="学生姓名"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('studentName', {
                                rules: [{ required: true, message: '请输入学生姓名!' }],
                            })(
                                <Input
                                />
                            )}
                        </FormItem>
                        <FormItem
                            label="学生头像"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('studentImg', {
                                rules: [{ required: true, message: '请选择学生头像!' }],
                            })(
                                <Upload
                                    {...uploadProps}
                                    onChange={this.changeImg}
                                    showUploadList={this.state.showUploadList}
                                >
                                    <Button>
                                        <Icon type="upload" /> 上传学生头像
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                        <FormItem
                            label="选择班级"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('studentClass', {
                                rules: [{ required: true, message: '请选择班级!' }],
                            })(
                                <Select style={{ width: 120 }} onChange={this.handleChange}>
                                    {
                                        classList.map((item, index) => {
                                            return(
                                                <Option key={item.id}>{item.grade}{item.name}</Option>
                                            );
                                        })
                                    }
                                </Select>
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
        studentList: state.student.studentList,
        studentModalVisible: state.student.studentModalVisible,
        classList: state.classModels.classList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchStudentList(){
            dispatch({type: 'student/fetchStudentList'});
        },
        addStudent(currentAddStudent){
            dispatch({type: 'student/addStudent', payload: { currentAddStudent } });
        },
        handleStudentModal(studentModalVisible){
            dispatch({type: 'student/handleStudentModal', payload: { studentModalVisible } });
        },
        fetchClassList(){
            dispatch({type: 'classModels/fetchClassList'});
        }
    }
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(StudentScreen));
