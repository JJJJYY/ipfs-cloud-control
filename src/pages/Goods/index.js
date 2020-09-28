import 'braft-editor/dist/index.css'
import React, { Component } from 'react';
import { Select, Modal, Form, Input, DatePicker, InputNumber, Tag } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import Editor from '@/components/Editor';
import moment from 'moment';
import styles from './index.less';

const Option = Select.Option;

class Page extends Component {
  state = {
    page: 1,
    count: 10,
    visible: false,
    editdata: null,
  };
  formRef = React.createRef();

  columns = [
    {
      title: '产品ID',
      dataIndex: 'id',
    }, {
      title: '算力名称',
      dataIndex: 'name',
    }, {
      title: '简介',
      dataIndex: 'slogan',
    }, {
      title: '标签',
      dataIndex: 'tag',
    }, {
      title: '属性',
      dataIndex: 'highlight',
    }, {
      title: '总份量',
      dataIndex: 'quantity',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '已售份量',
      dataIndex: 'id',
      render: (_, record) => (
        <div>{parseFloat(record.quantity) - parseFloat(record.remaining_quantity)}</div>
      ),
    }, {
      title: '剩余',
      dataIndex: 'remaining_quantity',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '售价',
      dataIndex: 'price',
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
    }, {
      title: '状态',
      dataIndex: 'status',
      render(text) {
        switch (text) {
          case 1:
            return <Tag color="green">进行中</Tag>
          case 2:
            return <Tag color="blue">未开始</Tag>
          case 3:
            return <Tag color="black">已结束</Tag>
          case 99:
            return <Tag color="black">未发布</Tag>
          case 1000:
            return <Tag color="black">奖励商品</Tag>
        }
        return <Tag color="black">其他</Tag>;
      }
    }, {
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
      }
    });
  };

  handleActions = (row, index) => {
    if (index == 0) {
      this.props.dispatch({
        type: 'goods/get',
        payload: { id: row.id },
      }).then((data) => {
        if (data != 'error') {
          this.setState({
            editdata: data,
            visible: true,
          })
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
          })
        }
      })
    }
  }

  handleClose = () => {
    this.setState({ visible: false, editdata: null })
  }

  handleSubmit = () => {
    this.formRef.current.validateFields().then(row => {
      if (row.contract_details) row.contract_details = row.contract_details.toHTML();
      if (row.start_time) row.start_time = row.start_time.format('YYYY-MM-DD HH:mm:ss');
      let isAdd = this.state.editdata == null;
      if (!isAdd) {
        row.id = this.state.editdata.id;
      }
      this.props.dispatch({
        type: isAdd ? 'goods/add' : 'goods/update',
        payload: row,
      }).then((data) => {
        if (data != 'error') {
          this.loadData();
          this.handleClose()
        }
      });
    })
  }

  handleDel = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/update',
      payload: { id: id, deleted: 1 },
    }).then((data) => {
      if (data != 'error') {
        this.loadData();
      }
    });
  }

  render() {
    const { visible } = this.state;
    const { data, listLoading, addLoading, updateLoading } = this.props;

    return (
      <div>
        <OperationGroup onAdd={() => this.setState({ visible: true })} />
        <EditableTable
          columns={this.columns}
          dataSource={data ? data.list : []}
          total={data ? data.total : 0}
          loading={listLoading || updateLoading}
          onChange={(pagination) => {
            this.state.page = pagination.current;
            this.state.count = pagination.pageSize;
            this.loadData()
          }}
          onDelete={this.handleDel}
          onActions={this.handleActions}
          rowKey="id"
        />
        <Modal
          title="添加"
          okText='提交'
          cancelText='取消'
          width={800}
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.handleClose}
          confirmLoading={addLoading || updateLoading}
          destroyOnClose
        >
          <Form layout='vertical' ref={this.formRef}>
            <Form.Item
              className={styles.formItem}
              label='算力名称（中文）'
              name='name'
              rules={[{ required: true }]}
            >
              <Input maxLength={100} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='算力名称（英文）'
              name='en_name'
              rules={[{ required: true }]}
            >
              <Input maxLength={100} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='算力简介（中文）'
              name='slogan'
              rules={[{ required: true }]}
            >
              <Input maxLength={100} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='算力简介（英文）'
              name='en_slogan'
              rules={[{ required: true }]}
            >
              <Input maxLength={100} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='算力标签（中文）'
              name='tag'
              rules={[{ required: true }]}
            >
              <Input maxLength={10} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='算力标签（英文）'
              name='en_tag'
              rules={[{ required: true }]}
            >
              <Input maxLength={10} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='算力属性（中文）'
              name='highlight'
            >
              <Input maxLength={10} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='算力属性（英文）'
              name='en_highlight'
            >
              <Input maxLength={10} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='挖矿币种'
              name='weight_asset'
            >
              <Select>
                <Option value='Filecoin'>Filecoin</Option>
              </Select>
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='技术服务费'
              name='service_charge_rate'
            >
              <InputNumber style={{ width: '100%' }} min={0} mac={1} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='合约开售时间'
              name='start_time'
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='合约周期（天）'
              name='contract_duration'
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='结算周期'
              name='settlement_period'
            >
              <Input maxLength={100} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='权重'
              name='weight'
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='算力单价（美元）'
              name='price'
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='总份量（每份1TB）'
              name='quantity'
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='剩余份量（每份1TB）'
              name='remaining_quantity'
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='每次最小售卖份量（每份1TB）'
              name='min_limit'
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='算力详情'
              name='contract_details'
            >
              <Editor placeholder='内容' onChange={this.handleChange} />
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label='发布状态'
              name='status'
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
      </div>
    )
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