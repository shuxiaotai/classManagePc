import React, { Component } from 'react';
import { Table, Divider, Button, Modal, Form, Input, Switch, Upload, Icon } from 'antd';
import { connect } from 'dva';
import styles from './index.css';
import {getProtocol} from "../utils/getProtocol";

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {span: 4, offset: 0},
    wrapperCol: {span: 18, offset: 1},
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
            <a href="javascript:;">编辑</a>
            <Divider type="vertical" />
            <a href="javascript:;">删除</a>
        </span>
    ),
}];
class CourseScreen extends Component {
    constructor() {
        super();
        this.state = {
            defaultTemplateCheck: true,
            showUploadList: false
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
        const { addCourse } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.isDefault = defaultTemplateCheck;
                values.courseImg = values.courseImg.file;
                addCourse(values);
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
    render() {
        const { courseList, courseModalVisible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const fileList = [];
        const uploadProps = {
            action: 'http://localhost:3389/api/addCourse',
            listType: 'picture',
            defaultFileList: [...fileList],
        };
        const pagination = {
            defaultPageSize: 6
        };
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
                    title="创建课程"
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
                            })(
                                <Upload
                                    {...uploadProps}
                                    onChange={this.changeImg}
                                    showUploadList={this.state.showUploadList}
                                >
                                    <Button>
                                        <Icon type="upload" /> 上传课程头像
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                        <FormItem
                            label="默认课程"
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
        courseList: state.course.courseList,
        courseModalVisible: state.course.courseModalVisible
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
        }
    }
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(CourseScreen));
