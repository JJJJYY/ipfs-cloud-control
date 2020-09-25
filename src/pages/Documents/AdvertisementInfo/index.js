import 'braft-editor/dist/index.css'
import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber, Tag, Switch, Radio } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import Editor from '@/components/Editor';
import Upload from '@/components/Upload';
import styles from './index.less';

const RadioGroup = Radio.Group;

class Page extends Component {
  state = {
    page: 1,
    visible: false,
    editdata: null,
  };
  formRef = React.createRef();

  columns = [
    {
      title: '类型',
      dataIndex: 'type',
      render(text) {
        return (
          <div>{['项目动态', '进阶小课堂'][text]}</div>
        );
      },
    }, {
      title: '图片',
      dataIndex: 'image',
      render(text) {
        return (
          <a href={text} target='view_window'><img src={text} width={100} alt='' /></a>
        );
      },
    }, {
      title: '标题',
      dataIndex: 'title',
    }, {
      title: '排序',
      dataIndex: 'rank',
    }, {
      title: '是否启用',
      dataIndex: 'is_enable',
      render(text) {
        return (
          <div>{[<Tag color="black">否</Tag>, <Tag color="green">是</Tag>][text]}</div>
        );
      },
    }, {
      title: '修改时间',
      dataIndex: 'update_time',
    }, {
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
      type: 'advertisementInfo/queryList',
      payload: {
        page: this.state.page,
      }
    });
  };

  handleActions = (row, index) => {
    if (index == 0) {
      this.props.dispatch({
        type: 'advertisementInfo/get',
        payload: { id: row.id },
      }).then((data) => {
        if (data != 'error') {
          this.setState({
            editdata: data,
            visible: true,
          })
          this.formRef.current.setFieldsValue({
            title: data.title,
            rank: data.rank,
            is_enable: data.is_enable,
            type: data.type,
            image: data.image,
            content: data.content,
          })
        }
      })
    }
  }

  handleClose = () => {
    this.setState({ visible: false, editdata: null })
  }

  handleSubmit = () => {
    this.formRef.current.validateFields().then(row => {
      if (row.content) row.content = row.content.toHTML();
      let isAdd = this.state.editdata == null;
      if (!isAdd) {
        row.id = this.state.editdata.id;
      }
      this.props.dispatch({
        type: isAdd ? 'advertisementInfo/add' : 'advertisementInfo/update',
        payload: row,
      }).then((data) => {
        if (data != 'error') {
          this.loadData();
          this.handleClose()
        }
      });
    })
  }

  handleSave = (row, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'advertisementInfo/update',
      payload: { id: id, ...row },
    }).then((data) => {
      if (data != 'error') {
        this.loadData();
      }
    });
  }

  handleDel = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'advertisementInfo/update',
      payload: { id: id, deleted: 1 },
    }).then((data) => {
      if (data != 'error') {
        this.loadData();
      }
    });
  }

  render() {
    const { visible } = this.state;
    const { data, listLoading, addLoading, updateLoading } = this.props;

    return (
      <div>
        <OperationGroup onAdd={() => this.setState({ visible: true })} />
        <EditableTable
          columns={this.columns}
          dataSource={data ? data.list : []}
          total={data ? data.total : 0}
          loading={listLoading || updateLoading}
          onChange={(pagination) => {
            this.state.page = pagination.current;
            this.loadData()
          }}
          onSave={this.handleSave}
          onDelete={this.handleDel}
          onActions={this.handleActions}
          rowKey="id"
        />
        <Modal
          title="添加"
          okText='提交'
          cancelText='取消'
          width={800}
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.handleClose}
          confirmLoading={addLoading || updateLoading}
          destroyOnClose
        >
          <Form layout='vertical' ref={this.formRef}>
            <Form.Item
              className={styles.formItem}
              label='类型'
              name='type'
              rules={[{ required: true }]}
            >
              <RadioGroup>
                <Radio value={0}>项目动态</Radio>
                <Radio value={1}>进阶小课堂</Radio>
              </RadioGroup>
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='封面'
              name='image'
              rules={[{ required: true }]}
            >
              <Upload />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='标题'
              name='title'
              rules={[{ required: true }]}
            >
              <Input maxLength={100} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='内容'
              name='content'
            >
              <Editor placeholder='内容' onChange={this.handleChange} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='排序'
              name='rank'
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='是否启用'
              name='is_enable'
              valuePropName='checked'
              initialValue={1}
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    data: state.advertisementInfo.list,
    listLoading: state.loading.effects['advertisementInfo/queryList'],
    addLoading: state.loading.effects['advertisementInfo/add'],
    updateLoading: state.loading.effects['advertisementInfo/update'],
  };
}

export default connect(mapStateToProps)(Page);