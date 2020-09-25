import React, { Component } from 'react';
import { Switch, InputNumber, Tag } from 'antd';
import { connect } from 'umi';
import EditModal from '@/components/EditModal';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';

class Page extends Component {
  state = { 
    page: 1,
    visible: false,
  };

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
      editable: true,
      required: true,
    },{
      title: '链接',
      dataIndex: 'link',
      editable: true,
      render: (text) => (
        <a target="_blank" href={text}>{text}</a>
      ),
    },{
      title: '顺序',
      dataIndex: 'rank',
      editable: true,
      custom() {
        return (
          <InputNumber style={{ width: '100%' }} min={1} />
        )
      }
    },{
      title: '是否显示',
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
    },{
      title: '更新时间',
      dataIndex: 'update_time',
    },{
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
      title: '标题',
      key: 'title',
      required: true,
    },{
      title: '链接',
      key: 'link',
      required: true,
    },{
      title: '顺序',
      key: 'rank',
      custom() {
        return (
          <InputNumber style={{ width: '100%' }} min={1} />
        )
      }
    },{
      title: '是否显示',
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
      type: 'linksInfo/queryList',
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
      type: 'linksInfo/add',
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
      type: 'linksInfo/update',
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
      type: 'linksInfo/update',
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
    data: state.linksInfo.list,
    listLoading: state.loading.effects['linksInfo/queryList'],
    addLoading: state.loading.effects['linksInfo/add'],
    updateLoading: state.loading.effects['linksInfo/update'],
  };
}

export default connect(mapStateToProps)(Page);