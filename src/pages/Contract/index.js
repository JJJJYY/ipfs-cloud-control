import 'braft-editor/dist/index.css'
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
      title: '订单号',
      dataIndex: 'pid',
    },{
      title: '账号',
      dataIndex: 'account',
    },{
      title: '商品名称',
      dataIndex: 'name',
    },{
      title: '算力数量',
      dataIndex: 'quantity',
    },{
      title: '订单金额',
      dataIndex: 'price',
    },{
      title: '类型',
      dataIndex: 'asset',
    },{
      title: '是否保底',
      dataIndex: 'service_charge_rate',
      render(text) {
        return (
          <div>{text == 0.2 ? <Tag color="red">不保底</Tag> : <Tag color="green">保底</Tag>}</div>
        );
      },
      custom() {
        return (
          <Select>
            <Option value='0.2000'>不保底</Option>
            <Option value='0.1490'>保底</Option>
          </Select>
        )
      },
    },{
      title: '寄送',
      dataIndex: 'remark1',
    },{
      title: '创建时间',
      dataIndex: 'create_time',
    },{
      title: '备注',
      dataIndex: 'remark',
    },{
      title: '操作',
      operation: true,
      showEdit: true,
      showDelete: true,
      width: 60,
      fixed: 'right',
    },
  ];

  componentDidMount() {
    // this.loadData();
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
        {/* <OperationGroup onAdd={() => this.setState({ visible: true })} /> */}
        <EditableTable
          columns={this.columns} 
          dataSource={data ? data.list : []}
          total={data ? data.total : 0}
          loading={listLoading || updateLoading}
          onChange={(pagination) => {
            this.state.page = pagination.current;
            this.loadData()
          }}
          // onSave={this.handleSave}
          // onDelete={this.handleDel}
          rowKey="id" 
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