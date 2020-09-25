import React, { Component } from 'react';
import { Tag, Form, Select, Modal, Input } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import SearchGroup from '@/components/SearchGroup';

const FormItem = Form.Item;
const Option = Select.Option;

class Page extends Component {
  state = {
    page: 1,
    search: null,
  };
  formRef = React.createRef();

  columns = [
    {
      title: '单号',
      dataIndex: 'pid',
    }, {
      title: '账号',
      dataIndex: 'account',
    }, {
      title: '数量',
      dataIndex: 'amount',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '手续费',
      dataIndex: 'fee',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '币种',
      dataIndex: 'asset',
    }, {
      title: '状态',
      dataIndex: 'status',
      render(text) {
        return (
          <div>{[<Tag color="blue">待审核</Tag>, <Tag color="green">完成</Tag>, <Tag color="black">拒绝</Tag>, <Tag color="black">钱包拒绝</Tag>, <Tag color="blue">待钱包处理</Tag>, <Tag color="blue">转账中</Tag>][text]}</div>
        );
      },
    }, {
      title: '申请时间',
      dataIndex: 'create_time',
    }, {
      title: '接收方',
      dataIndex: 'address',
    }, {
      title: 'Hash',
      dataIndex: 'hash',
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: 60,
      fixed: 'right',
      render: (_, record) => (
        record.status == 0 ? <a onClick={() => this.handleReceipt(record)}>审核</a> : <div>-</div>
      ),
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, search } = this.state;
    this.props.dispatch({
      type: 'withdrawal/queryList',
      payload: {
        page: page,
        search: search,
      }
    });
  };

  handleReceipt = (row) => {
    Modal.confirm({
      title: '审核',
      content: (
        <div>
          账号：{row.account}<br />
          数量：{parseFloat(row.amount)}{row.asset}<br /><br />
          <Form ref={this.formRef}>
            <FormItem
              label='审核'
              name='status'
              rules={[{ required: true, message: `请选择` }]}
            >
              <Select placeholder="请选择">
                <Option value={1}>通过</Option>
                <Option value={2}>拒绝</Option>
              </Select>
            </FormItem>
            <FormItem
              label='备注'
              name='remark'
            >
              <Input placeholder="备注" />
            </FormItem>
          </Form>
        </div>
      ),
      onOk: (() => {
        return new Promise((resolve, reject) => {
          this.formRef.current.validateFields().then(values => {
            this.props.dispatch({
              type: 'withdrawal/audit',
              payload: {
                id: row.id,
                ...
                values
              },
            }).then((data) => {
              if (data != 'error') {
                resolve()
                this.loadData();

              } else {
                reject()
              }
            })
          }).catch(() => reject());
        })
      }),
    });
  }

  render() {
    const { page, search } = this.state;
    const { data, listLoading, updateLoading } = this.props;

    return (
      <div>
        <SearchGroup onSearch={(e) => {
          this.state.page = 1;
          this.state.search = e;
          this.loadData();
        }} items={
          [{ label: '用户账号', name: 'account' },
          {
            label: '币种', name: 'asset',
            custom: (
              <Select>
                <Option value='USDT'>USDT</Option>
                <Option value='ETH'>ETH</Option>
                <Option value='BTC'>BTC</Option>
                <Option value='FIL'>FIL</Option>
              </Select>
            )
          },
          { label: '哈希', name: 'hash' },
          {
            label: '状态', name: 'status',
            custom: (
              <Select>
                <Option value={0}>待审核</Option>
                <Option value={1}>完成</Option>
                <Option value={2}>拒绝</Option>
                <Option value={3}>钱包拒绝</Option>
                <Option value={4}>待钱包处理</Option>
                <Option value={5}>转账中</Option>
              </Select>
            )
          }]}
        />
        <OperationGroup onExport={(all) => {
          this.props.dispatch({
            type: 'withdrawal/export',
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
          loading={listLoading || updateLoading}
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
    data: state.withdrawal.list,
    listLoading: state.loading.effects['withdrawal/queryList'],
    updateLoading: state.loading.effects['withdrawal/audit'],
  };
}

export default connect(mapStateToProps)(Page);