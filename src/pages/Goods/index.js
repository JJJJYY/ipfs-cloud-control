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
  Radio,
} from 'antd';
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
    modal2Visible: false,
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    ids: '',
    product_type_name: '',
    val1: '',
    val2: '',
    val3: '',
    val4: '',
    val5: '',
    val6: '',
    keys: '',
    keyg: '',
    aid: 1,
    sid: 1,
    lus: '',
    infoa: [],
    text: '确认上架吗?',
    info: [
      {
        id: 1,
        img: '',
        title: '',
        info: '',
      },
    ],
    infos: [
      {
        id: 1,
        img: '',
        title: '',
        info: '',
        status: '',
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
    // {
    //   title: '状态',
    //   dataIndex: 'status',

    //   render(text) {
    //     return (
    //       <div>
    //         {
    //           [
    //             <Tag color="black">上架</Tag>,
    //             <Tag color="black">下架</Tag>,
    //           ][text]
    //         }
    //       </div>
    //     );
    //   }
    // },
    {
      title: '状态',
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
                backgroundColor: '#52C41A',
                borderColor: '#52C41A',
                display: text == 1 ? 'none' : 'block',
              }}
              type="primary"
            >
              上架
            </Button>{' '}
          </Popconfirm>
          <Popconfirm
            placement="top"
            title={this.state.text}
            onConfirm={() => {
              this.putaway(a);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              style={{ display: text == 2 ? 'none' : 'block' }}
              type="primary"
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
      showDelete: false,
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
  loadProduct = () => {
    this.props
      .dispatch({
        type: 'goods/get',
      })
      .then(data => {
        console.log(data);
        this.setState({
          editdata: data,
        });
      });
  };

  handleAction = id => {
    let aid = id.id;
    this.props
      .dispatch({
        type: 'goods/List',
        payload: {
          id: aid,
        },
      })
      .then(result => {
        console.log(result.info);
        this.setState({
          ids: result,
          lus: result.info,
          keyg: result.type.id,
          visible1: true,
        });
      });
  };
  detailAdd = () => {
    console.log(this.state.val1);
    this.setState(
      {
        aid: this.state.aid + 1,
      },
      () => {
        let arr = [...this.state.info];
        arr.push({
          id: this.state.aid,
          img: this.state.val3,
          title: this.state.val1,
          info: this.state.val2,
        });
        this.setState({
          info: arr,
        });
        console.log(arr);
      },
    );
  };
  detailRemove = () => {
    let arr = [...this.state.info];
    arr.pop();
    this.setState({
      info: arr,
    });
    console.log(arr);
  };
  redactRemove = () => {
    let add = [...this.state.ids.info];
    add.pop();
    this.setState({
      lus: add,
    });
    console.log(add);
  };
  redactAdd = () => {
    console.log(this.state.infos);
    this.setState(
      {
        sid: this.state.sid + 1,
      },
      () => {
        let add = [...this.state.infos];
        add.push({
          id: this.state.sid,
          img: this.state.val3,
          title: this.state.val4,
          info: this.state.val5,
        });
        this.setState({
          infos: add,
        });
        console.log(this.state.infos);
      },
    );
  };
  handleActions = () => {
    // 添加
    this.setState({
      visible: true,
    });
    this.loadProduct();
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
      editdata: null,
      keys: 0,
      info: [
        {
          id: 1,
          img: '',
          title: '',
          info: '',
        },
      ],
      val1: '',
      val2: '',
      val3: '',
    });
  };

  handleSubmit = () => {
    this.formRef.current.validateFields().then(row => {
      console.log(row.info);
      row.info = this.state.info.slice(1);
      this.props
        .dispatch({
          type: 'goods/add',
          payload: row,
        })
        .then(data => {
          if (data != 'error') {
            this.loadData();
            this.handleClose();
          }
        });
    });
  };
  handleSubmits = () => {
    this.formRef.current.validateFields().then(row => {
      console.log(row.info);
      row.info = this.state.ids.info;
      this.props
        .dispatch({
          type: 'goods/add',
          payload: row,
        })
        .then(data => {
          if (data != 'error') {
            this.loadData();
            this.readactCancel();
          }
        });
    });
  };
  redactSubmit = () => {
    this.formRef1.current.validateFields();
  };
  readactCancel = () => {
    this.setState({
      visible1: false,
      ids: undefined,
    });
  };

  // handleDel = id => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'goods/update',
  //     payload: { id: id, deleted: 1 },
  //   }).then(data => {

  //     if (data != 'error') {
  //       this.loadData();
  //     }
  //   });
  // };
  // handleChange = info => {
  //   if (info.file.status === 'uploading') {
  //     this.setState({ loading: true });
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, imageUrl =>
  //       this.setState({
  //         imageUrl,
  //         loading: false,
  //       }),
  //     );
  //   }
  // };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
  onSelect = key => {
    console.log(key);
    this.setState({
      keys: key,
    });
  };
  render() {
    const {
      previewVisible,
      previewImage,
      previewTitle,
      val5,
      val6,
    } = this.state;
    const { visible } = this.state;
    const { data, listLoading, addLoading, updateLoading } = this.props;
    const { Option } = Select;
    const { Panel } = Collapse;
    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const Demo = () => {
      const [form] = Form.useForm();
    };
    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

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
          onDelete={this.handleDel}
          onActions={this.handleAction}
          rowKey="id"
        />
        <Modal
          title="添加"
          okText="提交"
          cancelText="取消"
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.handleClose}
          confirmLoading={addLoading || updateLoading}
          destroyOnClose
        >
          <Form layout="vertical" ref={this.formRef}>
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
              <Input />
            </Form.Item>
            <Form.Item
              name="price"
              label="单价/T"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{
                display:
                  this.state.keys == 1
                    ? 'none'
                    : this.state.keys == 5
                    ? 'none'
                    : this.state.keys == 0
                    ? 'none'
                    : 'block',
              }}
              name="lowest_num"
              label="最低起购/T"
            >
              <Input />
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
              <Input className={styles.form_input} />
            </Form.Item>

            <Form.Item name="info" label="详情">
              <Collapse className={styles.form_Collapse}>
                <Panel
                  header={
                    this.state.keys == 1
                      ? '分布式存储服务器'
                      : this.state.keys == 2
                      ? 'FIL集群管理软件'
                      : this.state.keys == 3
                      ? 'MineOS存储管理软件'
                      : this.state.keys == 4
                      ? '数据封装服务'
                      : this.state.keys == 5
                      ? '设备托管服务'
                      : ''
                  }
                >
                  {this.state.info.map((item, index) => {
                    return (
                      <div className={styles.form_details}>
                        <div className={styles.details}>
                          <>
                            <Upload
                              disabled={index == 0 ? false : true}
                              name={item.img}
                              limit={1}
                            ></Upload>
                            <Modal
                              visible={previewVisible}
                              title={previewTitle}
                              footer={null}
                              className="avatar-uploader"
                              onCancel={this.handleCancel}
                            >
                              <img
                                alt="example"
                                style={{ width: '100%' }}
                                src={previewImage}
                              />
                            </Modal>
                          </>
                        </div>

                        <div className={styles.form_right}>
                          <div className={styles.form_details_top}>
                            <Input
                              readOnly={index == 0 ? false : true}
                              value={index == 0 ? this.state.val1 : item.title}
                              className={styles.form_details_title}
                              placeholder="容量"
                              onChange={e => {
                                this.setState({ val1: e.target.value });
                              }}
                            />
                            <Button
                              type="primary"
                              disabled={index == 0 ? false : true}
                              onClick={this.detailAdd}
                              className={styles.form_bottom1}
                            >
                              添加
                            </Button>
                            <Button
                              type="primary"
                              onClick={this.detailRemove}
                              className={styles.form_bottom2}
                              danger
                              disabled={index == 0 ? false : true}
                            >
                              删除
                            </Button>
                          </div>
                          <Input
                            readOnly={index == 0 ? false : true}
                            value={index == 0 ? this.state.val2 : item.info}
                            className={styles.form_details_input}
                            placeholder="稳定高容量,有多种容量可选"
                            onChange={e => {
                              this.setState({ val2: e.target.value });
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </Panel>
              </Collapse>
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
          </Form>
        </Modal>
        {this.state.ids && (
          <Modal
            title="编辑"
            visible={this.state.visible1}
            onOk={this.handleSubmits}
            onCancel={this.readactCancel}
            destroyOnClose
          >
            <Form
              className={styles.ant_form}
              {...layout}
              ref={this.formRef}
              name="control-hooks"
            >
              <Form.Item
                name="product_type_id"
                initialValue={
                  this.state.ids.type.id == 1
                    ? '分布式存储服务器'
                    : this.state.ids.type.id == 2
                    ? 'FIL集群管理软件'
                    : this.state.ids.type.id == 3
                    ? 'MineOS存储管理软件'
                    : this.state.ids.type.id == 4
                    ? '数据封装服务'
                    : this.state.ids.type.id == 5
                    ? '设备托管服务'
                    : ''
                }
                label="商品名称"
                className={styles.form_item}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select onChange={this.onSelect} disabled>
                  {this.state.editdata > 0
                    ? this.state.editdata.map(item => {
                        return (
                          <Option key={item.id}>
                            {item.product_type_name}
                          </Option>
                        );
                      })
                    : null}
                </Select>
              </Form.Item>
              <Form.Item
                className={styles.form_item}
                name="specs"
                style={{ display: this.state.keyg == 5 ? 'none' : '' }}
                initialValue={this.state.ids.specs}
                label="规格型号"
              >
                <Input />
              </Form.Item>
              <Form.Item
                className={styles.form_item}
                name="price"
                label="单价/台"
                initialValue={this.state.ids.price}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              {this.state.keyg == 1 ||
              this.state.keyg == 5 ||
              this.state.keyg == 0 ? null : (
                <Form.Item
                  className={styles.form_item}
                  // style={{ display: this.state.keyg == 1 ? 'none' : this.state.keyg == 5 ? 'none' : this.state.keyg == 0 ? 'none' : 'block' }}
                  name="lowest_num"
                  label="最低起购/T"
                  initialValue={this.state.ids.lowest_num}
                >
                  <Input />
                </Form.Item>
              )}

              <Form.Item
                className={styles.form_item}
                name="introduction"
                label="简介"
                initialValue={this.state.ids.introduction}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input className={styles.form_input} />
              </Form.Item>
              <Form.Item
                className={styles.form_item}
                name="details"
                label="详情"
              >
                <Collapse>
                  <Panel header={this.state.ids.type.product_type_name}>
                    {this.state.ids.info.map((item, index) => {
                      return (
                        <div className={styles.form_details}>
                          <div className={styles.details}>
                            <>
                              <Upload limit={1}></Upload>
                              <Modal
                                visible={previewVisible}
                                title={previewTitle}
                                footer={null}
                                className="avatar-uploader"
                                onCancel={this.handleCancel}
                              >
                                <img
                                  alt="example"
                                  style={{ width: '100%' }}
                                  src={previewImage}
                                />
                              </Modal>
                            </>
                          </div>
                          <div className={styles.form_right}>
                            <div className={styles.form_details_top}>
                              <Input
                                // readOnly={index == 0 ? false : true}
                                // index == 0 ? this.state.val4 :
                                value={item.title}
                                onChange={e => {
                                  this.setState({ val4: e.target.value });
                                }}
                                className={styles.form_details_title}
                                placeholder="容量"
                              />
                              <Button
                                onClick={this.redactAdd}
                                disabled
                                type="primary"
                                className={styles.form_bottom1}
                              >
                                修改
                              </Button>
                              <Button
                                type="primary"
                                // disabled={index == 0 ? false : true}
                                className={styles.form_bottom2}
                                onClick={this.redactRemove}
                                danger
                              >
                                删除
                              </Button>
                            </div>
                            <Input
                              // index == 0 ? this.state.val5 :
                              value={item.info}
                              onChange={e => {
                                this.setState({ val5: e.target.value });
                              }}
                              // readOnly={index == 0 ? false : true}
                              className={styles.form_details_input}
                              placeholder="稳定高容量,有多种容量可选"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </Panel>
                </Collapse>
              </Form.Item>
              <Form.Item
                className={styles.form_item}
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
