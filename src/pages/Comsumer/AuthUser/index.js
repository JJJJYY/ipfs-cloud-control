import React, { Component } from 'react';
import {
  Drawer,
  Form,
  Input,
  Switch,
  Tag,
  Modal,
  Select,
  Table,
  Divider,
  message,
  Col,
  Row,
  InputNumber,
} from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import SearchGroup from '@/components/SearchGroup';
import styles from './index.less';

const DescriptionItem = ({ title, content }) => (
  <div className={styles.itemProfileT}>
    {title}：<span className={styles.itemProfileT2}>{content}</span>
  </div>
);

const FormItem = Form.Item;
const Option = Select.Option;

class Page extends Component {
  state = {
    visibleDrawer: false,
    visibleInviteDrawer: false,
    page: 1,
    count: 10,
    search: null,
    search: null,
    status: null,
    order_amount: null,
    list: [],
    invitePage: 1,
    inviteCount: 10,
    rank: 0,
    userID: null,
    account: '',
    id: '',
  };
  formRef = React.createRef();

  columns = [
    {
      title: 'UID',
      dataIndex: 'id',
    },
    {
      title: '账号',
      dataIndex: 'user_name',
    },
    {
      title: '消费金额',
      dataIndex: 'order_amount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, a) => (
        <div>
          <Switch
            checkedChildren="正常"
            unCheckedChildren="冻结"
            defaultChecked={text}
            onChange={() => {
              this.onChangeStatus(text, a);
            }}
          />
        </div>
      ),
    },

    {
      title: '注册时间',
      dataIndex: 'created_at',
    },
    {
      title: '操作',
      operation: true,
      showEdit: false,
      width: 60,
      fixed: 'right',
      actions() {
        return ['详情'];
      },
    },
  ];

  columnsReward = [
    {
      title: '订单号',
      dataIndex: 'order_code',
    },
    {
      title: '商品名称',
      dataIndex: 'group',
      render: text => <div>{text.product_group_name} </div>,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
    },
    {
      title: '支付时间',
      dataIndex: 'pay_time',
      render: text => <div>{parseFloat(text)} TB</div>,
    },
    {
      title: '付款金额',
      dataIndex: 'total_amount',
      render: text => <div>{parseFloat(text)} TB</div>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(text) {
        return (
          <div>
            {
              [
                <Tag color="blue">已下单</Tag>,
                <Tag color="green">已完成</Tag>,
                <Tag color="black">已取消</Tag>,
              ][text]
            }
          </div>
        );
      },
    },
  ];

  onChangeStatus = (e, a) => {
    let id = a.id;
    let status;
    if (e == 0) {
      status = 1;
    } else {
      status = 0;
    }
    this.props.dispatch({
      type: 'authUser/updateStatus',
      payload: {
        id: id,
        status: status,
      },
    });
  };

  componentDidMount() {
    this.loadData();
  }

  // loadData = () => {
  //   const { current_page, count,search } = this.state;
  //   this.props.dispatch({
  //     type: 'authUser/queryList',
  //     payload: {
  //       current_page: current_page,
  //       count: count,
  //       account: account,
  //       search: search,
  //       status: status,
  //     },
  //   });
  // };

  loadData = () => {
    const { page, count, search, account, status, id } = this.state;
    this.props.dispatch({
      type: 'authUser/queryList',
      payload: {
        page: page,
        count: count,
        search: search,
        account: account,
        status: status,
        id: id,
      },
    });
  };

  loadUserDetail = id => {
    this.props
      .dispatch({
        type: 'authUser/queryUserDetail',
        payload: { id: id },
      })
      .then(data => {
        if (data != 'error') {
          this.setState({ visibleDrawer: true, userID: id, list: data });
        }
      });
  };

  loadUserInvite = () => {
    const { invitePage, inviteCount, userID, rank } = this.state;
    this.props
      .dispatch({
        type: 'authUser/queryInviteDetailList',
        payload: {
          id: userID,
          page: invitePage,
          count: inviteCount,
          rank: rank,
          maxrank: 2,
        },
      })
      .then(data => {
        if (data != 'error') {
          this.setState({ visibleInviteDrawer: true });
        }
      });
  };

  handleSave = (row, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authUser/update',
      payload: { id: id, ...row },
    }).then(data => {
      if (data != 'error') {
        this.loadData();
      }
    });
  };

  handleActions = (row, index) => {
    if (index == 0) {
      this.loadUserDetail(row.id);
    } else if (index == 1) {
      this.state.userID = row.id;
      this.loadUserInvite({ rank: 0 });
    }
  };

  handleCloseDrawer = () => {
    this.setState({
      visibleDrawer: false,
      visibleInviteDrawer: false,
      userID: null,
      invitePage: 1,
      rank: 0,
    });
  };

  handleExchange = (record, isAdd) => {
    Modal.confirm({
      title: (isAdd ? '充值' : '扣除') + record.asset,
      content: (
        <div>
          <br />
          <Form ref={this.formRef}>
            <FormItem
              label="类型"
              name="type"
              rules={[{ required: true, message: `请选择类型` }]}
            >
              <Select>
                <Option value={2}>质押账户</Option>
                <Option value={3}>充提账户</Option>
              </Select>
            </FormItem>
            <FormItem
              label="数量"
              name="value"
              rules={[{ required: true, message: `请输入数量` }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入数量"
                min={0}
              />
            </FormItem>
          </Form>
        </div>
      ),
      onOk: () => {
        return new Promise((resolve, reject) => {
          this.formRef.current
            .validateFields()
            .then(values => {
              this.props
                .dispatch({
                  type: 'balance/exchange',
                  payload: {
                    auth_user_id: record.auth_user_id,
                    asset: record.asset,
                    value: isAdd ? values.value : -values.value,
                    type: values.type,
                  },
                })
                .then(data => {
                  if (data != 'error') {
                    resolve();
                    this.loadUserDetail(this.state.userID);
                  } else {
                    reject();
                  }
                });
            })
            .catch(() => reject());
        });
      },
    });
  };

  render() {
    const {
      visibleDrawer,
      visibleInviteDrawer,
      page,
      order_amount,
      count,
      search,
      status,
      userID,
      invitePage,
      inviteCount,
      rank,
    } = this.state;
    const {
      data,
      listLoading,
      userDetail,
      updateLoading,
      inviteList,
    } = this.props;

    return (
      <div>
        <SearchGroup
          onSearch={e => {
            console.log(e);
            this.state.page = 1;
            this.state.search = e;
            this.loadData();
          }}
          items={[
            { label: 'UID', name: 'id' },
            { label: '账户', name: 'account' },
            {
              label: '状态',
              name: 'status',
              custom: (
                <Select>
                  <Option value={0}>冻结</Option>
                  <Option value={1}>正常</Option>
                </Select>
              ),
            },
          ]}
        />
        <EditableTable
          columns={this.columns}
          dataSource={data.data}
          total={data ? data.total : 0}
          current={data ? data.current : 0}
          loading={listLoading || updateLoading}
          onChange={pagination => {
            this.state.page = pagination.current;
            this.state.count = pagination.pageSize;
            this.loadData();
          }}
          onSave={this.handleSave}
          onActions={this.handleActions}
          rowKey="id"
        />

        <Drawer
          width={840}
          placement="right"
          onClose={this.handleCloseDrawer}
          visible={visibleDrawer}
        >
          {this.state.list && (
            <div>
              <Divider>用户信息</Divider>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="账户"
                    content={this.state.list.user_name}
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="注册时间"
                    content={this.state.list.created_at}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="邮箱"
                    content={this.state.list.email}
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem title="UID" content={this.state.list.id} />
                </Col>
              </Row>
              <Row></Row>
              <Divider>订单记录</Divider>
              <div style={{ width: '100%' }}>
                <Table
                  columns={this.columnsReward}
                  dataSource={this.state.list.order}
                  pagination={false}
                  rowKey="invitation_count"
                />
              </div>
            </div>
          )}
        </Drawer>

        <Drawer
          width={720}
          placement="right"
          onClose={this.handleCloseDrawer}
          visible={visibleInviteDrawer}
        >
          <div>
            <Divider>邀请纪录</Divider>
            <Row>
              <div style={{ width: '100%' }}>
                <SearchGroup
                  onSearch={e => {
                    this.state.invitePage = 1;
                    this.state.rank = e ? e.rank : 0;
                    this.loadUserInvite();
                  }}
                  items={[
                    {
                      label: '层级关系',
                      name: 'rank',
                      custom: (
                        <Select>
                          <Option value={1}>1级</Option>
                          <Option value={2}>2级</Option>
                        </Select>
                      ),
                    },
                  ]}
                />
                <OperationGroup
                  onExport={all => {
                    this.props.dispatch({
                      type: 'authUser/inviteDetailExport',
                      payload: {
                        id: userID,
                        page: invitePage,
                        count: inviteCount,
                        rank: rank ? rank : 0,
                        maxrank: 2,
                        all: all,
                      },
                    });
                  }}
                />
                <Table
                  columns={this.columnsInvite}
                  loading={listLoading}
                  dataSource={inviteList ? inviteList.list : []}
                  onChange={pagination => {
                    this.state.invitePage = pagination.current;
                    this.state.inviteCount = pagination.pageSize;
                    this.loadUserInvite();
                  }}
                  pagination={{
                    total: inviteList ? inviteList.total : 0,
                    current: inviteList ? inviteList.current : 0,
                    showTotal: total => {
                      return `总数:${total}`;
                    },
                  }}
                  rowKey="id"
                />
              </div>
            </Row>
          </div>
        </Drawer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.authUser.list,
    userDetail: state.authUser.userDetail,
    inviteList: state.authUser.inviteDetailList,
    listLoading:
      state.loading.effects['authUser/queryList'] ||
      state.loading.effects['authUser/queryUserDetail'] ||
      state.loading.effects['authUser/queryInviteDetailList'],
    updateLoading: state.loading.effects['authUser/update'],
  };
}

export default connect(mapStateToProps)(Page);
