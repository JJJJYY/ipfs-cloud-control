import React, { Component } from 'react';
import { Select, DatePicker } from 'antd';
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
      title: '期数',
      dataIndex: 'number',
      render: (text) => (
        <div>{text}期</div>
      ),
    }, {
      title: '销毁',
      dataIndex: 'burn',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '有效单T',
      dataIndex: 'efficiency',
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

  render() {
    const { page, count, search } = this.state;
    const { data, listLoading } = this.props;

    return (
      <div>
        {/* <SearchGroup onSearch={(e) => {
          this.state.page = 1;
          this.state.search = e;
          this.loadData();
        }} items={
          [{ label: '用户账号', name: 'account' },
          {
            label: '期数', name: 'number',
            custom: (
              <Select>
                <Option value={1}>1期</Option>
                <Option value={2}>2期</Option>
              </Select>
            )
          }]
        } /> */}
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
    listLoading: state.loading.effects['incomeRecord/queryList'],
  };
}

export default connect(mapStateToProps)(Page);