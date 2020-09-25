import React, { Component } from 'react';
import { InputNumber } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';

class Page extends Component {
  state = { 
    page: 1,
  };

  columns = [
    {
      title: '等级',
      dataIndex: 'level',
      render(text) {
        return (
          <div>{['普通合伙人', '铜牌合伙人', '银牌合伙人', '金牌合伙人', '铂金合伙人', '钻石合伙人', '超级合伙人'][text+1]}</div>
        );
      },
    },{
      title: '算力要求(GB)',
      dataIndex: 'hashrate',
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
    },{
      title: '一级比例(钱币)',
      dataIndex: 'token_one_rate',
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
    },{
      title: '二级比例(钱币)',
      dataIndex: 'token_two_rate',
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
    },{
      title: '一级比例(算力)',
      dataIndex: 'hashrate_one_rate',
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
    },{
      title: '二级比例(算力)',
      dataIndex: 'hashrate_two_rate',
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
    },
    // {
    //   title: '分销',
    //   dataIndex: 'sales',
    //   editable: true,
    //   required: true,
    //   render: (text) => (
    //     <div>{parseFloat(text)}</div>
    //   ),
    //   custom() {
    //     return (
    //       <InputNumber min={0} />
    //     )
    //   },
    // },
    {
      title: '设置时间',
      dataIndex: 'update_time',
    },{
      title: '操作',
      operation: true,
      showEdit: true,
      width: 60,
      fixed: 'right',
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.dispatch({
      type: 'level/queryList',
      payload: {
        page: this.state.page,
      }
    });
  };

  handleSave = (row, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'level/update',
      payload: { id: id, ...row },
    }).then((data) => {
      if (data != 'error') {
        this.loadData();
      }
    });
  }

  render() {
    const { data, listLoading, updateLoading } = this.props;

    return (
      <div>
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
          rowKey="id" 
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    data: state.level.list,
    listLoading: state.loading.effects['level/queryList'],
    updateLoading: state.loading.effects['level/update'],
  };
}

export default connect(mapStateToProps)(Page);