import 'braft-editor/dist/index.css';
import React, { Component } from 'react';
import {
  Select,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  DatePicker,
  InputNumber,
  Tag,
  Button,
  Collapse,
  Space,
  Radio,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import Editor from '@/components/Editor';
import moment from 'moment';
import Upload from '@/components/Upload';
import styles from './index.less';
import './index.css';
const Option = Select.Option;

class Page extends Component {
  state = {
    page: 1,
    count: 10,
    visible: false,
    visible1: false,
    editdata: null,
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    ids: '',
    product_type_name: '',
    keys: '',
    keyg: '',
    rdd: null,
    lus: [],
    text: '确认上架吗?',
    texta: '确认下架吗?',
    info: [
      {
        img: '',
        title: '',
        info: '',
      },
    ],
  };

  formRef = React.createRef();
  formRef1 = React.createRef();

  columns = [
    {
      title: '产品ID',
      dataIndex: 'id',
    },
    {
      title: '商品名称',
      dataIndex: 'type',
      render: text => <div>{text.product_type_name}</div>,
    },
    {
      title: '简介',
      dataIndex: 'introduction',
    },
    {
      title: '单价/元',
      dataIndex: 'price',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(text) {
        return (
          <div>
            {text === 1 ? (
              <Tag color="black">上架</Tag>
            ) : (
              <Tag color="green">下架</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: '上架/下架',
      dataIndex: 'status',
      render: (text, a) => (
        <div>
          {' '}
          <Popconfirm
            placement="top"
            title={this.state.text}
            onConfirm={() => {
              this.confirm(a);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{
                backgroundColor: 'green',
                color: '#fff',
                border: 'none',
                display: text == 1 ? 'none' : 'block',
              }}
            >
              上架
            </Button>{' '}
          </Popconfirm>
          <Popconfirm
            placement="top"
            title={this.state.texta}
            onConfirm={() => {
              this.putaway(a);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{
                display: text == 2 ? 'none' : 'block',
                backgroundColor: '#1890FF',
                color: '#fff',
                border: 'none',
              }}
            >
              下架
            </Button>
          </Popconfirm>
        </div>
      ),
    },
    {
      title: '操作',
      operation: true,
      width: 60,
      fixed: 'right',
      actions() {
        return ['编辑'];
      },
    },
  ];
  confirm = e => {
    let aid = e.id;
    let statea = 1;
    this.props.dispatch({
      type: 'goods/Id',
      payload: {
        id: aid,
      },
    });
    this.props
      .dispatch({
        type: 'goods/Change',
        payload: {
          id: aid,
          status: statea,
        },
      })
      .then(result => {
        if (result != 'error') {
          message.info('上架成功');
          this.loadData();
        }
      });
  };
  putaway = e => {
    let aid = e.id;
    let statea = 2;
    this.props.dispatch({
      type: 'goods/Id',
      payload: {
        id: aid,
      },
    });
    this.props
      .dispatch({
        type: 'goods/Change',
        payload: {
          id: aid,
          status: statea,
        },
      })
      .then(result => {
        if (result != 'error') {
          message.info('上架成功');
          this.loadData();
        }
      });
  };
  componentDidMount() {
    this.loadData();
    this.loadProduct();
  }

  loadData = () => {
    this.props.dispatch({
      type: 'goods/queryList',
      payload: {
        page: this.state.page,
        count: this.state.count,
      },
    });
  };
  // 商品选择
  loadProduct = () => {
    this.props
      .dispatch({
        type: 'goods/get',
      })
      .then(data => {
        this.setState({
          editdata: data,
        });
      });
  };

  handleAction = id => {
    //编辑
    this.setState(
      {
        rdd: id.id,
      },
      () => {
        this.props
          .dispatch({
            type: 'goods/List',
            payload: {
              id: id.id,
            },
          })
          .then(result => {
            this.setState({
              ids: result,
              keyg: result.type.id,
              lus: result.info,
              visible1: true,
            });
          });
      },
    );
  };

  handleActions = () => {
    // 添加
    this.setState({
      rdd: null,
      visible: true,
    });
    // this.loadProduct();
    this.formRef.current &&
      this.formRef.current.setFieldsValue({
        lowest_num: data.lowest_num,
        specs: data.specs,
        introduction: data.introduction,
        product_type_id: data.product_type_id,
        name: data.name,
        en_name: data.en_name,
        contract_duration: data.contract_duration,
        en_highlight: data.en_highlight,
        en_slogan: data.en_slogan,
        en_tag: data.en_tag,
        highlight: data.highlight,
        weight_asset: data.weight_asset,
        min_limit: data.min_limit,
        price: data.price,
        quantity: data.quantity,
        remaining_quantity: data.remaining_quantity,
        service_charge_rate: data.service_charge_rate,
        settlement_period: data.settlement_period,
        slogan: data.slogan,
        start_time: moment(data.start_time, 'YYYY-MM-DD HH:mm:ss'),
        tag: data.tag,
        weight: data.weight,
        contract_details: data.contract_details,
        status: data.status,
      });
  };

  handleClose = () => {
    this.setState({
      visible: false,
      keys: 0,
      info: [
        {
          img: '',
          title: '',
          info: '',
        },
      ],
    });
  };

  readactCancel = () => {
    this.setState({
      visible1: false,
      ids: undefined,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  onSelect = key => {
    this.setState({
      keys: key,
    });
  };
  render() {
    const { visible } = this.state;
    const { data, listLoading, addLoading, updateLoading } = this.props;
    const { Option } = Select;
    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const onFinish = values => {
      this.setState(
        {
          lus: values.info,
        },
        () => {
          this.formRef.current.validateFields().then(row => {
            const { rdd } = this.state;
            let rowId = null;
            if (rdd) {
              rowId = {
                id: rdd,
              };
            }
            row.info = this.state.lus;
            this.props
              .dispatch({
                type: 'goods/add',
                payload: {
                  ...row,
                  ...rowId,
                },
              })
              .then(data => {
                if (data != 'error') {
                  // this.setState({
                  //   rdd: null
                  // })
                  this.loadData();
                  if (rdd) {
                    message.success('修改成功');
                    this.setState({
                      visible1: false,
                      ids: undefined,
                    });
                  } else {
                    message.success('添加成功');
                    this.setState({
                      visible: false,
                      keys: 0,
                      info: [
                        {
                          img: '',
                          title: '',
                          info: '',
                        },
                      ],
                    });
                  }
                }
              });
          });
        },
      );
    };
    return (
      <div className="goods">
        <OperationGroup onAdd={this.handleActions} />
        <EditableTable
          columns={this.columns}
          dataSource={data.data}
          total={data.total}
          loading={listLoading || updateLoading}
          onChange={pagination => {
            this.state.page = pagination.current;
            this.state.count = pagination.pageSize;
            this.loadData();
          }}
          onPutaway={this.putaway}
          onActions={this.handleAction}
          rowKey="id"
        />
        <Modal
          title="添加"
          okText="提交"
          cancelText="取消"
          visible={visible}
          onCancel={this.handleClose}
          footer={false}
          confirmLoading={addLoading || updateLoading}
          destroyOnClose
        >
          <Form
            layout="vertical"
            ref={this.formRef}
            onFinish={onFinish}
            autoComplete="off"
            initialValues={{
              info: [
                {
                  img: '',
                  title: '',
                  info: '',
                },
              ],
            }}
          >
            <Form.Item
              label="商品名称"
              name="product_type_id"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select onChange={this.onSelect} allowClear>
                {this.state.editdata &&
                  this.state.editdata.map(item => {
                    return (
                      <Option key={item.id}>{item.product_type_name}</Option>
                    );
                  })}
              </Select>
            </Form.Item>
            <Form.Item
              style={{ display: this.state.keys == 5 ? 'none' : 'block' }}
              name="specs"
              label="规格型号"
            >
              <Input allowClear />
            </Form.Item>
            <Form.Item
              name="price"
              label={
                this.state.keys == 1
                  ? '单价/台'
                  : this.state.keys == 5
                  ? '单价/年/台'
                  : '单价/T'
              }
              rules={[
                {
                  required: true,
                },
                {
                  pattern: /^\d+$|^\d+[.]?\d+$/,
                  message: '只能输入数字',
                },
              ]}
            >
              <Input maxLength={9} allowClear />
            </Form.Item>
            {this.state.keys == 1 ||
            this.state.keys == 5 ||
            this.state.keys == 0 ? null : (
              <Form.Item
                name="lowest_num"
                label="最低起购/T"
                rules={[
                  {
                    required: true,
                  },
                  {
                    pattern: /^\d+$|^\d+[.]?\d+$/,
                    message: '只能输入数字',
                  },
                ]}
              >
                <Input maxLength={9} allowClear />
              </Form.Item>
            )}
            <Form.Item
              name="introduction"
              label="简介"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input allowClear maxLength={200} className={styles.form_input} />
            </Form.Item>
            <div>
              <Form.Item name="dynamic_form_nest_item" label="详情">
                <Form.List name="info">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <Space
                          key={field.key}
                          style={{ display: 'flex', marginBottom: 8 }}
                          align="baseline"
                        >
                          <div className={styles.form_List}>
                            <div className={styles.form_List1}>
                              <Form.Item
                                name={[field.name, 'img']}
                                fieldKey={[field.fieldKey, 'img']}
                                rules={[
                                  { required: true, message: '请上传图片' },
                                ]}
                              >
                                <Upload limit={1}></Upload>
                              </Form.Item>
                            </div>
                            <div className={styles.form_List2}>
                              <Form.Item
                                {...field}
                                style={{ width: '340px' }}
                                name={[field.name, 'title']}
                                fieldKey={[field.fieldKey, 'title']}
                                key={index + 1}
                                rules={[
                                  { required: true, message: '请输入标题' },
                                ]}
                              >
                                <Input
                                  maxLength={20}
                                  allowClear
                                  style={{ width: '340px' }}
                                  placeholder="请输入标题"
                                />
                              </Form.Item>
                              <Form.Item
                                {...field}
                                style={{ marginTop: '15px' }}
                                name={[field.name, 'info']}
                                fieldKey={[field.fieldKey, 'info']}
                                key={index}
                                rules={[
                                  { required: true, message: '请输入内容' },
                                ]}
                              >
                                <Input
                                  maxLength={100}
                                  allowClear
                                  placeholder="请输入内容"
                                />
                              </Form.Item>
                            </div>
                          </div>
                          <MinusCircleOutlined
                            onClick={() => {
                              if (fields.length > 1) {
                                remove(field.name);
                              } else {
                                message.info('最少输入一个详情');
                              }
                            }}
                          />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button onClick={() => add()} block>
                          添加
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </div>
            <Form.Item
              name="status"
              label="状态"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group onChange={this.onChange} value={this.value}>
                <Radio value={1}>上架</Radio>
                <Radio value={2}>下架</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  onClick={this.handleClose}
                  style={{ padding: '4px 10px', marginRight: '20px' }}
                >
                  取消
                </Button>
                <Button
                  style={{ padding: '4px 10px' }}
                  type="primary"
                  htmlType="submit"
                >
                  确定
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
        {this.state.ids && (
          <Modal
            title="编辑"
            visible={this.state.visible1}
            // onOk={this.handleSubmits}
            footer={false}
            onCancel={this.readactCancel}
            destroyOnClose
          >
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
              <Form.Item
                name="product_type_id"
                initialValue={this.state.ids.type.id}
                label="商品名称"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  defaultValue={this.state.ids.product_type_id}
                  onChange={this.onSelect}
                  disabled
                >
                  {this.state.editdata.map(val => {
                    return (
                      <Option key={val.id} value={val.id}>
                        {val.product_type_name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="specs"
                style={{ display: this.state.keyg == 5 ? 'none' : '' }}
                initialValue={this.state.ids.specs}
                label="规格型号"
              >
                <Input allowClear />
              </Form.Item>
              <Form.Item
                name="price"
                label={
                  this.state.ids.type.id == 1
                    ? '单价/台'
                    : this.state.ids.type.id == 5
                    ? '单价/年/台'
                    : '单价/T'
                }
                initialValue={this.state.ids.price}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input maxLength={10} allowClear />
              </Form.Item>
              {this.state.keyg == 1 ||
              this.state.keyg == 5 ||
              this.state.keyg == 0 ? null : (
                <Form.Item
                  // style={{ display: this.state.keyg == 1 ? 'none' : this.state.keyg == 5 ? 'none' : this.state.keyg == 0 ? 'none' : 'block' }}
                  name="lowest_num"
                  label="最低起购/T"
                  initialValue={this.state.ids.lowest_num}
                >
                  <Input allowClear />
                </Form.Item>
              )}

              <Form.Item
                name="introduction"
                label="简介"
                initialValue={this.state.ids.introduction}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input
                  maxLength={200}
                  allowClear
                  className={styles.form_input}
                />
              </Form.Item>
              <div>
                <Form.Item label="详情" name="dynamic_form_nest_item">
                  <Form.List name="info">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Space
                            key={field.key}
                            style={{ display: 'flex', marginBottom: 8 }}
                            align="baseline"
                          >
                            <div className={styles.form_List}>
                              <div className={styles.form_List1}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'img']}
                                  fieldKey={[field.fieldKey, 'img']}
                                  rules={[
                                    { required: true, message: '请上传图片' },
                                  ]}
                                >
                                  <Upload limit={1}></Upload>
                                </Form.Item>
                              </div>
                              <div className={styles.form_List2}>
                                <Form.Item
                                  {...field}
                                  style={{ width: '340px' }}
                                  name={[field.name, 'title']}
                                  fieldKey={[field.fieldKey, 'title']}
                                  key={index}
                                  rules={[{ required: false }]}
                                >
                                  <Input
                                    maxLength={20}
                                    style={{ width: '340px' }}
                                    placeholder="标题"
                                  />
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  style={{ marginTop: '15px' }}
                                  name={[field.name, 'info']}
                                  fieldKey={[field.fieldKey, 'info']}
                                  key={index + 1}
                                  rules={[
                                    {
                                      required: true,
                                      message: '请输入内容',
                                    },
                                  ]}
                                >
                                  <Input
                                    maxLength={100}
                                    placeholder="请输入内容"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                            <MinusCircleOutlined
                              onClick={() => {
                                if (fields.length > 1) {
                                  remove(field.name);
                                } else {
                                  message.info('最少输入一个详情');
                                }
                              }}
                            />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button onClick={() => add()} block>
                            添加
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
              </div>
              <Form.Item
                name="status"
                label="状态"
                initialValue={this.state.ids.status}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group
                  onChange={this.onChange}
                  value={this.state.ids.status}
                >
                  <Radio value={1}>上架</Radio>
                  <Radio value={2}>下架</Radio>
                </Radio.Group>
              </Form.Item>
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
                  >
                    确定
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.goods.list,
    listLoading: state.loading.effects['goods/queryList'],
    addLoading: state.loading.effects['goods/add'],
    updateLoading: state.loading.effects['goods/update'],
  };
}

export default connect(mapStateToProps)(Page);
