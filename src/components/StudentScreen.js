import React, { Component } from 'react';
import { Table, Divider, Button, Modal, Form, Input, Select, Upload, Icon, Popconfirm } from 'antd';
import { connect } from 'dva';
import styles from './index.css';
import {getProtocol} from "../utils/getProtocol";

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: {span: 4, offset: 0},
    wrapperCol: {span: 18, offset: 1},
};
class StudentScreen extends Component {
    constructor() {
        super();
        this.state = {
            showUploadList: false,
            isCreate: true,
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
        const { addStudent, currentStudent, editStudent } = this.props;
        const { isCreate } = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (isCreate) {
                    values.studentImg = values.studentImg.file;
                    addStudent(values);
                }else {
                    values.id = currentStudent.id;
                    if (values.studentClass === (currentStudent['class_grade'] + currentStudent['class_name'])){
                        values.studentClass = currentStudent['class_id'].toString();
                    }
                    values.studentImg = values.studentImg[0] ? values.studentImg[0] : values.studentImg.file;
                    editStudent(values);
                    this.props.form.resetFields();
                }
            }
        });
    };
    handleCancel = (e) => {
        const { handleStudentModal } = this.props;
        handleStudentModal(false);
    };
    handleChange = (value) => {
        console.log(`selected ${value}`);
        console.log(JSON.stringify(value));
    };
    handleDelete = (id) => {
        const { deleteStudent } = this.props;
        deleteStudent(id);
    };
    handleEdit = (id) => {
        const { handleStudentModal, fetchCurrentStudent, fetchClassList } = this.props;
        fetchCurrentStudent(id);
        handleStudentModal(true);
        fetchClassList();
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
        const { studentList, studentModalVisible, classList, currentStudent, fileList } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { isCreate } = this.state;
        const uploadProps = {
            action: `${getProtocol()}/api/addStudent`,
            listType: 'picture',
            defaultFileList: [...fileList],
        };
        const pagination = {
            defaultPageSize: 6
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
                    创建学生
                </Button>
                <Table
                    columns={columns}
                    dataSource={studentList}
                    rowKey="id"
                    pagination={pagination}
                />
                <Modal
                    title={isCreate ? '创建学生' : '修改学生'}
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
                                initialValue: isCreate ? '' : (currentStudent !== '' ? currentStudent.name : '')
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
                                initialValue: isCreate ? '' : (currentStudent !== '' ? fileList : '')
                            })(
                                isCreate ?
                                    <Upload
                                        {...uploadProps}
                                        onChange={this.changeImg}
                                        showUploadList={this.state.showUploadList}
                                    >
                                        <Button>
                                            <Icon type="upload" /> 上传学生头像
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
                                            <Icon type="upload" /> 修改学生头像
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
                                initialValue: isCreate ? '' : (currentStudent !== '' ? (currentStudent['class_grade'] + currentStudent['class_name']): '')
                            })(
                                <Select
                                    style={{ width: 120 }}
                                    onChange={this.handleChange}
                                    // labelInValue
                                >
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
        classList: state.classModels.classList,
        currentStudent: state.student.currentStudent,
        fileList: state.student.fileList
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
        },
        deleteStudent(id){
            dispatch({type: 'student/deleteStudent', payload: { id } });
        },
        fetchCurrentStudent(id){
            dispatch({type: 'student/fetchCurrentStudent', payload: { id } });
        },
        saveFileList(fileList){
            dispatch({type: 'student/saveFileList', payload: { fileList } });
        },
        editStudent(currentEditStudent){
            dispatch({type: 'student/editStudent', payload: { currentEditStudent } });
        },
    }
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(StudentScreen));
