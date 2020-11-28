import React, { Component } from 'react';
import { Modal, Select, DatePicker } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import SearchGroup from '@/components/SearchGroup';

const Option = Select.Option;

class Page extends Component {
  state = {
    page: 1,
    count: 10,
    search: null,
  };

  columns = [
    {
      title: '订单号',
      dataIndex: 'pid',
    }, {
      title: '账号',
      dataIndex: 'account',
    }, {
      title: '货币数量',
      dataIndex: 'pay_coin_amount',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '算力',
      dataIndex: 'power',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '已填充',
      dataIndex: 'fill_power',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '申请状态',
      dataIndex: 'payment_status',
      render(text) {
        return (
          <div>{['未付款', '已付款', '付款失败', '拒绝'][text]}</div>
        );
      }
    }, {
      title: '加速状态',
      dataIndex: 'status',
      render(text) {
        return (
          <div>{['排队中', '加速中', '加速完毕'][text]}</div>
        );
      }
    }, {
      title: '创建时间',
      dataIndex: 'purchase_time',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 60,
      fixed: 'right',
      render: (_, record) => (
        record.payment_status == 1 ? <a onClick={() => this.handleReceipt(record)}>取消</a> : <div>-</div>
      ),
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'flashSaleOrders/queryList',
      payload: {
        page: page,
        count: count,
        search: search,
      }
    });
  };

  handleReceipt = (record) => {
    Modal.confirm({
      title: '取消订单',
      content: (
        <div>
          账号：{record.account}<br /><br />
        </div>
      ),
      onOk: (() => {
        return new Promise((resolve, reject) => {
          this.props.dispatch({
            type: 'flashSaleOrders/update',
            payload: {
              id: record.id,
              payment_status: 3,
            },
          }).then((data) => {
            if (data != 'error') {
              resolve()
              this.loadData();

            } else {
              reject()
            }
          })
        })
      }),
    });
  }

  render() {
    const { page, count, search } = this.state;
    const { data, listLoading } = this.props;

    return (
      <div>
        <SearchGroup onSearch={(e) => {
          this.state.page = 1;
          this.state.search = e;
          this.loadData();
        }} items={
          [{ label: '用户账号', name: 'account' },
          {
            label: '支付状态', name: 'payment_status',
            custom: (
              <Select>
                <Option value={1}>已付款</Option>
                <Option value={3}>拒绝</Option>
              </Select>
            )
          }]
        } />
        <EditableTable
          columns={this.columns}
          dataSource={data ? data.list : []}
          total={data ? data.total : 0}
          current={data ? data.current : 0}
          loading={listLoading}
          onChange={(pagination) => {
            this.state.page = pagination.current;
            this.state.count = pagination.pageSize;
            this.loadData()
          }}
          rowKey="id"
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    data: state.flashSaleOrders.list,
    listLoading: state.loading.effects['flashSaleOrders/queryList'],
  };
}

export default connect(mapStateToProps)(Page);