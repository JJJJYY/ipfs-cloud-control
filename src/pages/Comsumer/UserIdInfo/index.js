import React, { Component } from 'react';
import { Form, Input, Tag, Modal, Select } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import SearchGroup from '@/components/SearchGroup';

const FormItem = Form.Item;
const Option = Select.Option;

class Page extends Component {
  state = {
    page: 1,
    count: 10,
    search: null,
  };
  formRef = React.createRef();

  columns = [
    {
      title: '账号',
      dataIndex: 'account',
    }, {
      title: '姓名',
      dataIndex: 'real_name',
    }, {
      title: '证件号',
      dataIndex: 'id_card_no',
    }, {
      title: '正面',
      dataIndex: 'id_front',
      render(text) {
        return (
          <a href={text} target='view_window'><img src={text} width={60} alt='' /></a>
        );
      },
    }, {
      title: '背面',
      dataIndex: 'id_verso',
      render(text) {
        return (
          <a href={text} target='view_window'><img src={text} width={60} alt='' /></a>
        );
      },
    }, {
      title: '状态',
      dataIndex: 'status',
      render(text) {
        return (
          <div>{[<Tag color="blue">待审核</Tag>, <Tag color="green">通过</Tag>, <Tag color="black">拒绝</Tag>][text]}</div>
        );
      },
    }, {
      title: '国家',
      dataIndex: 'country',
    }, {
      title: '提交时间',
      dataIndex: 'create_time',
    }, {
      title: '审核时间',
      dataIndex: 'audit_time',
    }, {
      title: '备注',
      dataIndex: 'audit_remark',
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
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'userIdInfo/queryList',
      payload: {
        page: page,
        count: count,
        search: search,
      }
    });
  };

  handleReceipt = (record) => {
    Modal.confirm({
      title: '审核',
      content: (
        <div>
          账号：{record.account}<br /><br />
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
              name='audit_remark'
              rules={[{ message: `请输入` }]}
            >
              <Input placeholder="请输入" />
            </FormItem>
          </Form>
        </div>
      ),
      onOk: (() => {
        return new Promise((resolve, reject) => {
          this.formRef.current.validateFields().then(values => {
            this.props.dispatch({
              type: 'userIdInfo/update',
              payload: {
                id: record.id,
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
    const { data, listLoading, updateLoading } = this.props;

    return (
      <div>
        <SearchGroup onSearch={(e) => {
          this.state.page = 1;
          this.state.search = e;
          this.loadData();
        }} items={
          [{ label: '账号', name: 'account' },
          { label: '证件号', name: 'id_card_no' },
          { label: '姓名', name: 'real_name' },
          {
            label: '状态', name: 'status',
            custom: (
              <Select>
                <Option value={0}>待审核</Option>
                <Option value={1}>通过</Option>
                <Option value={2}>拒绝</Option>
              </Select>
            )
          }
          ]
        } />
        {/* <OperationGroup onAdd={() => this.setState({ visible: true })} /> */}
        <EditableTable
          columns={this.columns}
          dataSource={data ? data.list : []}
          total={data ? data.total : 0}
          current={data ? data.current : 0}
          loading={listLoading || updateLoading}
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
    data: state.userIdInfo.list,
    listLoading: state.loading.effects['userIdInfo/queryList'],
    updateLoading: state.loading.effects['userIdInfo/update'],
  };
}

export default connect(mapStateToProps)(Page);