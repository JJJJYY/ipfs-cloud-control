import React, { Component } from 'react';
import { Switch, InputNumber, Tag, Select } from 'antd';
import { connect } from 'umi';
import EditModal from '@/components/EditModal';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';

const Option = Select.Option;

class Page extends Component {
  state = {
    page: 1,
    visible: false,
  };

  columns = [
    {
      title: '版本号',
      dataIndex: 'version',
      editable: true,
      required: true,
    }, {
      title: 'Build',
      dataIndex: 'build',
      editable: true,
      required: true,
      custom() {
        return (
          <InputNumber min={0} />
        )
      },
    }, {
      title: '平台',
      dataIndex: 'platform',
      editable: true,
      required: true,
      custom() {
        return (
          <Select>
            <Option value='android'>android</Option>
            <Option value='iOS'>iOS</Option>
          </Select>
        )
      }
    }, {
      title: '描述',
      dataIndex: 'description',
      editable: true,
      required: true,
    }, {
      title: '下载链接',
      dataIndex: 'download_url',
      editable: true,
    }, {
      title: '强制更新',
      dataIndex: 'force',
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
      title: '版本号',
      key: 'version',
      required: true,
    }, {
      title: 'Build',
      key: 'build',
      required: true,
      custom() {
        return (
          <InputNumber style={{ width: '100%' }} min={0} />
        )
      }
    }, {
      title: '平台',
      key: 'platform',
      required: true,
      custom() {
        return (
          <Select>
            <Option value='android'>android</Option>
            <Option value='iOS'>iOS</Option>
          </Select>
        )
      }
    }, {
      title: '描述',
      key: 'description',
      required: true,
    }, {
      title: '下载链接',
      key: 'download_url',
    }, {
      title: '强制更新',
      key: 'force',
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
      type: 'app/queryList',
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
      type: 'app/add',
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
      type: 'app/update',
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
      type: 'app/update',
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
    data: state.app.list,
    listLoading: state.loading.effects['app/queryList'],
    addLoading: state.loading.effects['app/add'],
    updateLoading: state.loading.effects['app/update'],
  };
}

export default connect(mapStateToProps)(Page);