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
      title: '币种',
      dataIndex: 'asset',
      editable: true,
      required: true,
    }, {
      title: '名称',
      dataIndex: 'name',
      editable: true,
      required: true,
    }, {
      title: '所属公链',
      dataIndex: 'block_chain',
      editable: true,
      required: true,
    }, {
      title: '图标',
      dataIndex: 'icon',
      editable: true,
      required: true,
      render(text) {
        return (
          <a href={text} target='view_window'><img src={text} width={30} alt='' /></a>
        );
      },
      custom() {
        return (
          <Upload />
        )
      },
    }, {
      title: '手机图标',
      dataIndex: 'app_icon',
      editable: true,
      required: true,
      render(text) {
        return (
          <a href={text} target='view_window'><img src={text} width={30} alt='' /></a>
        );
      },
      custom() {
        return (
          <Upload />
        )
      },
    }, {
      title: '最低手续费',
      dataIndex: 'min_fee',
      editable: true,
      required: true,
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
      custom() {
        return (
          <InputNumber min={0} />
        )
      },
    }, {
      title: '最小提现数',
      dataIndex: 'min_withdraw',
      editable: true,
      required: true,
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
      custom() {
        return (
          <InputNumber min={0} />
        )
      },
    }, {
      title: '最小充值数',
      dataIndex: 'min_deposit',
      editable: true,
      required: true,
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
      custom() {
        return (
          <InputNumber min={0} />
        )
      },
    }, {
      title: '是否锁定',
      dataIndex: 'lock',
      editable: true,
      required: true,
      valuePropName: 'checked',
      render(text) {
        return (
          <div>{[<Tag color="blue">否</Tag>, <Tag color="red">是</Tag>][text]}</div>
        );
      },
      custom() {
        return (
          <Switch checkedChildren="是" unCheckedChildren="否" />
        )
      },
    }, {
      title: '是否可充值',
      dataIndex: 'deposit',
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
      title: '是否可提现',
      dataIndex: 'withdraw',
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
      title: '币种',
      key: 'asset',
      required: true,
    }, {
      title: '名称',
      key: 'name',
      required: true,
    }, {
      title: '所属公链',
      key: 'block_chain',
      required: true,
    }, {
      title: '图标',
      key: 'icon',
      required: true,
      custom() {
        return (
          <Upload />
        )
      }
    }, {
      title: '最低手续费',
      key: 'min_fee',
      required: true,
      custom() {
        return (
          <InputNumber style={{ width: '100%' }} min={0} />
        )
      }
    }, {
      title: '最小提现数',
      key: 'min_withdraw',
      required: true,
      custom() {
        return (
          <InputNumber style={{ width: '100%' }} min={0} />
        )
      }
    }, {
      title: '最小充值数',
      key: 'min_deposit',
      required: true,
      custom() {
        return (
          <InputNumber style={{ width: '100%' }} min={0} />
        )
      }
    }, {
      title: '是否锁定',
      key: 'lock',
      valuePropName: 'checked',
      value: false,
      custom() {
        return (
          <Switch checkedChildren="是" unCheckedChildren="否" />
        )
      },
    }, {
      title: '是否可充值',
      key: 'deposit',
      valuePropName: 'checked',
      value: false,
      custom() {
        return (
          <Switch checkedChildren="是" unCheckedChildren="否" />
        )
      },
    }, {
      title: '是否可提现',
      key: 'withdraw',
      valuePropName: 'checked',
      value: false,
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
      type: 'asset/queryList',
      payload: {
        page: this.state.page,
      }
    });
  };


  handleClose = () => {
    this.setState({ visible: false })
  }

  handleSubmit = (values) => {
    this.props.dispatch({
      type: 'asset/add',
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
      type: 'asset/update',
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
      type: 'asset/update',
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
    data: state.asset.list,
    listLoading: state.loading.effects['asset/queryList'],
    addLoading: state.loading.effects['asset/add'],
    updateLoading: state.loading.effects['asset/update'],
  };
}

export default connect(mapStateToProps)(Page);