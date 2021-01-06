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
      title: '订单号',
      dataIndex: 'pid',
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '入账金额',
      dataIndex: 'up_user',
    },
    {
      title: '折扣',
      dataIndex: 'unit',
    },
    {
      title: '入账金额',
      dataIndex: 'payment_quantity',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber min={0} />;
      },
    },
    {
      title: '技术服务费',
      dataIndex: 'service_charge_rate',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber min={0} max={1} step={0.1} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      editable: true,
      required: true,
      render(text) {
        return (
          <div>
            {
              [
                <Tag color="black">未付款</Tag>,
                <Tag color="green">已付款</Tag>,
                <Tag color="black">关闭</Tag>,
                <Tag color="black">超时</Tag>,
              ][text]
            }
          </div>
        );
      },
      custom() {
        return (
          <Select>
            <Option disabled value={0}>
              未付款
            </Option>
            <Option disabled value={1}>
              已付款
            </Option>
            <Option value={2}>关闭</Option>
            <Option disabled value={3}>
              超时
            </Option>
          </Select>
        );
      },
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'weight/queryTopList',
      payload: {
        page: page,
        count: count,
        search: search,
        number: 2,
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
            { label: '订单号', name: 'pid' },
            { label: '用户账号', name: 'account' },
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
    data: state.weight.topList,
    listLoading: state.loading.effects['weight/queryTopList'],
    updateLoading: state.loading.effects['weight/update'],
  };
}

export default connect(mapStateToProps)(Page);
