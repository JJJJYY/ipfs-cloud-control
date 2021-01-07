import React, { Component } from 'react';
import { Switch, InputNumber, Tag } from 'antd';
import { connect } from 'umi';
import EditModal from '@/components/EditModal';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import Upload from '@/components/Upload';

class Page extends Component {
  state = {
    page: 1,
    visible: false,
  };

  columns = [
    {
      title: '图片',
      dataIndex: 'image',
      editable: true,
      required: true,
      render(text) {
        return (
          <a href={text} target="view_window">
            <img src={text} width={100} alt="" />
          </a>
        );
      },
      custom() {
        return <Upload />;
      },
    },
    {
      title: 'PC端图片',
      dataIndex: 'pc_image',
      editable: true,
      required: true,
      render(text) {
        return (
          <a href={text} target="view_window">
            <img src={text} width={100} alt="" />
          </a>
        );
      },
      custom() {
        return <Upload />;
      },
    },
    {
      title: '跳转链接',
      dataIndex: 'url',
      editable: true,
      render: text => (
        <a target="_blank" href={text}>
          {text}
        </a>
      ),
    },
    {
      title: '顺序',
      dataIndex: 'rank',
      editable: true,
    },
    {
      title: '是否置顶',
      dataIndex: 'top',
      editable: true,
      required: true,
      valuePropName: 'checked',
      render(text) {
        return (
          <div>
            {[<Tag color="black">否</Tag>, <Tag color="green">是</Tag>][text]}
          </div>
        );
      },
      custom() {
        return <Switch checkedChildren="是" unCheckedChildren="否" />;
      },
    },
    {
      title: '是否启用',
      dataIndex: 'is_enable',
      editable: true,
      required: true,
      valuePropName: 'checked',
      render(text) {
        return (
          <div>
            {[<Tag color="black">否</Tag>, <Tag color="green">是</Tag>][text]}
          </div>
        );
      },
      custom() {
        return <Switch checkedChildren="是" unCheckedChildren="否" />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '操作',
      operation: true,
      showEdit: true,
      showDelete: true,
      width: 60,
      fixed: 'right',
    },
  ];

  modelColumns = [
    {
      title: '图片',
      key: 'image',
      required: true,
      custom() {
        return <Upload />;
      },
    },
    {
      title: 'PC图片',
      key: 'pc_image',
      required: true,
      custom() {
        return <Upload />;
      },
    },
    {
      title: '跳转链接',
      key: 'url',
      required: true,
    },
    {
      title: '顺序',
      key: 'rank',
      required: true,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={1} />;
      },
    },
    {
      title: '是否置顶',
      key: 'top',
      valuePropName: 'checked',
      value: false,
      custom() {
        return <Switch checkedChildren="是" unCheckedChildren="否" />;
      },
    },
    {
      title: '是否启用',
      key: 'is_enable',
      valuePropName: 'checked',
      value: true,
      custom() {
        return <Switch checkedChildren="是" unCheckedChildren="否" />;
      },
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.dispatch({
      type: 'banner/queryList',
      payload: {
        page: this.state.page,
      },
    });
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  handleSubmit = values => {
    this.props
      .dispatch({
        type: 'banner/add',
        payload: values,
      })
      .then(data => {
        if (data != 'error') {
          this.loadData();
          this.handleClose();
        }
      });
  };

  handleSave = (row, id) => {
    this.props
      .dispatch({
        type: 'banner/update',
        payload: { id: id, ...row },
      })
      .then(data => {
        if (data != 'error') {
          this.loadData();
        }
      });
  };

  handleDel = id => {
    this.props
      .dispatch({
        type: 'banner/update',
        payload: { id: id, deleted: 1 },
      })
      .then(data => {
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
          rowKey="id"
        />
        <EditModal
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.handleClose}
          confirmLoading={addLoading}
          columns={this.modelColumns}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.banner.list,
    listLoading: state.loading.effects['banner/queryList'],
    addLoading: state.loading.effects['banner/add'],
    updateLoading: state.loading.effects['banner/update'],
  };
}

export default connect(mapStateToProps)(Page);
