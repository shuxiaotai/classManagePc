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

class CourseScreen extends Component {
    constructor() {
        super();
        this.state = {
            defaultTemplateCheck: true,
            showUploadList: false,
            isCreate: true,
        }
    }
    componentDidMount() {
        const { fetchCourseList } = this.props;
        fetchCourseList();
    }
    showModal = () => {
        const { handleCourseModal } = this.props;
        handleCourseModal(true);
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
        const { addCourse, currentCourse, editCourse } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (isCreate) {
                    values.isDefault = defaultTemplateCheck;
                    values.courseImg = values.courseImg.file;
                    addCourse(values);
                } else {
                    values.id = currentCourse.id;
                    values.courseImg = values.courseImg[0] ? values.courseImg[0] : values.courseImg.file;
                    editCourse(values);
                    this.props.form.resetFields();
                }
            }
        });
    };
    handleCancel = (e) => {
        const { handleCourseModal } = this.props;
        handleCourseModal(false);
    };
    onChange = (checked) => {
        this.setState({
            defaultTemplateCheck: checked
        });
    };
    handleDelete = (id) => {
        const { deleteCourse } = this.props;
        deleteCourse(id);
    };
    handleEdit = (id) => {
        const { handleCourseModal, fetchCurrentCourse } = this.props;
        fetchCurrentCourse(id);
        handleCourseModal(true);
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
        const { courseList, courseModalVisible, fileList, currentCourse } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { isCreate } = this.state;
        const uploadProps = {
            action: 'http://localhost:3389/api/addCourse',
            listType: 'picture',
            defaultFileList: [...fileList],
        };
        const pagination = {
            defaultPageSize: 6
        };
        const columns = [{
            title: '课程名称',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        }, {
            title: '课程头像',
            dataIndex: 'img_url',
            key: 'img_url',
            render: text => <img className={styles.img} src={getProtocol() + text} />,
        },  {
            title: '默认课程',
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
                <Button type="primary"
                    className={styles.createBtn}
                    onClick={this.showModal}
                >
                    创建课程
                </Button>
                <Table
                    columns={columns}
                    dataSource={courseList}
                    rowKey="id"
                    pagination={pagination}
                />
                <Modal
                    title={isCreate ? '创建课程' : '修改课程'}
                    visible={courseModalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消"
                >
                    <Form>
                        <FormItem
                            label="课程名称"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('courseName', {
                                rules: [{ required: true, message: '请输入课程名称!' }],
                                initialValue: isCreate ? '' : (currentCourse !== '' ? currentCourse.name : '')
                            })(
                                <Input
                                />
                            )}
                        </FormItem>
                        <FormItem
                            label="课程头像"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('courseImg', {
                                rules: [{ required: true, message: '请选择课程头像!' }],
                                initialValue: isCreate ? '' : (currentCourse !== '' ? fileList : '')
                            })(
                                isCreate ?
                                    <Upload
                                        {...uploadProps}
                                        onChange={this.changeImg}
                                        showUploadList={this.state.showUploadList}
                                    >
                                        <Button>
                                            <Icon type="upload" /> 上传课程头像
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
                                            <Icon type="upload" /> 修改课程头像
                                        </Button>
                                    </Upload>
                            )}
                        </FormItem>
                        {
                            isCreate ?
                                <FormItem
                                    label="默认课程"
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
        courseList: state.course.courseList,
        courseModalVisible: state.course.courseModalVisible,
        currentCourse: state.course.currentCourse,
        fileList: state.course.fileList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCourseList(){
            dispatch({type: 'course/fetchCourseList'});
        },
        addCourse(currentAddCourse){
            dispatch({type: 'course/addCourse', payload: { currentAddCourse } });
        },
        handleCourseModal(courseModalVisible){
            dispatch({type: 'course/handleCourseModal', payload: { courseModalVisible } });
        },
        deleteCourse(id){
            dispatch({type: 'course/deleteCourse', payload: { id } });
        },
        fetchCurrentCourse(id){
            dispatch({type: 'course/fetchCurrentCourse', payload: { id } });
        },
        saveFileList(fileList){
            dispatch({type: 'course/saveFileList', payload: { fileList } });
        },
        editCourse(currentEditCourse){
            dispatch({type: 'course/editCourse', payload: { currentEditCourse } });
        },
    }
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(CourseScreen));
