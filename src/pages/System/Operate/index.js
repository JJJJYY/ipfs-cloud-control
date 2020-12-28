import React, { Component } from 'react';
import { Switch, Tag, InputNumber } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import EditModal from '@/components/EditModal';

class Page extends Component {
  state = {
    visible: false,
  };

  columns = [
    {
      title: '名称',
      dataIndex: 'name',
      editable: true,
      required: true,
    },
    {
      title: '接口',
      dataIndex: 'api',
      editable: true,
      required: true,
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
            {
              [<Tag color="black">关闭</Tag>, <Tag color="green">开启</Tag>][
                text
              ]
            }
          </div>
        );
      },
      custom() {
        return <Switch checkedChildren="开启" unCheckedChildren="关闭" />;
      },
    },
    {
      title: '排序',
      dataIndex: 'sort_no',
      editable: true,
      required: true,
      custom() {
        return <InputNumber min={0} />;
      },
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
      title: '名称',
      key: 'name',
      required: true,
    },
    {
      title: '接口',
      key: 'api',
      required: true,
    },
    {
      title: '排序',
      key: 'sort_no',
      required: true,
      custom() {
        return <InputNumber style={{ width: '100%' }} min={0} />;
      },
    },
    {
      title: '是否启用',
      key: 'is_enable',
      valuePropName: 'checked',
      value: true,
      custom() {
        return <Switch checkedChildren="开启" unCheckedChildren="关闭" />;
      },
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.dispatch({
      type: 'sysOperate/queryList',
    });
  };

  handleSave = (row, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysOperate/update',
      payload: { id: id, ...row },
    }).then(data => {
      if (data != 'error') {
        this.loadData();
      }
    });
  };

  handleDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysOperate/update',
      payload: { id: id, deleted: 1 },
    }).then(data => {
      if (data != 'error') {
        this.loadData();
      }
    });
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  handleSubmit = values => {
    this.props
      .dispatch({
        type: 'sysOperate/add',
        payload: values,
      })
      .then(data => {
        if (data != 'error') {
          this.loadData();
          this.handleClose();
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
          dataSource={data}
          loading={listLoading || updateLoading}
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
    data: state.sysOperate.list,
    listLoading: state.loading.effects['sysOperate/queryList'],
    addLoading: state.loading.effects['sysOperate/add'],
    updateLoading: state.loading.effects['sysOperate/update'],
  };
}

export default connect(mapStateToProps)(Page);
