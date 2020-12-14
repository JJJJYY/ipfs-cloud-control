import React, { Component } from 'react';
import { Tag, Select, DatePicker } from 'antd';
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
      title: '期数',
      dataIndex: 'number',
      render: (text) => (
        <div>{text}期</div>
      ),
    }, {
      title: '有效单T',
      dataIndex: 'efficiency',
      render: (text, record) => (
        <div>{parseFloat(text) - parseFloat(record.gas_efficiency)}</div>
      ),
    }, {
      title: 'GAS(24H)',
      dataIndex: 'gas',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: 'GAS(总)',
      dataIndex: 'gas_total',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: 'GAS(已扣)',
      dataIndex: 'gas_deduct',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
    }, {
      title: '数据源',
      dataIndex: 'remark',
    },
  ];

  componentDidMount() {
    this.loadData();
    this.loadReward();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'incomeRecord/queryList',
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
          [{
            label: '期数', name: 'number',
            custom: (
              <Select>
                <Option value={1}>1期</Option>
                <Option value={2}>2期</Option>
              </Select>
            )
          }]
        } />
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
    data: state.incomeRecord.list,
    rewards: state.income.rewards,
    listLoading: state.loading.effects['incomeRecord/queryList'],
  };
}

export default connect(mapStateToProps)(Page);