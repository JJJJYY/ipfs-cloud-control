import 'braft-editor/dist/index.css';
import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import Editor from '@/components/Editor';
import styles from './index.less';

class Page extends Component {
  state = {
    page: 1,
    visible: false,
    editdata: null,
  };
  formRef = React.createRef();

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
    },
    {
      title: '排序',
      dataIndex: 'rank',
    },
    {
      title: '操作',
      operation: true,
      showDelete: true,
      width: 60,
      fixed: 'right',
      actions() {
        return ['编辑'];
      },
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.dispatch({
      type: 'announcement/queryList',
      payload: {
        page: this.state.page,
      },
    });
  };

  handleActions = (row, index) => {
    if (index == 0) {
      this.props
        .dispatch({
          type: 'announcement/get',
          payload: { id: row.id },
        })
        .then(data => {
          if (data != 'error') {
            this.setState({
              editdata: data,
              visible: true,
            });

            this.formRef.current.setFieldsValue({
              title: data.title,
              rank: data.rank,
              content: data.content,
            });
          }
        });
    }
  };

  handleClose = () => {
    this.setState({ visible: false, editdata: null });
    this.formRef.current.resetFields();
  };

  handleSubmit = () => {
    this.formRef.current.validateFields().then(row => {
      if (row.content) row.content = row.content.toHTML();
      let isAdd = this.state.editdata == null;
      if (!isAdd) {
        row.id = this.state.editdata.id;
      }
      this.props
        .dispatch({
          type: isAdd ? 'announcement/add' : 'announcement/update',
          payload: row,
        })
        .then(data => {
          if (data != 'error') {
            this.loadData();
            this.handleClose();
          }
        });
    });
  };

  handleDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'announcement/update',
      payload: { id: id, deleted: 1 },
    }).then(data => {
      if (data != 'error') {
        this.loadData();
      }
    });
  };

  render() {
    const { visible } = this.state;
    const { data, listLoading, addLoading, updateLoading } = this.props;

    return (
      <div>
        <OperationGroup onAdd={() => this.setState({ visible: true })} />
        <EditableTable
          columns={this.columns}
          dataSource={data.data}
          total={data ? data.total : 0}
          loading={listLoading || updateLoading}
          onChange={pagination => {
            this.state.page = pagination.current;
            this.loadData();
          }}
          onSave={this.handleSave}
          onDelete={this.handleDel}
          onActions={this.handleActions}
          rowKey="id"
        />
        <Modal
          title="添加"
          okText="提交"
          cancelText="取消"
          width={800}
          forceRender={true}
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.handleClose}
          confirmLoading={addLoading || updateLoading}
          destroyOnClose={false}
        >
          <Form preserve={false} layout="vertical" ref={this.formRef}>
            <Form.Item
              className={styles.formItem}
              label="标题"
              name="title"
              rules={[{ required: true }]}
            >
              <Input allowClear maxLength={100} />
            </Form.Item>

            <Form.Item className={styles.formItem} label="内容" name="content">
              <Editor placeholder="内容" onChange={this.handleChange} />
            </Form.Item>

            <Form.Item className={styles.formItem} label="排序" name="rank">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.announcement.list,
    listLoading: state.loading.effects['announcement/queryList'],
    addLoading: state.loading.effects['announcement/add'],
    updateLoading: state.loading.effects['announcement/update'],
  };
}

export default connect(mapStateToProps)(Page);
