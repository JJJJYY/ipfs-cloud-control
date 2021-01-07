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
    ids: '',
    id: '',
    user: '',
    status: '',
    search: null,
    product_name: '',
    order_code: '',
    timeStart: '',
    timeEnd: '',
    visible1: false,
    placement: 'right',
  };
  formRef = React.createRef();

  columns = [
    {
      title: '订单号',
      dataIndex: 'order_code',
    },
    {
      title: 'UID',
      dataIndex: 'id',
    },
    {
      title: '账号',
      dataIndex: 'user',
      render: text => <div>{text.user_name}</div>,
    },
    {
      title: '商品名称',
      dataIndex: 'group',
      render: text => <div>{text.product_group_name}</div>,
    },
    {
      title: '数量',
      dataIndex: 'num',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber min={0} />;
      },
    },
    {
      title: '技术服务费',
      dataIndex: 'service_fee',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber min={0} max={1} step={0.1} />;
      },
    },
    {
      title: '折扣',
      dataIndex: 'discount',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber min={0.1} max={1} step={0.1} />;
      },
    },
    {
      title: '订单金额',
      dataIndex: 'total_amount',
      editable: false,
      required: false,
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
                <Tag color="black">已取消</Tag>,
                <Tag color="green">已下单</Tag>,
                <Tag color="black">已完成</Tag>,
              ][text]
            }
          </div>
        );
      },
      custom() {
        return (
          <Select>
            <Option value={0}>已取消</Option>
            <Option value={1}>已下单</Option>
            <Option value={2}>已完成</Option>
          </Select>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
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
      title: '产品名称',
      dataIndex: 'product_name',
    },
    {
      title: '型号',
      dataIndex: 'specs',
    },
    {
      title: '单价',
      dataIndex: 'price',
      render: text => <div>{text}元/台</div>,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
    },
    {
      title: '小计',
      dataIndex: 'total_amount',
      render: text => <div style={{ color: 'orange' }}>¥{text}</div>,
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

  handleActions = id => {
    let idi = id.id;
    this.props
      .dispatch({
        type: 'weight/Id',
        payload: { id: idi },
      })
      .then(result => {
        this.setState(
          {
            ids: result,
          },
          () => {
            console.log(this.state.ids);
          },
        );
      });

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
    const {
      page,
      count,
      account,
      status,
      timeEnd,
      timeStart,
      product_name,
    } = this.state;
    const { data, listLoading, updateLoading } = this.props;
    const { placement, visible1 } = this.state;

    return (
      <div>
        <SearchGroup
          onSearch={e => {
            // if (e && e.time) {
            //   e.time = [
            //     e.time[0].format('YYYY-MM-DD'),
            //     e.time[1].format('YYYY-MM-DD'),
            //   ];
            // }
            this.state.search = e;
            this.state.page = 1;
            this.loadData();
          }}
          items={[
            { label: '订单号', name: 'order_code' },
            { label: '账号', name: 'user' },
            { label: '商品名称', name: 'product_name' },
            {
              label: '状态',
              name: 'status',
              custom: (
                <Select>
                  <Option value={0}>已取消</Option>
                  <Option value={1}>已下单</Option>
                  <Option value={2}>已完成</Option>
                </Select>
              ),
            },
            {
              label: '日期',
              name: 'timeStart',
              custom: <DatePicker.RangePicker />,
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
          onSave={this.handleSave}
          rowKey="id"
        />

        {this.state.ids ? (
          <Drawer
            width={840}
            placement={placement}
            onClose={this.onClose}
            visible={visible1}
          >
            <Divider>用户信息</Divider>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="账户"
                  content={this.state.ids.user.user_name}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem title="UID" content={this.state.ids.id} />
              </Col>
            </Row>
            <Divider>收货信息</Divider>

            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="姓名"
                  content={this.state.ids.user.user_name}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="手机"
                  content={this.state.ids.user.phone}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem title="备注" content={this.state.ids.remark} />
              </Col>
            </Row>

            <Divider>订单记录</Divider>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="订单状态"
                  content={
                    this.state.ids.status == 0
                      ? '已取消'
                      : this.state.ids.status == 1
                      ? '已下单'
                      : this.state.ids.status == 2
                      ? '已完成'
                      : ''
                  }
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="订单号"
                  content={this.state.ids.order_code}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="产品名称"
                  content={this.state.ids.group.product_group_name}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="创建时间"
                  content={this.state.ids.created_at}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="完成时间"
                  content={this.state.ids.updated_at}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="订单状态"
                  content={
                    this.state.ids.status == 0
                      ? '已取消'
                      : this.state.ids.status == 1
                      ? '已下单'
                      : this.state.ids.status == 2
                      ? '已完成'
                      : ''
                  }
                />
              </Col>
            </Row>
            <Divider>产品名称</Divider>
            <div style={{ width: '100%' }}>
              <Table
                columns={this.columnsReward}
                dataSource={this.state.ids.info}
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
              <div style={{ width: '132.8px', padding: '16px' }}>
                技术服务费
              </div>
              <div style={{ width: '147.6px', padding: '16px' }}>
                {this.state.ids.service_fee}
              </div>
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
              <div style={{ width: '147.6px', padding: '16px' }}>
                {this.state.ids.discount}
              </div>
            </div>
            <div style={{ width: '100%', height: '50px', marginTop: '50px' }}>
              <div style={{ float: 'right', display: 'flex' }}>
                <div style={{ lineHeight: '32px', marginRight: '10px' }}>
                  数量
                </div>
                <div>
                  <Input
                    style={{ width: '50px', textAlign: 'center' }}
                    readOnly
                    value={this.state.ids.num}
                  />
                </div>
                <div style={{ lineHeight: '32px', marginLeft: '20px' }}>
                  集群
                </div>
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
                  ¥{this.state.ids.total_amount}
                </div>
              </div>
            </div>
          </Drawer>
        ) : null}
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
