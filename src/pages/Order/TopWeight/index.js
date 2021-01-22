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
  Form,
  InputNumber,
  DatePicker,
} from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import SearchGroup from '@/components/SearchGroup';
import styles from './index.less';
import Upload from '@/components/Upload';
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
    ids: null,
    id: '',
    user: '',
    status: '',
    search: null,
    product_name: '',
    order_code: '',
    timeStart: '',
    timeEnd: '',
    visible1: false,
    visibleInviteDrawer: false,
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
      dataIndex: 'user',
      render: text => <div>{text.id} </div>,
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
    },
    {
      title: '技术服务费',
      dataIndex: 'service_fee',
      editable: true,
      required: true,
    },
    {
      title: '折扣',
      dataIndex: 'discount',
      editable: true,
      required: true,
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
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: text => <div>{text == null ? '-' : text}</div>,
    },

    {
      title: '操作',
      operation: true,
      showEdit: false,
      width: 60,
      fixed: 'right',
      statusShow(e) {
        // 隐藏
        let show = e.status == 0;
        return show;
      },
      actions() {
        return ['详情', '编辑'];
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
      dataIndex: 'make_price',
    },
    {
      title: '数量',
      dataIndex: 'make_quantity',
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
        type: 1,
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

  handleActions = (id, index) => {
    if (index == 0) {
      let idi = id.id;
      this.props
        .dispatch({
          type: 'weight/Id',
          payload: { id: idi },
        })
        .then(result => {
          if (result != 'error') {
            this.setState(
              {
                ids: result || [],
                visible1: true,
              },
              () => {},
            );
          }
        });
    } else if (index == 1) {
      this.loadDetail(id);
    }
  };
  onClose = () => {
    this.setState({
      visible1: false,
      visibleInviteDrawer: false,
    });
  };
  loadDetail = id => {
    let idi = id.id;
    this.props
      .dispatch({
        type: 'weight/Id',
        payload: { id: idi },
      })
      .then(result => {
        if (result != 'error') {
          this.setState(
            {
              ids: result || [],
              visibleInviteDrawer: true,
            },
            () => {},
          );
        }
      });
  };
  render() {
    const { data, listLoading, updateLoading } = this.props;
    const { placement, visible1, visibleInviteDrawer } = this.state;
    const onFinish = values => {
      console.log(values);
    };
    return (
      <div>
        <SearchGroup
          onSearch={e => {
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
                <Select allowClear>
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
        {/* 订单列表 */}
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
            title="详情"
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
                  content={this.state.ids.user && this.state.ids.user.user_name}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="UID"
                  content={this.state.ids.user && this.state.ids.user.id}
                />
              </Col>
            </Row>
            <Divider>收货信息</Divider>

            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="姓名"
                  content={
                    this.state.ids.express &&
                    this.state.ids.express.express_name
                  }
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="手机"
                  content={
                    this.state.ids.express &&
                    this.state.ids.express.express_mobile
                  }
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
                  content={
                    this.state.ids.group &&
                    this.state.ids.group.product_group_name
                  }
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
                  content={
                    this.state.ids.status == 2 ? this.state.ids.updated_at : '-'
                  }
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
                rowKey="id"
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
              <div style={{ width: '187px', padding: '16px' }}>技术服务费</div>
              <div style={{ width: '102px', padding: '16px' }}>
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
              <div style={{ width: '187px', padding: '16px' }}>专项折扣</div>
              <div style={{ width: '102px', padding: '16px' }}>
                {this.state.ids.discount}
              </div>
            </div>
            <div style={{ width: '100%', height: '50px', marginTop: '50px' }}>
              <div style={{ float: 'right', width: '160px', display: 'flex' }}>
                <div
                  style={{ lineHeight: '32px', flex: 1, textAlign: 'center' }}
                >
                  数量
                </div>
                <div style={{ flex: 1 }}>
                  <Input
                    style={{ width: '50px', textAlign: 'center' }}
                    readOnly
                    value={this.state.ids.num}
                  />
                </div>
                <div
                  style={{ lineHeight: '32px', flex: 1, textAlign: 'center' }}
                >
                  集群
                </div>
              </div>
            </div>
            <div style={{ width: '100%', height: '50px', marginTop: '30px' }}>
              <div style={{ float: 'right', display: 'flex', width: '240px' }}>
                <div
                  style={{ flex: 1, textAlign: 'right', lineHeight: '28px' }}
                >
                  总配置费用:
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    color: 'orange',
                    flex: 1,
                    textIndent: '10px',
                  }}
                >
                  ¥{this.state.ids.total_amount}
                </div>
              </div>
            </div>
          </Drawer>
        ) : null}
        {/* 订单编辑 */}
        {this.state.ids ? (
          <Drawer
            title="编辑"
            width={840}
            placement={placement}
            onClose={this.onClose}
            visible={visibleInviteDrawer}
          >
            <Divider>跟进信息</Divider>
            <Form
              layout="vertical"
              ref={this.formRef}
              name="control-hooks"
              onSubmit={this.handleSubmit}
              onFinish={onFinish}
              autoComplete="off"
              initialValues={{
                info: this.state.lus,
              }}
            >
              <div style={{ display: 'flex', height: '122px' }}>
                <div>
                  <Form.Item
                    name="sadsad"
                    label="跟进人"
                    rules={[{ required: true, message: '跟进人' }]}
                  >
                    <Input allowClear />
                  </Form.Item>
                </div>
                <div style={{ marginLeft: '100px' }}>
                  <Form.Item
                    name="asdasd"
                    label="合同编号"
                    rules={[{ required: true, message: '合同编号' }]}
                  >
                    <Input allowClear />
                  </Form.Item>
                </div>
                <div style={{ marginLeft: '100px' }}>
                  <Form.Item
                    name="img"
                    label="付款证明"
                    rules={[{ required: true, message: '请上传付款截图' }]}
                  >
                    <Upload limit={1}></Upload>
                  </Form.Item>
                </div>
              </div>

              <Divider>用户信息</Divider>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="账户"
                    content={
                      this.state.ids.user && this.state.ids.user.user_name
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="UID"
                    content={this.state.ids.user && this.state.ids.user.id}
                  />
                </Col>
              </Row>
              <Divider>收货信息</Divider>

              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="姓名"
                    content={
                      this.state.ids.express &&
                      this.state.ids.express.express_name
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="手机"
                    content={
                      this.state.ids.express &&
                      this.state.ids.express.express_mobile
                    }
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem title="备注" />
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
                    content={
                      this.state.ids.group &&
                      this.state.ids.group.product_group_name
                    }
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
                    content={
                      this.state.ids.status == 2
                        ? this.state.ids.updated_at
                        : '-'
                    }
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
                  rowKey="id"
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
                <div style={{ width: '187px', padding: '16px' }}>
                  技术服务费
                </div>
                <div style={{ width: '102px', padding: '16px' }}>
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
                <div style={{ width: '187px', padding: '16px' }}>专项折扣</div>
                <div style={{ width: '102px', padding: '16px' }}>
                  {this.state.ids.discount}
                </div>
              </div>
              <div style={{ width: '100%', height: '50px', marginTop: '50px' }}>
                <div
                  style={{ float: 'right', width: '160px', display: 'flex' }}
                >
                  <div
                    style={{ lineHeight: '32px', flex: 1, textAlign: 'center' }}
                  >
                    数量
                  </div>
                  <div style={{ flex: 1 }}>
                    <Input
                      style={{ width: '50px', textAlign: 'center' }}
                      readOnly
                      value={this.state.ids.num}
                    />
                  </div>
                  <div
                    style={{ lineHeight: '32px', flex: 1, textAlign: 'center' }}
                  >
                    集群
                  </div>
                </div>
              </div>
              <div style={{ width: '100%', height: '50px', marginTop: '30px' }}>
                <div
                  style={{ float: 'right', display: 'flex', width: '240px' }}
                >
                  <div
                    style={{ flex: 1, textAlign: 'right', lineHeight: '28px' }}
                  >
                    总配置费用:
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: 'orange',
                      flex: 1,
                      textIndent: '10px',
                    }}
                  >
                    ¥{this.state.ids.total_amount}
                  </div>
                </div>
              </div>
            </Form>
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
