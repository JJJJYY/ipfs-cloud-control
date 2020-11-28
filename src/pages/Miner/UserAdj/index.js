import React, { Component } from 'react';
import { Tag, Select, DatePicker } from 'antd';
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
      title: '账号',
      dataIndex: 'account',
    }, {
      title: '期数',
      dataIndex: 'number',
      render: (text) => (
        <div>{text}期</div>
      ),
    }, {
      title: '算力增量',
      dataIndex: 'power',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '节点',
      dataIndex: 'type',
      render(text) {
        return (
          <div>{[<Tag color="black">普通节点</Tag>, <Tag color="green">加速节点</Tag>][text - 1]}</div>
        );
      }
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'userAdjPower/queryList',
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
        <SearchGroup onSearch={(e) => {
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
    data: state.userAdjPower.list,
    listLoading: state.loading.effects['userAdjPower/queryList'],
  };
}

export default connect(mapStateToProps)(Page);