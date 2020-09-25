import React, { Component } from 'react';
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
      title: '渠道',
      dataIndex: 'name',
      editable: true,
      required: true,
    },{
      title: '标签',
      dataIndex: 'tag',
      editable: true,
      required: true,
    },{
      title: '图片',
      dataIndex: 'image',
      editable: true,
      render(text) {
        return (
          <a href={text} target='view_window'><img src={text} width={100} alt='' /></a>
        );
      },
      custom() {
        return (
          <Upload />
        )
      },
    },{
      title: '链接',
      dataIndex: 'url',
      editable: true,
      required: true,
      render: (text) => (
        <a target="_blank" href={text}>{text}</a>
      ),
    },{
      title: '点击次数',
      dataIndex: 'click_count',
    },{
      title: '下载次数',
      dataIndex: 'download_count',
    },{
      title: '注册次数',
      dataIndex: 'register_count',
    },{
      title: '创建时间',
      dataIndex: 'create_time',
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
      title: '渠道',
      key: 'name',
      required: true,
    },{
      title: '标签',
      key: 'tag',
      required: true,
    },{
      title: '链接',
      key: 'url',
      required: true,
    },{
      title: '图片',
      key: 'image',
      custom() {
        return (
          <Upload />
        )
      }
    },
  ]

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.dispatch({
      type: 'channel/queryList',
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
      type: 'channel/add',
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
      type: 'channel/update',
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
      type: 'channel/update',
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
    data: state.channel.list,
    listLoading: state.loading.effects['channel/queryList'],
    addLoading: state.loading.effects['channel/add'],
    updateLoading: state.loading.effects['channel/update'],
  };
}

export default connect(mapStateToProps)(Page);