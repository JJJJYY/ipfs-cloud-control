import React, { Component } from 'react';
import {
  Drawer,
  Tag,
  Select,
  Table,
  Divider,
  Col,
  Row,
  Input,
  InputNumber,
  DatePicker,
} from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import SearchGroup from '@/components/SearchGroup';
import styles from './index.less';
import './index.css';
const Option = Select.Option;
const DescriptionItem = ({ title, content }) => (
  <div className={styles.itemProfileT}>
    {title}：<span className={styles.itemProfileT2}>{content}</span>
  </div>
);
class Page extends Component {
  state = {
    visible: false,
    visibleDrawer: false,
    page: 1,
    count: 10,
    search: null,
    visible1: false,
    placement: 'right',
  };
  formRef = React.createRef();

  columns = [
    {
      title: '订单号',
      dataIndex: 'pid',
    },
    {
      title: 'UID',
      dataIndex: 'id',
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '商品名称',
      dataIndex: 'related_name',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
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
      title: '折扣',
      dataIndex: 'service_charge_rate',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber min={0} max={1} step={0.1} />;
      },
    },
    {
      title: '订单金额',
      dataIndex: 'payment_quantity',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber min={0} />;
      },
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
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    // {
    //   title: '质押数量',
    //   dataIndex: 'pledged',
    //   render: (text) => (
    //     <div>{parseFloat(text)}</div>
    //   ),
    // },
    {
      title: '操作',
      operation: true,
      showEdit: true,
      width: 60,
      fixed: 'right',
      actions() {
        return ['详情'];
      },
    },
  ];
  columnsReward = [
    {
      title: '商品名称',
      dataIndex: 'invitation_count',
    },
    {
      title: '型号',
      dataIndex: 'brokerage',
      render: text => <div>{parseFloat(text)} USDT</div>,
    },
    {
      title: '单价',
      dataIndex: 'sum',
      render: (_, record) => (
        <div>
          {parseFloat(record.children_purchase) +
            parseFloat(record.grandchildren_purchase)}{' '}
          TB
        </div>
      ),
    },
    {
      title: '数量',
      dataIndex: 'children_purchase',
      render: text => <div>{parseFloat(text)} TB</div>,
    },
    {
      title: '小计',
      dataIndex: 'grandchildren_purchase',
      render: text => <div>{parseFloat(text)} TB</div>,
    },
    {
      title: '订单状态',
      dataIndex: 'grandchildren_purchase',
      render: text => <div>已完成</div>,
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
        number: 1,
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

  handleActions = () => {
    this.setState({
      visible1: true,
    });
  };
  onClose = () => {
    this.setState({
      visible1: false,
    });
  };
  render() {
    const { page, count, search } = this.state;
    const { data, listLoading, updateLoading } = this.props;
    const { placement, visible1 } = this.state;

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
            { label: '账号', name: 'account' },
            { label: '商品名称', name: 'related_name' },
            {
              label: '支付状态',
              name: 'status',
              custom: (
                <Select>
                  <Option value={0}>未付款</Option>
                  <Option value={1}>已付款</Option>
                  <Option value={2}>关闭</Option>
                  <Option value={3}>超时</Option>
                </Select>
              ),
            },
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
          onActions={this.handleActions}
          onSave={this.handleSave}
          rowKey="id"
        />
        <Drawer
          width={840}
          placement={placement}
          onClose={this.onClose}
          visible={visible1}
        >
          <Divider>用户信息</Divider>
          <Row>
            <Col span={12}>
              <DescriptionItem title="账户" content={'121212'} />
            </Col>
            <Col span={12}>
              <DescriptionItem
                title="姓名"
                content={
                  ['223', '654', '55', '44', '33', '22', '11']['2313211']
                }
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="手机" content={'phone'} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="备注" content={'撒大声地'} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="UID" content={'id'} />
            </Col>
          </Row>
          <Divider>订单记录</Divider>
          <Row>
            <Col span={12}>
              <DescriptionItem title="订单状态" content={'已完成'} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="订单号" content={'232312232'} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="产品名称" content={'存储云服务'} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="创建时间" content={'2020-1-1-14:00'} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="完成时间" content={'2020-1-1-14:00'} />
            </Col>
          </Row>
          <Divider>产品信息</Divider>
          <div style={{ width: '100%' }}>
            <Table
              columns={this.columnsReward}
              dataSource={['reward']}
              pagination={false}
              rowKey="invitation_count"
            />
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              borderBottom: '1px solid #f0f0f0',
              height: '54.6px',
            }}
          >
            <div style={{ width: '132.8px', padding: '16px' }}>技术服务费</div>
            <div style={{ width: '147.6px', padding: '16px' }}>20%</div>
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              borderBottom: '1px solid #f0f0f0',
              height: '54.6px',
            }}
          >
            <div style={{ width: '132.8px', padding: '16px' }}>专项折扣</div>
            <div style={{ width: '147.6px', padding: '16px' }}>9.5折</div>
          </div>
          <div style={{ width: '100%', height: '50px', marginTop: '50px' }}>
            <div style={{ float: 'right', display: 'flex' }}>
              <div style={{ lineHeight: '32px', marginRight: '10px' }}>
                数量
              </div>
              <div>
                <Input style={{ width: '50px' }} disabled value="1" />
              </div>
              <div style={{ lineHeight: '32px', marginLeft: '10px' }}>集群</div>
            </div>
          </div>
          <div style={{ width: '100%', height: '50px', marginTop: '30px' }}>
            <div style={{ float: 'right', display: 'flex' }}>
              <div style={{ marginRight: '7px', lineHeight: '28px' }}>
                总配置费用:
              </div>
              <div
                style={{
                  fontSize: '18px',
                  color: 'orange',
                  marginRight: '20px',
                }}
              >
                ¥202021
              </div>
            </div>
          </div>
        </Drawer>
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
