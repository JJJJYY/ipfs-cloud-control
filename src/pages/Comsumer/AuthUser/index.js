import React, { Component } from 'react';
import { Drawer, Form, Input, Switch, Tag, Modal, Select, Table, Divider, Col, Row } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import SearchGroup from '@/components/SearchGroup';
import styles from './index.less'

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
    invitePage: 1,
    inviteCount: 10,
    rank: 0,
    userID: null,
  };
  formRef = React.createRef();

  columns = [
    {
      title: 'UID',
      dataIndex: 'id',
    }, {
      title: '账号',
      dataIndex: 'account',
    }, {
      title: '等级',
      dataIndex: 'level',
      editable: true,
      required: true,
      render(text) {
        return (
          <div>{['普通合伙人', '铜牌合伙人', '银牌合伙人', '金牌合伙人', '铂金合伙人', '钻石合伙人', '超级合伙人'][text + 1]}</div>
        );
      },
      custom() {
        return (
          <Select>
            <Option value={-1}>普通合伙人</Option>
            <Option value={0}>铜牌合伙人</Option>
            <Option value={1}>银牌合伙人</Option>
            <Option value={2}>金牌合伙人</Option>
            <Option value={3}>铂金合伙人</Option>
            <Option value={4}>钻石合伙人</Option>
            <Option value={5}>超级合伙人</Option>
          </Select>
        )
      },
    }, {
      title: '邀请人',
      dataIndex: 'up_user',
      editable: true,
    }, {
      title: '状态',
      dataIndex: 'lock',
      editable: true,
      required: true,
      valuePropName: 'checked',
      render(text) {
        return (
          <div>{[<Tag color="green">正常</Tag>, <Tag color="black">冻结</Tag>][text]}</div>
        );
      },
      custom() {
        return (
          <Switch checkedChildren="冻结" unCheckedChildren="正常" />
        )
      },
    }, {
      title: '实名',
      dataIndex: 'auth_status',
      render(text) {
        return (
          <div>{['未实名', '已实名', '已拒绝', '待审核'][text]}</div>
        );
      },
    }, {
      title: '注册时间',
      dataIndex: 'create_time',
    }, {
      title: '算力总额(TB)',
      dataIndex: 'quantity',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '操作',
      operation: true,
      showEdit: true,
      width: 60,
      fixed: 'right',
      actions() {
        return ['详情', '邀请纪录'];
      },
    },
  ];

  columnsReward = [
    {
      title: '累计人数',
      dataIndex: 'invitation_count',
    }, {
      title: '分销奖励',
      dataIndex: 'brokerage',
      render: (text) => (
        <div>{parseFloat(text)} USDT</div>
      ),
    }, {
      title: '累计分销算力',
      dataIndex: 'sum',
      render: (_, record) => (
        <div>{(parseFloat(record.children_purchase) + parseFloat(record.grandchildren_purchase))} TB</div>
      ),
    }, {
      title: '一级分销',
      dataIndex: 'children_purchase',
      render: (text) => (
        <div>{parseFloat(text)} TB</div>
      ),
    }, {
      title: '二级分销',
      dataIndex: 'grandchildren_purchase',
      render: (text) => (
        <div>{parseFloat(text)} TB</div>
      ),
    },
  ];

  columnsBalance = [
    {
      title: '资产类型',
      dataIndex: 'asset',
    }, {
      title: '总数量',
      dataIndex: 'sum',
      render: (_, record) => (
        <div>{(parseFloat(record.available) + parseFloat(record.frozen))}</div>
      ),
    }, {
      title: '可用数量',
      dataIndex: 'available',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '冻结数量',
      dataIndex: 'frozen',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '操作',
      key: 'operation',
      render: (_, record) => (
        <div>
          <a onClick={() => this.handleExchange(record, true)}>充值</a>
          <Divider type='vertical' />
          <a onClick={() => this.handleExchange(record, false)}>扣除</a>
        </div>
      ),
    },
  ];

  columnsHashrate = [
    {
      title: '资产类型',
      dataIndex: 'type',
      render: (text) => (
        <div>{['矿机租赁（云算力保底）', '赠送', '兑换', '推广赠送', '注册送', '活动奖励', '矿机托管', '推广奖励', '其他', '矿机租赁（云算力不保底）', '未知'][text - 1]}</div>
      ),
    }, {
      title: '算力TB',
      dataIndex: 'quantity',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    },
    // {
    //   title: '操作',
    //   key: 'operation',
    //   render: () => (
    //     <div>
    //       <a>充值</a>
    //       <Divider type='vertical' />
    //       <a>扣除</a>
    //     </div>
    //   ),
    // },
  ];

  columnsInvite = [
    {
      title: '邀请用户',
      dataIndex: 'account',
    }, {
      title: '用户等级',
      dataIndex: 'level',
      render: (text) => (
        <div>{['普通合伙人', '铜牌合伙人', '银牌合伙人', '金牌合伙人', '铂金合伙人', '钻石合伙人', '超级合伙人'][text + 1]}</div>
      ),
    }, {
      title: '层级关系',
      dataIndex: 'rank',
      render(text) {
        return text + '级';
      }
    }, {
      title: '购买算力',
      dataIndex: 'quantity',
      render: (text) => (
        <div>{parseFloat(text)} TB</div>
      ),
    }, {
      title: '团队业绩',
      dataIndex: 'reward',
      render: (text) => (
        <div>{(parseFloat(text.children_purchase) + parseFloat(text.grandchildren_purchase))} TB</div>
      ),
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'authUser/queryList',
      payload: {
        page: page,
        count: count,
        search: search,
      }
    })
  }

  loadUserDetail = (id) => {
    this.props.dispatch({
      type: 'authUser/queryUserDetail',
      payload: { id: id },
    }).then((data) => {
      if (data != 'error') {
        this.setState({ visibleDrawer: true, userID: id });
      }
    })
  }

  loadUserInvite = () => {
    const { invitePage, inviteCount, userID, rank } = this.state;
    this.props.dispatch({
      type: 'authUser/queryInviteDetailList',
      payload: {
        id: userID,
        page: invitePage,
        count: inviteCount,
        rank: rank,
        maxrank: 2,
      },
    }).then((data) => {
      if (data != 'error') {
        this.setState({ visibleInviteDrawer: true });
      }
    })
  }

  handleSave = (row, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authUser/update',
      payload: { id: id, ...row },
    }).then((data) => {
      if (data != 'error') {
        this.loadData();
      }
    });
  }

  handleActions = (row, index) => {
    if (index == 0) {
      this.loadUserDetail(row.id);
    } else if (index == 1) {
      this.state.userID = row.id;
      this.loadUserInvite({ rank: 0 });
    }
  }

  handleCloseDrawer = () => {
    this.setState({ visibleDrawer: false, visibleInviteDrawer: false, userID: null, invitePage: 1, rank: 0 });
  }

  handleExchange = (record, isAdd) => {

    Modal.confirm({
      title: (isAdd ? '充值' : '扣除') + record.asset,
      content: (
        <div>
          <br />
          <Form ref={this.formRef}>
            <FormItem
              label='数量'
              name='available'
              rules={[{ required: true, message: `请输入数量` }]}
            >
              <Input placeholder="请输入数量" />
            </FormItem>
          </Form>
        </div>
      ),
      onOk: (() => {
        return new Promise((resolve, reject) => {
          this.formRef.current.validateFields().then(values => {
            this.props.dispatch({
              type: 'balance/exchange',
              payload: {
                auth_user_id: record.auth_user_id,
                asset: record.asset,
                available: isAdd ? values.available : -values.available,
              },
            }).then((data) => {
              if (data != 'error') {
                resolve()
                this.loadUserDetail(this.state.userID);

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
    const { visibleDrawer, visibleInviteDrawer, page, count, search, userID, invitePage, inviteCount, rank } = this.state;
    const { data, listLoading, userDetail, updateLoading, inviteList } = this.props;

    return (
      <div>
        <SearchGroup onSearch={(e) => {
          this.state.page = 1;
          this.state.search = e;
          this.loadData();
        }} items={[{ label: 'UID', name: 'id' }, { label: '账号', name: 'account' }, { label: '邀请人', name: 'up_user' }]} />
        <OperationGroup onExport={(all) => {
          this.props.dispatch({
            type: 'authUser/userExport',
            payload: {
              page: page,
              count: count,
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
            this.state.count = pagination.pageSize;
            this.loadData()
          }}
          onSave={this.handleSave}
          onActions={this.handleActions}
          rowKey="id"
        />

        <Drawer
          width={640}
          placement="right"
          onClose={this.handleCloseDrawer}
          visible={visibleDrawer}
        >
          {userDetail &&
            <div>
              <Divider>用户信息</Divider>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="账户" content={userDetail.account} />
                </Col>
                <Col span={12}>
                  <DescriptionItem title="等级" content={['普通合伙人', '铜牌合伙人', '银牌合伙人', '金牌合伙人', '铂金合伙人', '钻石合伙人', '超级合伙人'][userDetail.level + 1]} />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="手机" content={userDetail.phone} />
                </Col>
                <Col span={12}>
                  <DescriptionItem title="邮箱" content={userDetail.email} />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="邀请码" content={userDetail.invitation_code} />
                </Col>
                <Col span={12}>
                  <DescriptionItem title="上级邀请人" content={userDetail.up_user} />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <DescriptionItem
                    title="谷歌验证"
                    content={userDetail.ga_secret}
                  />
                </Col>
              </Row>
              <Divider>奖励记录</Divider>
              <div style={{ width: '100%' }}>
                <Table columns={this.columnsReward} dataSource={[userDetail.reward]} pagination={false} rowKey="invitation_count" />
              </div>
              <Divider>资金记录</Divider>
              <div style={{ width: '100%' }}>
                <Table columns={this.columnsBalance} dataSource={userDetail.balance} pagination={false} rowKey="id" />
              </div>
              <Divider>算力记录</Divider>
              <div style={{ width: '100%' }}>
                <Table columns={this.columnsHashrate} dataSource={userDetail.weight} pagination={false} rowKey="type" />
              </div>
            </div>
          }
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
                <SearchGroup onSearch={(e) => {
                  this.state.invitePage = 1;
                  this.state.rank = e ? e.rank : 0;
                  this.loadUserInvite();
                }} items={[{
                  label: '层级关系', name: 'rank',
                  custom: (
                    <Select>
                      <Option value={1}>1级</Option>
                      <Option value={2}>2级</Option>
                    </Select>
                  )
                }]} />
                <OperationGroup onExport={(all) => {
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
                }} />
                <Table
                  columns={this.columnsInvite}
                  loading={listLoading}
                  dataSource={inviteList ? inviteList.list : []}
                  onChange={(pagination) => {
                    this.state.invitePage = pagination.current;
                    this.state.inviteCount = pagination.pageSize;
                    this.loadUserInvite()
                  }}
                  pagination={{
                    total: inviteList ? inviteList.total : 0,
                    current: inviteList ? inviteList.current : 0,
                    showTotal: (total) => {
                      return `总数:${total}`;
                    },
                  }}
                  rowKey="id" />
              </div>
            </Row>
          </div>
        </Drawer>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    data: state.authUser.list,
    userDetail: state.authUser.userDetail,
    inviteList: state.authUser.inviteDetailList,
    listLoading: state.loading.effects['authUser/queryList'] || state.loading.effects['authUser/queryUserDetail'] || state.loading.effects['authUser/queryInviteDetailList'],
    updateLoading: state.loading.effects['authUser/update'],
  };
}

export default connect(mapStateToProps)(Page);