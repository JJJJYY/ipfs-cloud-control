import React, { Component } from 'react';
import {
  Form,
  Button,
  InputNumber,
  Input,
  Radio,
  Tag,
  Modal,
  Select,
  Drawer,
  Upload as AntUpload,
  message,
  DatePicker,
  Divider,
  Row,
  Col,
  Table,
  Spin,
} from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import SearchGroup from '@/components/SearchGroup';
import Upload from '@/components/Upload';
import styles from './index.less';
import './index.css';
const FormItem = Form.Item;
const Option = Select.Option;
const { Dragger } = AntUpload;
const DescriptionItem = ({ title, content }) => (
  <div className={styles.itemProfileT}>
    {title}：<span className={styles.itemProfileT2}>{content}</span>
  </div>
);
class Page extends Component {
  state = {
    visible: false,
    visible1: false,
    visible2: false,
    visible3: false,
    visibleDrawer: false,
    visibleInviteDrawer: false,
    page: 1,
    count: 10,
    user: '',
    status: '',
    ide: null,
    search: null,
    product_name: '',
    order_code: '',
    price: '',
    amount: '',
    remark: '',
    discount: '',
    selectedRowKeys: [],
    dataActive: null,
    placement: 'right',
    place: 'left',
    list: null,
    dataAdd: null,
    loadings: false,
    infos: null,
    loading: false,
    infor: null,
    audit: null,
  };
  formRef = React.createRef();
  formRef1 = React.createRef();
  formRef2 = React.createRef();
  formRef3 = React.createRef();
  columns = [
    {
      title: '订单号',
      dataIndex: 'order_code',
    },
    {
      title: '账号',
      dataIndex: 'user',
      render: text => <div>{text.user_name}</div>,
    },
    {
      title: '创建人',
      dataIndex: 'admin_user',
      render: text => <div>{text.username}</div>,
    },
    {
      title: '创建时间',

      dataIndex: 'created_at',
    },
    {
      title: '状态',

      dataIndex: 'audit_status',
      editable: true,
      required: true,
      render(text) {
        return (
          <div>
            {
              [
                <Tag color="blue">待审核</Tag>,
                <Tag color="green">已通过</Tag>,
                <Tag color="black">已拒绝</Tag>,
              ][text]
            }
          </div>
        );
      },
    },
    {
      title: '合计',
      dataIndex: 'total_amount',
    },
    {
      title: '审核人',
      dataIndex: 'audit_account',
      render: (text, record) => {
        return <div>{record.audit_status == 0 ? '-' : text}</div>;
      },
    },
    {
      title: '审核时间',

      dataIndex: 'audit_time',
      render: (text, record) => {
        return <div>{record.audit_status == 0 ? '-' : text}</div>;
      },
    },
    {
      title: '操作',
      width: 60,
      fixed: 'right',
      operation: true,
      showEdit: false,
      statusShow(e) {
        // 隐藏
        let show = e.audit_status == 2;
        return show;
      },
      actions(record) {
        return record.audit_status == 0
          ? ['详情', '编辑', '审核']
          : record.audit_status == 1
          ? ['详情']
          : record.audit_status == 2
          ? ['']
          : [''];
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
            max={e.stock}
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
            onChange={value => this.onGenderChanges(value, e, index)}
            defaultValue={text}
            min={0.1}
            step={0.1}
            precision="2"
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
    this.asdda();
  }

  onGenderChange = (value, e, index) => {
    const { info } = this.state;

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
    const { info } = this.state;
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
  onGenderChangeq = (value, index) => {
    const { dataAdd } = this.state;
    dataAdd[index].quantity = value;
    dataAdd[index].total_amount =
      dataAdd[index].total_price *
      dataAdd[index].quantity *
      dataAdd[index].discount;
    this.setState({ dataAdd }, () => {
      let sum = 0;
      this.state.dataAdd.map(item => {
        sum += item.total_amount * 1;
      });
      this.setState({ sum });
    });
  };
  onGenderChangew = (value, index) => {
    const { dataAdd } = this.state;
    dataAdd[index].discount = value;
    dataAdd[index].total_amount =
      dataAdd[index].total_price *
      dataAdd[index].quantity *
      dataAdd[index].discount;
    this.setState({ dataAdd }, () => {
      let sum = 0;
      this.state.dataAdd.map(item => {
        sum += item.total_amount * 1;
      });
      this.setState({ sum });
    });
  };
  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'replenishmentRecord/queryList',
      payload: {
        page: page,
        count: count,
        search: search,
        type: 2,
      },
    });
  };
  asdda = () => {
    this.props
      .dispatch({
        type: 'replenishmentRecord/queryActive',
      })
      .then(res => {
        this.setState(
          {
            dataActive: res || [],
            price: res[0].amount,
          },
          () => {},
        );
      });
  };
  handleClose = () => {
    this.setState({ visible2: false });
  };

  handleSave = (row, id) => {
    this.props
      .dispatch({
        type: 'replenishmentRecord/update',
        payload: { id: id, ...row },
      })

      .then(data => {
        if (data != 'error') {
          this.loadData();
        }
      });
  };
  handleMaxBackUp = () => {
    let aee = event.target.value;
    this.setState({
      remark: aee,
    });
  };
  onClose = () => {
    this.setState({
      visible1: false,
      visibleInviteDrawer: false,
      visible: false,
      dataAdd: undefined,
      loadings: false,
      sum: undefined,
    });
  };
  handleActions = (row, index) => {
    this.setState({
      ide: row.id,
    });
    if (index == 0) {
      this.setState({
        loading: true,
      });
      this.props
        .dispatch({
          type: 'weight/Id',
          payload: { id: row.id },
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
    } else if (index == 2) {
      Modal.confirm({
        title: '审核',
        content: (
          <div style={{ width: '450px' }}>
            <div>
              <div
                style={{
                  width: '450px',
                  height: '30px',
                  lineHeight: '30px',
                  background: '#EAE8E8',
                  display: 'flex',
                }}
              >
                <div style={{ textIndent: '10px' }}>订单号:</div>
                <div style={{ marginLeft: '5px' }}>{row.order_code}</div>
              </div>
              <div
                style={{
                  width: '450px',
                  height: '100px',
                  lineHeight: '30px',
                  border: '1px solid #EFEDED',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', marginTop: '10px' }}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ marginLeft: '20px' }}>账号:</div>
                    <div style={{ marginLeft: '10px' }}>
                      {row.user.user_name}
                    </div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div style={{ marginLeft: '20px' }}>订单金额:</div>
                    <div style={{ marginLeft: '10px' }}>
                      {row.total_amount}元
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: '18px',
                    marginTop: '10px',
                    display: 'flex',
                  }}
                >
                  <div> 备注:</div>
                  <div style={{ marginLeft: '5px' }}>
                    <Input
                      allowClear
                      onChange={event => this.handleMaxBackUp(event)}
                      style={{ width: '350px', height: '30px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Form ref={this.formRef}>
              <FormItem
                label="审核"
                name="audit_status"
                rules={[{ required: true, message: `请选择` }]}
              >
                <Radio.Group>
                  <Radio value={1}>通过</Radio>
                  <Radio value={2}>拒绝</Radio>
                </Radio.Group>
              </FormItem>
            </Form>
          </div>
        ),
        onOk: () => {
          const { remark } = this.state;
          return new Promise((resolve, reject) => {
            this.formRef.current
              .validateFields()
              .then(values => {
                this.props
                  .dispatch({
                    type: 'replenishmentRecord/auditUpdate',
                    payload: {
                      id: row.id,
                      ...values,
                      remark: remark,
                    },
                  })
                  .then(data => {
                    if (data != 'error') {
                      resolve();
                      this.loadData();
                    } else {
                      reject();
                    }
                  });
              })
              .catch(() => reject());
          });
        },
      });
    } else if (index == 1) {
      this.setState({
        loading: true,
      });
      this.props
        .dispatch({
          type: 'weight/Id',
          payload: { id: row.id },
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
    }
  };

  handleSubmit = values => {
    this.setState(
      {
        dataAdd: this.state.list,
        visible2: false,
      },
      () => {
        let aum = 0;
        this.state.list
          ? this.state.list.map(item => {
              aum += item.total_amount * 1;
            })
          : null;
        this.setState({
          sum: aum,
        });
      },
    );

    message.success('选择完成');
  };
  readactCancel = () => {
    this.setState({
      visible: false,
      visible3: false,
      visibleInviteDrawer: false,
      dataAdd: undefined,
      sum: undefined,
    });
  };
  onSelectChange = value => {
    var set = new Set(this.state.selectedRowKeys);
    if (set.has(value.id)) {
      set.delete(value.id);
    } else {
      set.add(value.id);
    }
    this.setState({ selectedRowKeys: Array.from(set) });
  };

  batchAudit = () => {
    Modal.confirm({
      title: '批量审核',
      content: (
        <div>
          <Form ref={this.formRef}>
            <FormItem
              label="审核"
              name="status"
              rules={[{ required: true, message: `请选择` }]}
            >
              <Select placeholder="请选择">
                <Option value={1}>通过</Option>
                <Option value={2}>拒绝</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
      ),
      onOk: () => {
        return new Promise((resolve, reject) => {
          this.formRef.current
            .validateFields()
            .then(values => {
              this.props
                .dispatch({
                  type: 'replenishmentRecord/batchAudit',
                  payload: {
                    ids: this.state.selectedRowKeys,
                    ...values,
                  },
                })
                .then(data => {
                  if (data != 'error') {
                    resolve();
                    this.setState({ selectedRowKeys: [] });
                    this.loadData();
                  } else {
                    reject();
                  }
                });
            })
            .catch(() => reject());
        });
      },
    });
  };
  addReplenishment = () => {
    this.setState({
      visible: true,
    });
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
  relevance = () => {
    this.setState({
      visible2: true,
    });
  };
  onSelect = e => {
    console.log(e);
  };

  handleChange = (value, id) => {
    this.setState({
      list: id,
    });
  };
  handleCancel = () => {
    this.setState({
      visible3: false,
    });
  };
  render() {
    const {
      visible,
      page,
      placement,
      dataAdd,
      dataActive,
      visible1,
      visible2,
      place,
      visibleInviteDrawer,
      count,
      search,
      selectedRowKeys,
      loadings,
      visible3,
      val,
    } = this.state;
    const { data, listLoading, addLoading, updateLoading } = this.props;
    const rowSelection =
      search && search.status == 0
        ? {
            selectedRowKeys,
            onSelect: this.onSelectChange,
          }
        : null;
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
          <Table
            columns={columns}
            dataSource={record.info}
            pagination={false}
            rowKey="id"
          />
        </div>
      );
    };
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
          if (res != 'erro') {
            this.setState({
              loadings: false,
              visibleInviteDrawer: false,
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
    const onFinishs = values => {
      let arr = [];
      this.state.dataAdd.map(item => {
        let o = {};
        o.discount = item.discount;
        o.quantity = item.quantity;
        o.total_price = item.total_price;
        o.id = item.id;
        arr.push(o);
      });
      this.setState(
        {
          loadings: true,
        },
        () => {
          this.props
            .dispatch({
              type: 'replenishmentRecord/add',
              payload: {
                username: values.username,
                follow_user: values.follow_user,
                contract_no: values.contract_no,
                pay_img: values.pay_img,
                remark: values.remark,
                service_fee: values.service_fee,
                info: arr,
              },
            })
            .then(data => {
              if (data != 'error') {
                this.setState({
                  visible: false,
                  loadings: false,
                  dataAdd: undefined,
                  sum: 0,
                });
                message.success('添加成功');
                this.loadData();
              } else {
                this.setState({
                  loadings: false,
                });
              }
            });
        },
      );
    };

    const { Option } = Select;

    return (
      <Spin size="default" spinning={this.state.loading} delay={500}>
        <div>
          <SearchGroup
            onSearch={e => {
              // this.state.page = 1;
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
              {
                label: '账号',
                name: 'user',
                render: text => <div>{text.user_name}</div>,
              },
              {
                label: '商品名称',
                name: 'product_name',
              },
              {
                label: '支付状态',
                name: 'audit_status',
                custom: (
                  <Select allowClear>
                    <Option value={0}>待审核</Option>
                    <Option value={1}>已通过</Option>
                    <Option value={2}>已拒绝</Option>
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
          <div className={styles.btnGroup}>
            <OperationGroup
              onAdd={this.addReplenishment}
              onExport={all => {
                this.props.dispatch({
                  type: 'replenishmentRecord/export',
                  payload: {
                    page: page,
                    count: count,
                    search: search ? JSON.stringify(search) : null,
                    all: all,
                  },
                });
              }}
            />
            <Button
              className={styles.btn}
              icon={<UploadOutlined />}
              onClick={() => {
                const modal = Modal.warning({
                  title: '批量导入补单',
                  content: (
                    <div>
                      <br />
                      <Dragger
                        name="file"
                        action="/public/?s=Portal.ReplenishmentRecord.Import"
                        onChange={info => {
                          const { status } = info.file;
                          if (status === 'done') {
                            var res = info.file.response;
                            if (res.ret != 200) {
                              message.error(res.msg);
                            } else {
                              modal.destroy();
                              this.loadData();
                              Modal.success({
                                title: '导入结果',
                                content: (
                                  <div>
                                    <br />
                                    表格总数：{res.data.sum} 条<br />
                                    失败数量：{res.data.error} 条<br />
                                    {res.data.error != 0 && (
                                      <a
                                        href={res.data.path}
                                        download="失败补单.xlsx"
                                      >
                                        查看失败结果
                                      </a>
                                    )}
                                  </div>
                                ),
                                okText: '确认',
                              });
                            }
                          } else if (status === 'error') {
                            message.error('上传失败');
                          }
                        }}
                      >
                        <InboxOutlined className={styles.icon} />
                        <p>选择或拖拽Excel文件到此区域上传</p>
                      </Dragger>
                      <a
                        href="/public/replenishment.xlsx"
                        download="补单模板.xlsx"
                      >
                        查看模板
                      </a>
                    </div>
                  ),
                  okText: '取消',
                });
              }}
            >
              批量导入
            </Button>
            {search && search.status == 0 && (
              <Button
                className={styles.btn}
                type="primary"
                onClick={this.batchAudit}
                disabled={selectedRowKeys.length == 0}
              >
                批量审核
              </Button>
            )}
          </div>
          <Modal
            visible={visible2}
            title="关联商品"
            onOk={this.handleSubmit}
            onCancel={this.handleClose}
            maskClosable={false}
            confirmLoading={true}
            height={500}
            style={{ marginLeft: '300px' }}
            destroyOnClose
            footer={[
              <Button key="back" onClick={this.handleClose}>
                取消
              </Button>,
              <Button key="submit" type="primary" onClick={this.handleSubmit}>
                确认
              </Button>,
            ]}
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择商品"
              onChange={this.handleChange}
              optionLabelProp="label"
            >
              {dataActive
                ? dataActive.map(item => (
                    <Select.Option
                      id={item.id}
                      value={item.id + item.product_type_name}
                      key={item.id}
                      total_price={item.total_price}
                      product_type_name={item.product_type_name}
                      specs={item.specs}
                      quantity={item.quantity}
                      discount={item.discount}
                      total_amount={item.total_amount}
                    >
                      <div style={{ display: 'flex' }}>
                        <div style={{ display: 'flex', flex: '1' }}>
                          <div style={{ marginLeft: '10px' }}>产品ID:</div>
                          <div style={{ marginLeft: '10px' }}>{item.id}</div>
                        </div>{' '}
                        <div style={{ flex: '1' }}>
                          {item.product_type_name}
                        </div>{' '}
                        <div style={{ flex: '1' }}>¥{item.total_amount}</div>{' '}
                      </div>
                    </Select.Option>
                  ))
                : null}
            </Select>
            <div style={{ height: '300px' }}></div>
          </Modal>
          <Drawer
            title="添加"
            width={1200}
            placement={place}
            onClose={this.onClose}
            visible={visible}
            destroyOnClose
          >
            <Divider>添加补单</Divider>
            <Form
              layout="vertical"
              ref={this.formRef1}
              name="control-hooks"
              onSubmit={this.handleSubmit}
              onFinish={onFinishs}
              autoComplete="off"
              initialValues={{
                info: this.state.lus,
              }}
            >
              <div style={{}}>
                <div style={{ display: 'flex', height: '80px' }}>
                  <div>
                    <Form.Item
                      name="username"
                      label="账号"
                      rules={[{ required: true, message: '请输入绑定账号' }]}
                    >
                      <Input allowClear placeholder="请输入绑定账号" />
                    </Form.Item>
                  </div>
                  <div style={{ marginLeft: '150px' }}>
                    <Form.Item name="remark" label="备注">
                      <Input
                        allowClear
                        style={{ width: '300px' }}
                        placeholder="请输入备注"
                      />
                    </Form.Item>
                  </div>
                  <div style={{ marginLeft: '100px' }}>
                    <Form.Item
                      name="pay_img"
                      label="付款证明"
                      rules={[{ required: true, message: '请上传付款截图' }]}
                    >
                      <Upload limit={1}></Upload>
                    </Form.Item>
                  </div>
                  <div style={{ marginLeft: '100px' }}>
                    <Form.Item>
                      <Button
                        style={{ padding: '4px 10px' }}
                        type="primary"
                        onClick={this.relevance}
                      >
                        关联
                      </Button>
                    </Form.Item>
                  </div>
                </div>
                <div style={{ display: 'flex', height: '80px' }}>
                  <div>
                    <Form.Item
                      name="follow_user"
                      label="跟进人"
                      rules={[{ required: true, message: '请输入真实姓名' }]}
                    >
                      <Input allowClear placeholder="请输入真实姓名" />
                    </Form.Item>
                  </div>
                  <div style={{ marginLeft: '150px' }}>
                    <Form.Item
                      name="contract_no"
                      label="合同编号"
                      rules={[{ required: true, message: '请输入合同编号' }]}
                    >
                      <Input allowClear placeholder="请输入合同编号" />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <Divider>产品名称</Divider>
              <div style={{ width: '100%' }}>
                <div>
                  <div className={styles.menu}>
                    <div className={styles.item}>产品名称</div>
                    <div className={styles.item}>型号</div>
                    <div className={styles.item}>单价</div>
                    <div className={styles.item}>数量</div>
                    <div className={styles.item}>折扣</div>
                    <div className={styles.item}>小计</div>
                  </div>
                  {this.state.dataAdd
                    ? this.state.dataAdd.map((item, index) => {
                        let total_amount = item.total_amount * 1;
                        return (
                          <div key={index}>
                            <div className={styles.item_val}>
                              <div className={styles.item}>
                                {item.product_type_name}
                              </div>
                              <div className={styles.item}>{item.specs}</div>
                              <div className={styles.item}>
                                {item.total_price}
                              </div>
                              <div className={styles.item}>
                                <div style={{ display: 'flex' }}>
                                  <div style={{ lineHeight: '30px' }}>
                                    数量:
                                  </div>
                                  <div style={{ marginLeft: '5px' }}>
                                    <InputNumber
                                      style={{ width: '70px' }}
                                      min={1}
                                      step={1}
                                      defaultValue={item.quantity}
                                      onChange={value =>
                                        this.onGenderChangeq(value, index)
                                      }
                                      precision=""
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className={styles.item}>
                                <div style={{ display: 'flex' }}>
                                  <div style={{ lineHeight: '30px' }}>
                                    折扣:
                                  </div>
                                  <div style={{ marginLeft: '5px' }}>
                                    <InputNumber
                                      style={{ width: '70px' }}
                                      min={0.1}
                                      step={0.1}
                                      max={1}
                                      precision="2"
                                      defaultValue={item.discount}
                                      onChange={value =>
                                        this.onGenderChangew(value, index)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className={styles.item_total_amount}>
                                {total_amount.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : null}
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
                <div style={{ width: '171px', padding: '16px' }}>
                  技术服务费
                </div>
                <div style={{ width: '102px', padding: '16px' }}>
                  <Form.Item name="service_fee">
                    <InputNumber
                      min={0.2}
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
                    ¥{this.state.sum && this.state.sum.toFixed(2)}
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
                    {this.state.loadings ? '提交中' : '提交'}
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Drawer>
          <EditableTable
            columns={this.columns}
            dataSource={data.data}
            total={data ? data.total : 0}
            current={data ? data.current : 0}
            loading={listLoading || updateLoading}
            expandedRowRender={expandedRowRender}
            rowKey="id"
            onChange={pagination => {
              this.state.page = pagination.current;
              this.state.count = pagination.pageSize;
              this.loadData();
            }}
            onSave={this.handleSave}
            onActions={this.handleActions}
            rowSelection={rowSelection}
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
                  <div style={{ width: '220px', padding: '16px' }}>
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
                {this.state.ids.audit_status == 1 ? null : (
                  <Button onClick={this.compile}>编辑</Button>
                )}
              </div>
            </Drawer>
          ) : null}
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
                      <div style={{ marginTop: '5px' }}>
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
                    <div style={{ display: 'flex' }}>
                      <div style={{ marginTop: '5px' }}>
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
                      ¥{this.state.sum && this.state.sum.toFixed(2)}
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
    data: state.replenishmentRecord.list,
    active: state.replenishmentRecord.active,
    listLoading: state.loading.effects['replenishmentRecord/queryList'],
    addLoading: state.loading.effects['replenishmentRecord/add'],
    updateLoading: state.loading.effects['replenishmentRecord/update'],
  };
}

export default connect(mapStateToProps)(Page);
