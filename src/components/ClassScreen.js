import React, { Component } from "react";
import {
  Table,
  Divider,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  Upload,
  Icon,
  Select
} from "antd";
import { connect } from "dva";
import styles from "./index.css";
import { getProtocol } from "../utils/getProtocol";

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 4, offset: 0 },
  wrapperCol: { span: 18, offset: 1 }
};

class ClassScreen extends Component {
  constructor() {
    super();
    this.state = {
      showUploadList: false
    };
  }
  componentDidMount() {
    const { fetchClassList } = this.props;
    fetchClassList();
  }
  changeImg = e => {
    if (e.fileList.length === 2) {
      e.fileList.shift();
    }
    this.setState({
      showUploadList: true
    });
  };
  handleOk = e => {
    const { addClass, currentClass, editClass } = this.props;
    const { isCreate } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (isCreate) {
          values.classImg = values.classImg.file;
          addClass(values);
        } else {
          values.id = currentClass.id;
          values.classImg = values.classImg[0]
            ? values.classImg[0]
            : values.classImg.file;
          if (values.masterTeacher === currentClass["teacher_name"]) {
            values.masterTeacher = currentClass["teacher_id"].toString();
          }
          editClass(values);
          this.props.form.resetFields();
        }
      }
    });
  };
  handleCancel = e => {
    const { handleClassModal } = this.props;
    handleClassModal(false);
  };
  showModal = () => {
    const { handleClassModal, fetchMasterTeacherList } = this.props;
    handleClassModal(true);
    this.props.form.resetFields();
    fetchMasterTeacherList();
    this.setState({
      showUploadList: false,
      isCreate: true
    });
  };
  handleDelete = id => {
    const { deleteClass } = this.props;
    deleteClass(id);
  };
  handleEdit = id => {
    const {
      handleClassModal,
      fetchCurrentClass,
      fetchMasterTeacherList
    } = this.props;
    fetchCurrentClass(id);
    handleClassModal(true);
    fetchMasterTeacherList();
    this.setState({
      isCreate: false,
      showUploadList: true
    });
  };
  removeFileList = () => {
    const { saveFileList } = this.props;
    saveFileList([]);
  };
  changeEditImg = e => {
    const { saveFileList } = this.props;
    if (e.fileList.length === 2) {
      e.fileList.shift();
    }
    saveFileList(e.fileList);
  };
  render() {
    const {
      classList,
      classModalVisible,
      masterTeacherList,
      fileList,
      currentClass
    } = this.props;
    const { isCreate } = this.state;
    const pagination = {
      defaultPageSize: 6
    };
    const uploadProps = {
      action: `${getProtocol()}/api/addClass`,
      listType: "picture",
      defaultFileList: [...fileList]
    };
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: "年级",
        dataIndex: "grade",
        key: "grade",
        render: text => <a>{text}</a>
      },
      {
        title: "班级名称",
        dataIndex: "name",
        key: "name",
        render: text => <a>{text}</a>
      },
      {
        title: "课程头像",
        dataIndex: "img_url",
        key: "img_url",
        render: text => (
          <img className={styles.img} src={getProtocol() + text} />
        )
      },
      {
        title: "班主任",
        dataIndex: "teacher_name",
        key: "teacher_name"
      },
      {
        title: "操作",
        key: "action",
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
        )
      }
    ];
    return (
      <div>
        <Button
          type="primary"
          className={styles.createBtn}
          onClick={this.showModal}
        >
          创建班级
        </Button>
        <Table
          columns={columns}
          dataSource={classList}
          rowKey="id"
          pagination={pagination}
        />
        <Modal
          title={isCreate ? "创建班级" : "修改班级"}
          visible={classModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
        >
          <Form>
            <FormItem label="选择年级" {...formItemLayout}>
              {getFieldDecorator("grade", {
                rules: [{ required: true, message: "请选择年级!" }],
                initialValue: isCreate
                  ? ""
                  : currentClass !== ""
                  ? currentClass.grade
                  : ""
              })(
                <Select style={{ width: 120 }}>
                  <Option value="一年级">一年级</Option>
                  <Option value="二年级">二年级</Option>
                  <Option value="三年级">三年级</Option>
                  <Option value="四年级">四年级</Option>
                  <Option value="五年级">五年级</Option>
                  <Option value="六年级">六年级</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="班级名称" {...formItemLayout}>
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入班级名称!" }],
                initialValue: isCreate
                  ? ""
                  : currentClass !== ""
                  ? currentClass.name
                  : ""
              })(<Input />)}
            </FormItem>
            <FormItem label="班级头像" {...formItemLayout}>
              {getFieldDecorator("classImg", {
                rules: [{ required: true, message: "请选择班级头像!" }],
                initialValue: isCreate
                  ? ""
                  : currentClass !== ""
                  ? fileList
                  : ""
              })(
                isCreate ? (
                  <Upload
                    {...uploadProps}
                    onChange={this.changeImg}
                    showUploadList={this.state.showUploadList}
                  >
                    <Button>
                      <Icon type="upload" /> 上传班级头像
                    </Button>
                  </Upload>
                ) : (
                  <Upload
                    {...uploadProps}
                    onChange={this.changeEditImg}
                    showUploadList={this.state.showUploadList}
                    fileList={fileList}
                    onRemove={this.removeFileList}
                  >
                    <Button>
                      <Icon type="upload" /> 修改班级头像
                    </Button>
                  </Upload>
                )
              )}
            </FormItem>
            <FormItem label="选择班主任" {...formItemLayout}>
              {getFieldDecorator("masterTeacher", {
                rules: [{ required: true, message: "请选择班主任!" }],
                initialValue: isCreate
                  ? ""
                  : currentClass !== ""
                  ? currentClass["teacher_name"]
                  : ""
              })(
                <Select style={{ width: 120 }}>
                  {masterTeacherList.map((item, index) => {
                    return <Option key={item.id}>{item.username}</Option>;
                  })}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    classList: state.classModels.classList,
    classModalVisible: state.classModels.classModalVisible,
    masterTeacherList: state.classModels.masterTeacherList,
    currentClass: state.classModels.currentClass,
    fileList: state.classModels.fileList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchClassList() {
      dispatch({ type: "classModels/fetchClassList" });
    },
    addClass(currentAddClass) {
      dispatch({ type: "classModels/addClass", payload: { currentAddClass } });
    },
    handleClassModal(classModalVisible) {
      dispatch({
        type: "classModels/handleClassModal",
        payload: { classModalVisible }
      });
    },
    fetchMasterTeacherList() {
      dispatch({ type: "classModels/fetchMasterTeacherList" });
    },
    deleteClass(id) {
      dispatch({ type: "classModels/deleteClass", payload: { id } });
    },
    fetchCurrentClass(id) {
      dispatch({ type: "classModels/fetchCurrentClass", payload: { id } });
    },
    saveFileList(fileList) {
      dispatch({ type: "classModels/saveFileList", payload: { fileList } });
    },
    editClass(currentEditClass) {
      dispatch({
        type: "classModels/editClass",
        payload: { currentEditClass }
      });
    }
  };
}

export default Form.create()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ClassScreen)
);
