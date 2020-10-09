import React, { Component } from 'react';
import { Tag, Select } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import SearchGroup from '@/components/SearchGroup';
import styles from './index.less';

const Option = Select.Option;

class Page extends Component {
  state = {
    page: 1,
    count: 10,
    search: null,
  };

  columns = [
    {
      title: '账号',
      dataIndex: 'account',
    }, {
      title: '数量',
      dataIndex: 'quantity',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '资产类型',
      dataIndex: 'asset',
    }, {
      title: '类型',
      dataIndex: 'type',
      render(text) {
        return (
          <div>{['SR1奖励', '挖矿收益'][text - 1]}</div>
        );
      }
    }, {
      title: '手续费',
      dataIndex: 'service_charge',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '时间',
      dataIndex: 'create_time',
    },
  ];

  componentDidMount() {
    this.loadData();
    this.loadReward();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'income/queryList',
      payload: {
        page: page,
        count: count,
        search: search,
      }
    });
  };

  loadReward = () => {
    this.props.dispatch({
      type: 'income/queryReward',
    });
  };

  render() {
    const { page, count, search } = this.state;
    const { data, rewards, listLoading } = this.props;

    return (
      <div>
        <SearchGroup onSearch={(e) => {
          this.state.page = 1;
          this.state.search = e;
          this.loadData();
        }} items={
          [{ label: '用户账号', name: 'account' },
          {
            label: '类型', name: 'type',
            custom: (
              <Select>
                <Option value={1}>SR1奖励</Option>
                <Option value={2}>挖矿收益</Option>
              </Select>
            )
          }]
        } />
        <OperationGroup onExport={(all) => {
          this.props.dispatch({
            type: 'income/export',
            payload: {
              page: page,
              count: count,
              search: search ? JSON.stringify(search) : null,
              all: all,
            },
          });
        }} />
        {rewards && <div className={styles.rewardDiv}>
          出块奖励(24H)：{rewards.map((item, index) => <div className={styles.reward} key={index}><Tag color="blue">{item.miner}</Tag>{item.rewards} FIL</div>)}
        </div>}
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
    data: state.income.list,
    rewards: state.income.rewards,
    listLoading: state.loading.effects['income/queryList'],
  };
}

export default connect(mapStateToProps)(Page);