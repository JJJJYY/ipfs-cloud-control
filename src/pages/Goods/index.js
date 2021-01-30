import 'braft-editor/dist/index.css';
import React, { Component } from 'react';
import {
  Select,
  Modal,
  Form,
  Input,
  Popconfirm,
  InputNumber,
  message,
  Tag,
  Button,
  Space,
  Radio,
} from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';

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
    loadings: false,
    isModalVisible: false,
    text: '确认上架吗?',
    texta: '确认下架吗?',
    info: [
      {
        img: '',
        title: '',
        info: '',
      },
    ],
    total_price: null,
    stock: null,
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
              <Tag color="green">上架</Tag>
            ) : (
              <Tag color="black">下架</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: '操作',
      operation: true,
      width: 60,
      fixed: 'right',
      actions(record) {
        return record.status == 2
          ? ['编辑', '上架']
          : record.status == 1
          ? ['编辑', '下架']
          : [''];
      },
    },
  ];

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
          editdata: data || [],
        });
      });
  };

  handleAction = (id, index) => {
    //编辑
    if (index == 0) {
      this.setState(
        {
          rdd: id.id,
          visible1: true,
          isModalVisible: true,
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
              if (result != 'error') {
                this.setState({
                  ids: result,
                  keyg: result.type.id,
                  lus: result.info,
                });
                this.formRef1.current.setFieldsValue({
                  ids: result,
                  product_type_id: result.type.id,
                  specs: result.specs,
                  lowest_num: result.lowest_num,
                  introduction: result.introduction,
                  info: result.info,
                  status: result.status,
                  price: result.price,
                  stock: result.stock,
                  rank: result.rank,
                });
              }
            });
        },
      );
    } else if (index == 1) {
      if (id.status == 1) {
        let statea = 2;
        Modal.confirm({
          title: '下架',
          content: '确认下架吗?',
          okText: '提交',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            this.props
              .dispatch({
                type: 'goods/Change',
                payload: {
                  id: id.id,
                  status: statea,
                },
              })
              .then(result => {
                if (result != 'error') {
                  message.info('下架成功');
                  this.loadData();
                }
              });
          },
        });
      } else if (id.status == 2) {
        let statea = 1;
        Modal.confirm({
          title: '上架',
          content: '确定上架吗?',
          okText: '提交',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => {
            this.props
              .dispatch({
                type: 'goods/Change',
                payload: {
                  id: id.id,
                  status: statea,
                },
              })
              .then(result => {
                if (result != 'error') {
                  message.info('上架成功');
                  this.loadData();
                }
              });
          },
        });
      }
    }
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
        price: data.price,
        status: data.status,
        stock: data.stock,
        rank: data.rank,
      });
  };

  handleClose = () => {
    this.setState({
      visible: false,
      isModalVisible: false,
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
    const { visible, isModalVisible, loadings } = this.state;
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
          loadings: true,
          lus: values.info,
        },
        () => {
          this.formRef1.current.validateFields().then(row => {
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
                      loadings: false,
                    });
                  } else {
                    message.success('添加成功');
                    this.setState({
                      loadings: false,
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
    const onChangeunit = e => {
      const { total_price, stock } = this.state;
      this.setState(
        {
          total_price: e.target.value,
        },
        () => {
          if (total_price * stock) {
            this.formRef1.current.setFieldsValue({
              total_price: total_price,
              stock: stock,
              price: total_price * stock,
            });
          }
        },
      );
    };
    const onChangeLowestnum = e => {
      const { total_price, stock } = this.state;
      this.setState(
        {
          stock: e.target.value,
        },
        () => {
          if (total_price * stock) {
            this.formRef1.current.setFieldsValue({
              total_price: total_price,
              stock: stock,
              price: total_price * stock,
            });
          }
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
          maskClosable={false}
        >
          <Form
            layout="vertical"
            ref={this.formRef1}
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
                {this.state.editdata
                  ? this.state.editdata.map(item => {
                      return (
                        <Option key={item.id}>{item.product_type_name}</Option>
                      );
                    })
                  : null}
              </Select>
            </Form.Item>
            <Form.Item
              style={{ display: this.state.keys == 5 ? 'none' : 'block' }}
              name="specs"
              label="规格型号"
            >
              <Input allowClear />
            </Form.Item>
            {this.state.keys == 5 ? null : (
              <Form.Item
                name="total_price"
                label="每T/元"
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
                <Input onChange={onChangeunit} maxLength={9} allowClear />
              </Form.Item>
            )}

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
              name="price"
              label={
                this.state.keys == 1
                  ? '单价/台'
                  : this.state.keys == 5
                  ? '单价/年/台'
                  : '单价/T'
              }
            >
              <Input maxLength={9} readOnly allowClear />
            </Form.Item>
            <Form.Item
              name="stock"
              label={
                this.state.keys == 1
                  ? '库存/台'
                  : this.state.keys == 5
                  ? '库存/T'
                  : '库存(每份576T)'
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
              <Input onChange={onChangeLowestnum} maxLength={9} allowClear />
            </Form.Item>

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
              name="rank"
              label="排序"
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
                  loading={loadings}
                >
                  {this.state.loadings ? '提交中' : '提交'}
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
            maskClosable={false}
          >
            <Form
              layout="vertical"
              ref={this.formRef1}
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
                label="商品名称"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select onChange={this.onSelect} disabled>
                  {this.state.editdata.map(val => {
                    return (
                      <Option key={val.id} value={val.id}>
                        {val.product_type_name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              {this.state.keyg == 5 ? null : (
                <Form.Item name="specs" label="规格型号">
                  <Input allowClear />
                </Form.Item>
              )}

              <Form.Item
                name="price"
                label={
                  this.state.keyg == 1
                    ? '单价/台'
                    : this.state.keyg == 5
                    ? '单价/年/台'
                    : '单价/T'
                }
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
                >
                  <Input allowClear />
                </Form.Item>
              )}
              <Form.Item
                name="stock"
                label={this.state.keyg == 1 ? '库存/台' : '库存/T'}
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
              <Form.Item
                name="introduction"
                label="简介"
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
                name="rank"
                label="排序"
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
              <Form.Item
                name="status"
                label="状态"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group onChange={this.onChange} value="status">
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
                    loading={loadings}
                  >
                    {this.state.loadings ? '提交中' : '提交'}
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
