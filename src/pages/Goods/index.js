import 'braft-editor/dist/index.css';
import React, { Component } from 'react';
import {
  Select,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Tag,
  Button,
  Collapse,
  Radio,
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
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
      dataIndex: 'name',
    },
    {
      title: '简介',
      dataIndex: 'slogan',
    },
    {
      title: '售价',
      dataIndex: 'price',
      render: text => <div>{parseFloat(text)}</div>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(text) {
        switch (text) {
          case 2:
            return <Tag color="green">上架</Tag>;
          case 1:
            return <Tag color="blue">下架</Tag>;
        }
      },
    },
    {
      title: '操作',
      operation: true,
      showDelete: true,
      width: 60,
      fixed: 'right',
      actions() {
        return ['编辑'];
      },
    },
  ];

  componentDidMount() {
    this.loadData();
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
  handleAction = () => {
    //编辑
    this.setState({
      visible1: true,
    });
  };
  handleActions = (row, index) => {
    // 添加
    if (index == 0) {
      this.props
        .dispatch({
          type: 'goods/get',
          payload: { id: row.id },
        })
        .then(data => {
          if (data != 'error') {
            this.setState({
              editdata: data,
              visible: true,
            });
            this.formRef.current &&
              this.formRef.current.setFieldsValue({
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
          }
        });
    }
  };

  handleClose = () => {
    this.setState({ visible: false, editdata: null });
  };

  handleSubmit = () => {
    this.formRef.current.validateFields().then(row => {
      if (row.contract_details)
        row.contract_details = row.contract_details.toHTML();
      if (row.start_time)
        row.start_time = row.start_time.format('YYYY-MM-DD HH:mm:ss');
      let isAdd = this.state.editdata == null;
      if (!isAdd) {
        row.id = this.state.editdata.id;
      }
      this.props
        .dispatch({
          type: isAdd ? 'goods/add' : 'goods/update',
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
  redactSubmit = () => {
    this.formRef1.current.validateFields();
  };
  readactCancel = () => {
    this.setState({
      visible1: false,
    });
  };

  handleDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/update',
      payload: { id: id, deleted: 1 },
    }).then(data => {
      if (data != 'error') {
        this.loadData();
      }
    });
  };
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
  render() {
    const App = () => {
      const [value, setValue] = React.useState(1);

      const onChange = e => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
      };
    };
    const { previewVisible, previewImage, previewTitle } = this.state;
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

      const onGenderChange = value => {
        console.log(value);
      };
    };
    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

    const text = `
    分布式储存服务器
`;

    return (
      <div className="goods">
        <OperationGroup onAdd={() => this.setState({ visible: true })} />
        <EditableTable
          columns={this.columns}
          dataSource={data ? data.list : []}
          total={data ? data.total : 0}
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
          width={800}
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.handleClose}
          confirmLoading={addLoading || updateLoading}
          destroyOnClose
        >
          <Form layout="vertical" ref={this.formRef}>
            <Form.Item
              className={styles.formItem}
              label="算力名称（中文）"
              name="name"
              rules={[{ required: true }]}
            >
              <Input maxLength={100} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="算力名称（英文）"
              name="en_name"
              rules={[{ required: true }]}
            >
              <Input maxLength={100} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="算力简介（中文）"
              name="slogan"
              rules={[{ required: true }]}
            >
              <Input maxLength={100} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="算力简介（英文）"
              name="en_slogan"
              rules={[{ required: true }]}
            >
              <Input maxLength={100} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="算力标签（中文）"
              name="tag"
              rules={[{ required: true }]}
            >
              <Input maxLength={10} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="算力标签（英文）"
              name="en_tag"
              rules={[{ required: true }]}
            >
              <Input maxLength={10} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="算力属性（中文）"
              name="highlight"
            >
              <Input maxLength={10} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="算力属性（英文）"
              name="en_highlight"
            >
              <Input maxLength={10} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="挖矿币种"
              name="weight_asset"
            >
              <Select>
                <Option value="Filecoin">Filecoin</Option>
              </Select>
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="技术服务费"
              name="service_charge_rate"
            >
              <InputNumber style={{ width: '100%' }} min={0} mac={1} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="合约开售时间"
              name="start_time"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="合约周期（天）"
              name="contract_duration"
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="结算周期"
              name="settlement_period"
            >
              <Input maxLength={100} />
            </Form.Item>

            <Form.Item className={styles.formItem} label="权重" name="weight">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="算力单价（美元）"
              name="price"
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="总份量（每份1TB）"
              name="quantity"
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="剩余份量（每份1TB）"
              name="remaining_quantity"
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="每次最小售卖份量（每份1TB）"
              name="min_limit"
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="算力详情"
              name="contract_details"
            >
              <Editor placeholder="内容" onChange={this.handleChange} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="发布状态"
              name="status"
            >
              <Select>
                <Option value={1}>进行中</Option>
                <Option value={2}>未开始</Option>
                <Option value={3}>已结束</Option>
                <Option value={99}>未发布</Option>
                <Option value={1000}>奖励商品/不在前端展示</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="编辑"
          visible={this.state.visible1}
          onOk={this.redactSubmit}
          onCancel={this.readactCancel}
        >
          <Form
            className={styles.ant_form}
            {...layout}
            ref={this.formRef1}
            name="control-hooks"
          >
            <Form.Item
              name="gender"
              label="商品名称"
              placeholder="分布式储存服务器"
              className={styles.form_item}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select onChange={this.onGenderChange} allowClear>
                <Option value="product_type_id==1">分布式储存服务器</Option>
                <Option value="product_type_id==2">FIL集群管理软件</Option>
                <Option value="product_type_id==3">Mineos储存管理软件</Option>
                <Option value="product_type_id==4">数据封存服务</Option>
                <Option value="product_type_id==5">设备托管服务</Option>
              </Select>
            </Form.Item>
            <Form.Item
              className={styles.form_item}
              name="specs"
              label="规格型号"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className={styles.form_item}
              name="price"
              label="单价/台"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className={styles.form_item}
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
            <Form.Item className={styles.form_item} name="details" label="详情">
              <Collapse className={styles.form_Collapse}>
                <Panel header="分布式储存服务器" key="1">
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
                          className={styles.form_details_title}
                          placeholder="容量"
                        />
                        <Button type="primary" className={styles.form_bottom1}>
                          添加
                        </Button>
                        <Button
                          type="primary"
                          className={styles.form_bottom2}
                          danger
                        >
                          删除
                        </Button>
                      </div>
                      <Input
                        className={styles.form_details_input}
                        placeholder="稳定高容量,有多种容量可选"
                      />
                    </div>
                  </div>
                </Panel>
              </Collapse>
            </Form.Item>
            <Form.Item
              className={styles.form_item}
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
