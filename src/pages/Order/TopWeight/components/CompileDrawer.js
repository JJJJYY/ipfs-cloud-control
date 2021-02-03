import React, { Component } from 'react';
import { connect } from 'umi';
import Upload from '@/components/Upload';
import {
  Drawer,
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
} from 'antd';
import styles from '../index.less';
const DescriptionItem = ({ title, content }) => (
  <div className={styles.itemProfileT}>
    {title}：<span className={styles.itemProfileT2}>{content}</span>
  </div>
);
class CompileDrawer extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      ids: null,
      placement: 'right',
      visibleInviteDrawer: this.props.visible,
      loadings: false,
      sum: null,
    };
  }
  formRef = React.createRef();

  componentDidMount() {
    this.formRef.current &&
      this.formRef.current.setFieldsValue({
        follow_user: this.props.name.follow_user,
        contract_no: this.props.name.contract_no,
        pay_img: this.props.name.pay_img,
        service_fee: this.props.name.service_fee,
        remark: this.props.name.remark,
        status: this.props.name.status,
      });
  }
  componentWillReceiveProps(props) {
    this.formRef.current &&
      this.formRef.current.setFieldsValue({
        follow_user: props.name.follow_user,
        contract_no: props.name.contract_no,
        pay_img: props.name.pay_img,
        service_fee: props.name.service_fee,
        remark: props.name.remark,
        status: props.name.status,
      });
    this.setState({ visibleInviteDrawer: props.visible });
  }
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
  onGenderChange = (value, e, index) => {
    const { info } = this.props;

    info[index].quantity = value;
    info[index].total_amount =
      info[index].total_price * info[index].quantity * info[index].discount;
    this.setState({ info }, () => {
      let sum = 0;
      this.state.info.map(item => {
        sum += item.total_amount * 1;
      });
      this.setState({ sum: sum });
    });
  };
  onGenderChanges = (value, e, index) => {
    const { info } = this.props;
    info[index].discount = value;
    info[index].total_amount =
      info[index].total_price * info[index].quantity * info[index].discount;
    this.setState({ info }, () => {
      let sum = 0;
      this.state.info.map(item => {
        sum += item.total_amount * 1;
      });
      this.setState({ sum: sum });
    });
  };
  onClose = () => {
    this.setState(
      {
        visibleInviteDrawer: false,
      },
      () => {},
    );
  };
  handleActions = (id, index) => {
    this.props.handleActions(id, index);
  };
  render() {
    const { placement, loadings, visibleInviteDrawer } = this.state;

    const onFinish = values => {
      this.props.onFinish(values);
      this.props.loadData();
    };
    return (
      <div>
        <Drawer
          title="编辑"
          width={1000}
          placement={placement}
          onClose={this.onClose}
          visible={visibleInviteDrawer}
          destroyOnClose
        >
          {console.log(visibleInviteDrawer)}
          <Divider>跟进信息</Divider>
          <Form
            layout="vertical"
            ref={this.formRef}
            name="control-hooks"
            onFinish={onFinish}
            autoComplete="off"
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
                    this.props.name.user && this.props.name.user.user_name
                  }
                />
              </Col>

              <Col span={12}>
                <DescriptionItem
                  title="UID"
                  content={this.props.name.user && this.props.name.user.id}
                />
              </Col>
            </Row>
            <Divider>收货信息</Divider>

            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="姓名"
                  content={
                    this.props.name.express &&
                    this.props.name.express.express_name
                  }
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="手机"
                  content={
                    this.props.name.express &&
                    this.props.name.express.express_mobile
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
                  content={this.props.name.created_at}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="完成时间"
                  content={
                    this.props.name.pay_status == 1 ||
                    this.props.name.pay_status == 2
                      ? this.props.name.pay_time
                      : '-'
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="订单号"
                  content={this.props.name.order_code}
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
                dataSource={this.props.name.info}
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
              <div style={{ width: '171px', padding: '16px' }}>技术服务费</div>
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
            <div style={{ width: '100%', height: '50px', marginTop: '30px' }}>
              <div style={{ float: 'right', display: 'flex', width: '240px' }}>
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
                  {console.log(this.state.sum)}¥
                  {this.state.sum && this.state.sum.toFixed(2)}
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
                  {this.state ? '保存中' : '保存'}
                </Button>
              </div>
            </Form.Item>
          </Form>
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
export default connect(mapStateToProps)(CompileDrawer);
