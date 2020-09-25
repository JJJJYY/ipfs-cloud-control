import React, { Component } from 'react';
import { Tag, Select } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import SearchGroup from '@/components/SearchGroup';

const Option = Select.Option;

class Page extends Component {
  state = { 
    page: 1,
    search: null,
  };

  columns = [
    {
      title: '账号',
      dataIndex: 'account',
    },{
      title: '数量',
      dataIndex: 'quantity',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    },{
      title: '资产类型',
      dataIndex: 'asset',
    },{
      title: '类型',
      dataIndex: 'type',
      render(text) {
        return (
          <div>{['购买算力', '', '充值', '提现', '提现中', '', '', '内部转出', '内部转入', '邀请奖励（锁定）', '邀请奖励（解锁）', '返佣', '系统充币', '活动奖励', '系统提币', '兑换', '挖矿收益', '系统扣除', '补款', '未知'][text-1]}</div>
        );
      }
    },{
      title: '状态',
      dataIndex: 'status',
      render(text) {
        return (
          <div>{[<Tag color="blue">提现中</Tag>, <Tag color="green">成功</Tag>, <Tag color="black">拒绝</Tag>][text]}</div>
        );
      },
    },{
      title: '时间',
      dataIndex: 'create_time',
    },{
      title: '手续费',
      dataIndex: 'service_charge',
      render: (text, record) => (
        <div>{parseFloat(text)} {record.charge_asset}</div>
      ),
    },{
      title: '发送方',
      dataIndex: 'from',
    },{
      title: '接收方',
      dataIndex: 'to',
    },{
      title: '备注',
      dataIndex: 'remark',
      width: 100,
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, search } = this.state;
    this.props.dispatch({
      type: 'balanceModify/queryList',
      payload: {
        page: page,
        search: search,
      }
    });
  };

  render() {
    const { page, search } = this.state;
    const { data, listLoading } = this.props;

    return (
      <div>
        <SearchGroup onSearch={(e) => {
          this.state.page = 1;
          this.state.search = e;
          this.loadData();
        }} items={
          [{ label: '用户账号', name: 'account' }, 
          { label: '资产类型', name: 'asset',
              custom: (
                <Select>
                  <Option value='USDT'>USDT</Option>
                  <Option value='ETH'>ETH</Option>
                  <Option value='BTC'>BTC</Option>
                  <Option value='FIL'>FIL</Option>
                </Select>
              )
          }, 
          { label: '类型', name: 'type', 
              custom: (
                <Select>
                  <Option value={1}>购买算力</Option>
                  <Option value={3}>充值</Option>
                  <Option value={4}>提现</Option>
                  <Option value={5}>提现中</Option>
                  <Option value={8}>内部转出</Option>
                  <Option value={9}>内部转入</Option>
                  <Option value={11}>邀请奖励（解锁）</Option>
                  <Option value={12}>返佣</Option>
                  <Option value={13}>系统充币</Option>
                  <Option value={14}>活动奖励</Option>
                  <Option value={15}>系统提币</Option>
                  <Option value={16}>兑换</Option>
                  <Option value={17}>挖矿收益</Option>
                  <Option value={18}>系统扣除</Option>
                  <Option value={19}>补款</Option>
                </Select>
              )
          }]
        } />
        <OperationGroup onExport={(all) => {
          this.props.dispatch({
            type: 'balanceModify/export',
            payload: { 
              page: page,
              search: search ? JSON.stringify(search) : null,
              all: all,
            },
          });
        }} />
        <EditableTable
          columns={this.columns} 
          dataSource={data ? data.list : []}
          total={data ? data.total : 0}
          current={data ? data.current : 0}
          loading={listLoading}
          onChange={(pagination) => {
            this.state.page = pagination.current;
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
    data: state.balanceModify.list,
    listLoading: state.loading.effects['balanceModify/queryList'],
  };
}

export default connect(mapStateToProps)(Page);