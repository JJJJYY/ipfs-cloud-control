import React, { Component } from 'react';
import { InputNumber, Tag, Select, DatePicker } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import SearchGroup from '@/components/SearchGroup';

const Option = Select.Option;

class Page extends Component {
  state = {
    visible: false,
    visibleDrawer: false,
    page: 1,
    count: 10,
    search: null,
  };
  formRef = React.createRef();

  columns = [
    {
      title: '日期  ',
      dataIndex: 'create_time',
    },
    {
      title: '收入/元',
      dataIndex: 'pid',
    },
    {
      title: '支出/元',
      dataIndex: 'account',
    },
    {
      title: '结算金额',
      dataIndex: 'upayment_quantityp_user',
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'weight/queryList',
      payload: {
        page: page,
        count: count,
        search: search,
      },
    });
  };

  handleSave = (row, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'weight/update',
      payload: { id: id, ...row },
    }).then(data => {
      if (data != 'error') {
        this.loadData();
      }
    });
  };

  render() {
    const { page, count, search } = this.state;
    const { data, listLoading, updateLoading } = this.props;

    return (
      <div>
        <SearchGroup
          onSearch={e => {
            this.state.page = 1;
            if (e && e.time) {
              e.time = [
                e.time[0].format('YYYY-MM-DD'),
                e.time[1].format('YYYY-MM-DD'),
              ];
            }
            this.state.search = e;
            this.loadData();
          }}
          items={[
            {
              label: '日期',
              name: 'time',
              custom: <DatePicker.RangePicker />,
            },
          ]}
        />

        <EditableTable
          columns={this.columns}
          dataSource={data ? data.list : []}
          total={data ? data.total : 0}
          current={data ? data.current : 0}
          loading={listLoading || updateLoading}
          onChange={pagination => {
            this.state.page = pagination.current;
            this.state.count = pagination.pageSize;
            this.loadData();
          }}
          onSave={this.handleSave}
          rowKey="id"
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.weight.list,
    listLoading: state.loading.effects['weight/queryList'],
    updateLoading: state.loading.effects['weight/update'],
  };
}

export default connect(mapStateToProps)(Page);
