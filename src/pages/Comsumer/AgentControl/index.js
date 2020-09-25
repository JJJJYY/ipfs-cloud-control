import React, { Component } from 'react';
import { Switch, InputNumber, Tag } from 'antd';
import { connect } from 'umi';
import EditModal from '@/components/EditModal';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import SearchGroup from '@/components/SearchGroup';

class Page extends Component {
  state = {
    page: 1,
    search: null,
    visible: false,
  };

  columns = [
    {
      title: '用户',
      dataIndex: 'account',
    }, {
      title: '最高可查询层级',
      dataIndex: 'max_rank',
      editable: true,
      required: true,
      custom() {
        return (
          <InputNumber min={0} placeholder='0-不限制' />
        )
      },
    }, {
      title: '是否启用',
      dataIndex: 'is_enable',
      editable: true,
      required: true,
      valuePropName: 'checked',
      render(text) {
        return (
          <div>{[<Tag color="black">否</Tag>, <Tag color="green">是</Tag>][text]}</div>
        );
      },
      custom() {
        return (
          <Switch checkedChildren="是" unCheckedChildren="否" />
        )
      },
    }, {
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
      title: '用户',
      key: 'account',
      required: true,
    }, {
      title: '最高可查询层级',
      key: 'max_rank',
      required: true,
      custom() {
        return (
          <InputNumber style={{ width: '100%' }} min={0} placeholder='0-不限制' />
        )
      }
    }, {
      title: '是否启用',
      key: 'is_enable',
      valuePropName: 'checked',
      value: true,
      custom() {
        return (
          <Switch checkedChildren="是" unCheckedChildren="否" />
        )
      },
    },
  ]

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.dispatch({
      type: 'authAgent/queryList',
      payload: {
        page: this.state.page,
        search: this.state.search,
      }
    });
  };


  handleClose = () => {
    this.setState({ visible: false })
  }

  handleSubmit = (values) => {
    this.props.dispatch({
      type: 'authAgent/add',
      payload: values,
    }).then((data) => {
      if (data != 'error') {
        this.loadData();
        this.handleClose()
      }
    });
  };

  handleSave = (row, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authAgent/update',
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
      type: 'authAgent/update',
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
        <SearchGroup onSearch={(e) => {
          this.state.page = 1;
          this.state.search = e;
          this.loadData();
        }} items={[{ label: '账号', name: 'account' }]} />
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
    )
  }
}

function mapStateToProps(state) {
  return {
    data: state.authAgent.list,
    listLoading: state.loading.effects['authAgent/queryList'],
    addLoading: state.loading.effects['authAgent/add'],
    updateLoading: state.loading.effects['authAgent/update'],
  };
}

export default connect(mapStateToProps)(Page);