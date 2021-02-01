import React, { Component } from 'react';
import {
  Drawer,
  Tag,
  Select,
  Dropdown,
  Space,
  Badge,
  Table,
  Divider,
  Col,
  Row,
  ide,
  Input,
  message,
  Button,
  Form,
  InputNumber,
  DatePicker,
} from 'antd';
class CompileDrawer extends Component {
  formRef = React.createRef();
  constructor(state) {
    super(state);
    this.state = {
      ids: null,
      placement: 'left',
      visibleInviteDrawer: false,
    };
  }

  onClose = () => {
    this.setState({
      visibleInviteDrawer: false,
    });
  };
  render() {
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
          } else {
            this.setState({
              loadings: false,
            });
          }
        });
    };
    return (
      <div>
        {this.state.ids ? (
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
                    title="订单号"
                    content={this.state.ids.order_code}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="创建时间"
                    content={this.state.ids.created_at}
                  />
                </Col>
                <Col span={12}>
                  <DescriptionItem
                    title="产品名称"
                    content={
                      this.state.ids.group &&
                      this.state.ids.group.product_group_name
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem
                    title="完成时间"
                    content={
                      this.state.ids.status == 2
                        ? '-'
                        : this.state.ids.updated_at
                    }
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
                {console.log(this.state.info, 'his.state.info')}
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
    );
  }
}

export default CompileDrawer;
