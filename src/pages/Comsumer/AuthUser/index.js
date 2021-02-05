import React, { Component } from 'react';
import {
  Drawer,
  Form,
  Switch,
  Tag,
  Select,
  Table,
  Divider,
  Col,
  Row,
} from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
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
    status: null,
    order_amount: null,
    list: [],
    invitePage: 1,
    inviteCount: 10,
    rank: 0,
    userID: null,
    account: '',
    id: '',
    switchflag: false,
    loadings: [],
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
            onChange={switchflag => {
              this.onChangeStatus(switchflag, a);
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
      title: '创建时间',
      dataIndex: 'created_at',
    },
    {
      title: '支付时间',
      dataIndex: 'pay_time',
      render: (text, a) => <div>{a.status == 2 ? text : '-'} </div>,
    },
    {
      title: '付款金额',
      dataIndex: 'total_amount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(text) {
        return (
          <div>
            {
              [
                <Tag color="black">已取消</Tag>,
                <Tag color="green">已下单</Tag>,
                <Tag color="blue">已完成</Tag>,
              ][text]
            }
          </div>
        );
      },
    },
  ];

  onChangeStatus = (switchflag, a) => {
    let id = a.id;
    let status;
    if (switchflag == false) {
      status = 0;
    } else {
      status = 1;
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

  handleActions = (row, index) => {
    if (index == 0) {
      this.loadUserDetail(row.id);
    } else if (index == 1) {
      this.state.userID = row.id;
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

  render() {
    const { visibleDrawer } = this.state;
    const { data, listLoading, updateLoading } = this.props;

    return (
      <div>
        <SearchGroup
          onSearch={e => {
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
                <Select allowClear>
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
                  rowKey="id"
                />
              </div>
            </div>
          )}
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
