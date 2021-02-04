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
  message,
  Button,
  Form,
  InputNumber,
  DatePicker,
  Spin,
} from 'antd';
import { connect } from 'umi';
import { DownOutlined } from '@ant-design/icons';
import EditableTable from '@/components/EditableTable';
import SearchGroup from '@/components/SearchGroup';
import styles from './index.less';
import Upload from '@/components/Upload';
import './index.css';
import CompileDrawer from './components/CompileDrawer';
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
    idi: null,
    id: '',
    user: '',
    status: '',
    info: null,
    infos: null,
    search: null,
    sum: 0,
    product_name: '',
    order_code: '',
    timeStart: '',
    timeEnd: '',
    make_quantity: 0,
    visible1: false,
    visibleInviteDrawer: false,
    loadings: false,
    placement: 'right',
    pay_img: null,
    loading: false,
  };
  formRef = React.createRef();
  formRef1 = React.createRef();
  formRef2 = React.createRef();
  columns = [
    {
      title: '订单号',
      dataIndex: 'order_code',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
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
      title: '跟进人员',
      dataIndex: 'follow_user',
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
    {
      title: '技术服务费',
      dataIndex: 'service_fee',
    },
    {
      title: '总计',
      dataIndex: 'total_amount',
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
      dataIndex: 'total_price',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
    },
    {
      title: '折扣',
      dataIndex: 'discount',
    },
    {
      title: '小计',
      dataIndex: 'total_amount',
      render: (text, e, index) => {
        let a = text * 1;
        return <div style={{ color: 'orange' }}> ¥{a.toFixed(2)}</div>;
      },
    },
  ];
  columnsCompile = [
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
      dataIndex: 'total_price',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      render: (text, e, index) => (
        <div>
          {' '}
          数量:{' '}
          <InputNumber
            style={{ width: '70px' }}
            min={1}
            step={1}
            defaultValue={text}
            onChange={value => this.onGenderChange(value, e, index)}
            precision=""
          />{' '}
        </div>
      ),
    },
    {
      title: '折扣',
      dataIndex: 'discount',
      render: (text, e, index) => (
        <div>
          折扣:{' '}
          <InputNumber
            style={{ width: '70px' }}
            min={0.1}
            step={0.1}
            max={1}
            precision="2"
            onChange={value => this.onGenderChanges(value, e, index)}
            defaultValue={text}
          />
        </div>
      ),
    },
    {
      title: '小计',
      dataIndex: 'total_amount',
      render: (text, e, index) => {
        let a = text * 1;
        return <div style={{ color: 'orange' }}> ¥{a.toFixed(2)}</div>;
      },
    },
  ];
  componentDidMount() {
    this.loadData();
  }
  onGenderChange = (value, e, index) => {
    const { info, ids, num } = this.state;

    info[index].quantity = value;
    info[index].total_amount =
      info[index].total_price * info[index].quantity * info[index].discount;
    this.setState({ info }, () => {
      let sum = 0;
      this.state.info.map(item => {
        sum += item.total_amount * 1;
      });
      this.setState({ sum });
    });
  };
  onGenderChanges = (value, e, index) => {
    const { info, ids, num } = this.state;
    info[index].discount = value;
    info[index].total_amount =
      info[index].total_price * info[index].quantity * info[index].discount;
    this.setState({ info }, () => {
      let sum = 0;
      this.state.info.map(item => {
        sum += item.total_amount * 1;
      });
      this.setState({ sum });
    });
  };
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

  handleActions = (id, index) => {
    this.setState({
      ide: id.id,
    });

    if (index == 0) {
      this.setState({
        loading: true,
      });
      this.props
        .dispatch({
          type: 'weight/Id',
          payload: { id: id.id },
        })
        .then(result => {
          if (result != 'error') {
            this.setState({
              ids: result || [],
              infos: result.info || [],
              visible1: true,
              loading: false,
            });
            this.formRef2.current.setFieldsValue({
              pay_img: result.pay_img,
              service_fee: result.service_fee,
            });
          }
        });
    } else if (index == 1) {
      this.loadDetail(id);
    }
  };
  compile = () => {
    const { ide } = this.state;
    this.setState(
      {
        visible1: false,
        visibleInviteDrawer: true,
        loading: true,
      },
      () => {
        this.props
          .dispatch({
            type: 'weight/Id',
            payload: { id: ide },
          })
          .then(result => {
            if (result != 'error') {
              this.setState({
                ids: result || [],
                sum: result.total_amount * 1,
                info: result.info || [],
                visibleInviteDrawer: true,
                loading: false,
              });
              this.formRef.current.setFieldsValue({
                follow_user: result.follow_user,
                contract_no: result.contract_no,
                pay_img: result.pay_img,
                status: result.status,
                remark: result.remark,
                service_fee: result.service_fee,
              });
            }
          });
      },
    );
  };
  onClose = () => {
    this.setState({
      visible1: false,
      visibleInviteDrawer: false,
    });
  };
  readactCancel = () => {
    this.setState({
      visibleInviteDrawer: false,
    });
  };

  loadDetail = id => {
    this.setState(
      {
        idi: id.id,
        loading: true,
      },
      () => {
        this.props
          .dispatch({
            type: 'weight/Id',
            payload: { id: id.id },
          })
          .then(result => {
            if (result != 'error') {
              this.setState(
                {
                  ids: result || [],
                  sum: result.total_amount * 1,
                  info: result.info || [],
                  visibleInviteDrawer: true,
                  loading: false,
                },
                () => {},
              );
              this.formRef.current &&
                this.formRef.current.setFieldsValue({
                  follow_user: result.follow_user,
                  contract_no: result.contract_no,
                  pay_img: result.pay_img,
                  status: result.status,
                  remark: result.remark,
                  service_fee: result.service_fee,
                });
            }
          });
      },
    );
  };

  render() {
    const { data, listLoading, updateLoading } = this.props;
    const {
      placement,
      visible1,
      visibleInviteDrawer,
      loadings,
      info,
    } = this.state;
    const onFinish = values => {
      this.setState({
        loadings: true,
      });
      this.props
        .dispatch({
          type: 'weight/update',
          payload: {
            id: this.state.ids.id,
            info: this.state.info,
            follow_user: values.follow_user,
            contract_no: values.contract_no,
            pay_img: values.pay_img,
            status: values.status,
            remark: values.remark,
            service_fee: values.service_fee,
          },
        })
        .then(res => {
          if (res != 'error') {
            this.setState({
              visibleInviteDrawer: false,
              loadings: false,
            });
            message.success('修改成功');
            this.loadData();
          } else {
            this.setState({
              loadings: false,
            });
          }
        });
    };
    const expandedRowRender = record => {
      const columns = [
        {
          title: '产品',
          dataIndex: 'product_name',
        },
        {
          title: '单价',
          dataIndex: 'total_price',
        },
        {
          title: '数量',
          dataIndex: 'quantity',
        },
        {
          title: '折扣',
          dataIndex: 'discount',
        },
        {
          title: '小计',
          dataIndex: 'total_amount',
        },
      ];
      return (
        <div>
          {' '}
          <Table
            columns={columns}
            dataSource={record.info}
            pagination={false}
            rowKey="id"
          />{' '}
        </div>
      );
    };

    return (
      <Spin size="default" spinning={this.state.loading} delay={500}>
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
                label: '日期',
                name: 'timeStart',
                custom: <DatePicker.RangePicker />,
              },

              {
                label: '跟进人',
                name: 'follow_user',
              },
              {
                label: '支付状态',
                name: 'status',
                custom: (
                  <Select allowClear>
                    <Option value={0}>已取消</Option>
                    <Option value={1}>已下单</Option>
                    <Option value={2}>已完成</Option>
                  </Select>
                ),
              },
            ]}
          />
          {/* 订单列表 */}
          <EditableTable
            columns={this.columns}
            dataSource={data.data}
            expandedRowRender={expandedRowRender}
            className="components-table-demo-nested"
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
              width={1000}
              placement={placement}
              onClose={this.onClose}
              visible={visible1}
            >
              <Form
                layout="vertical"
                ref={this.formRef2}
                name="control-hooks"
                autoComplete="off"
                initialValues={{
                  info: this.state.lus,
                }}
              >
                <Divider>跟进信息</Divider>
                <Row>
                  <div style={{ display: 'flex', height: '80px' }}>
                    <div style={{ width: '200px' }}>
                      <Col span={12}>
                        <DescriptionItem
                          title="跟进人"
                          content={this.state.ids.follow_user}
                        />
                      </Col>
                    </div>
                    <div style={{ width: '200px', marginLeft: '80px' }}>
                      <Col span={20}>
                        <DescriptionItem
                          title="合同编号"
                          content={this.state.ids.contract_no}
                        />
                      </Col>
                    </div>
                    <div
                      style={{
                        width: '200px',
                        marginLeft: '80px',
                        display: 'flex',
                      }}
                    >
                      <div>
                        <Col span={25}>
                          <DescriptionItem title="付款证明" />
                        </Col>
                      </div>

                      <div>
                        <Form.Item name="pay_img">
                          <Upload myname="xiaohei"></Upload>
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </Row>

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
                    <DescriptionItem
                      title="备注"
                      content={this.state.ids.remark}
                    />
                  </Col>
                </Row>

                <Divider>订单记录</Divider>
                <Row></Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="创建时间"
                      content={this.state.ids.created_at}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="完成时间"
                      content={
                        this.state.ids.pay_status == 1 &&
                        this.state.ids.pay_status == 2
                          ? this.state.ids.pay_time
                          : '-'
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="订单号"
                      content={this.state.ids.order_code}
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
                    dataSource={this.state.infos}
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
                  <div style={{ width: '238px', padding: '16px' }}>
                    技术服务费
                  </div>
                  <div style={{ width: '102px', padding: '16px' }}>
                    {this.state.ids.service_fee}
                  </div>
                </div>
                <div
                  style={{ width: '100%', height: '50px', marginTop: '30px' }}
                >
                  <div
                    style={{ float: 'right', display: 'flex', width: '240px' }}
                  >
                    <div
                      style={{
                        flex: 1,
                        textAlign: 'right',
                        lineHeight: '28px',
                      }}
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
              <div style={{ float: 'right' }}>
                <Button onClick={this.compile}>编辑</Button>
              </div>
            </Drawer>
          ) : null}
          {/* 订单编辑 */}

          {this.state.ids ? (
            // <CompileDrawer
            //   onFinish={onFinish}
            //   loadData={this.loadData}
            //   loadDetail={this.loadDetail}
            //   visible={visibleInviteDrawer}
            //   name={this.state.ids}
            //   info={info}
            // >
            //   {}
            // </CompileDrawer>
            <Drawer
              title="编辑"
              width={1000}
              placement={placement}
              onClose={this.onClose}
              visible={visibleInviteDrawer}
              destroyOnClose
            >
              <Divider>跟进信息</Divider>
              <Form
                layout="vertical"
                ref={this.formRef}
                name="control-hooks"
                onFinish={onFinish}
                autoComplete="off"
                initialValues={{
                  info: this.state.lus,
                }}
              >
                <div style={{ display: 'flex', height: '122px' }}>
                  <div>
                    <Form.Item
                      name="follow_user"
                      label="跟进人"
                      rules={[{ required: true, message: '跟进人' }]}
                    >
                      <Input style={{ height: '25px' }} allowClear />
                    </Form.Item>
                  </div>
                  <div style={{ marginLeft: '150px' }}>
                    <Form.Item
                      name="contract_no"
                      label="合同编号"
                      rules={[{ required: true, message: '合同编号' }]}
                    >
                      <Input style={{ height: '25px' }} allowClear />
                    </Form.Item>
                  </div>
                  <div style={{ marginLeft: '150px' }}>
                    <Form.Item
                      name="pay_img"
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
                    <div style={{ display: 'flex' }}>
                      <div>
                        <DescriptionItem title="备注" />
                      </div>
                      <div>
                        <Form.Item name="remark">
                          <Input
                            allowClear
                            style={{ width: '260px', height: '25px' }}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </Col>
                </Row>

                <Divider>订单记录</Divider>

                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="创建时间"
                      content={this.state.ids.created_at}
                    />
                  </Col>
                  <Col span={12}>
                    <DescriptionItem
                      title="完成时间"
                      content={
                        this.state.ids.pay_status == 1 &&
                        this.state.ids.pay_status == 2
                          ? this.state.ids.pay_time
                          : '-'
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <DescriptionItem
                      title="订单号"
                      content={this.state.ids.order_code}
                    />
                  </Col>
                  <Col span={12}>
                    <div style={{ display: 'flex' }}>
                      <div>
                        <DescriptionItem title="订单状态" />
                      </div>
                      <div>
                        <Form.Item name="status">
                          <Select placeholder="">
                            <Option value={0}>已取消</Option>
                            <Option value={1}>已下单</Option>
                            <Option value={2}>已完成</Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Divider>产品名称</Divider>
                <div style={{ width: '100%' }}>
                  <Table
                    columns={this.columnsCompile}
                    dataSource={this.state.info}
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
                  <div style={{ width: '171px', padding: '16px' }}>
                    技术服务费
                  </div>
                  <div style={{ width: '102px', padding: '16px' }}>
                    <Form.Item name="service_fee">
                      <InputNumber
                        min={0.1}
                        step={0.1}
                        max={1}
                        precision="2"
                        allowClear
                        style={{ width: '70px' }}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div
                  style={{ width: '100%', height: '50px', marginTop: '30px' }}
                >
                  <div
                    style={{ float: 'right', display: 'flex', width: '240px' }}
                  >
                    <div
                      style={{
                        flex: 1,
                        textAlign: 'right',
                        lineHeight: '28px',
                      }}
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
                      ¥{this.state.sum.toFixed(2)}
                    </div>
                  </div>
                </div>
                <Form.Item>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      onClick={this.readactCancel}
                      style={{ padding: '4px 10px', marginRight: '20px' }}
                    >
                      取消
                    </Button>
                    <Button
                      style={{ padding: '4px 10px' }}
                      type="primary"
                      htmlType="submit"
                      loading={loadings}
                    >
                      {this.state.loadings ? '保存中' : '保存'}
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Drawer>
          ) : null}
        </div>
      </Spin>
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
