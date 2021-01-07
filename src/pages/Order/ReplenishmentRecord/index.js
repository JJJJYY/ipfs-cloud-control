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
  Upload as AntUpload,
  message,
  DatePicker,
} from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import EditModal from '@/components/EditModal';
import SearchGroup from '@/components/SearchGroup';
import styles from './index.less';
const FormItem = Form.Item;
const Option = Select.Option;
const { Dragger } = AntUpload;

class Page extends Component {
  state = {
    visible: false,
    visibleDrawer: false,
    page: 1,
    count: 10,
    user: '',
    status: '',
    search: null,
    product_name: '',
    order_code: '',
    price: '',
    amount: '',
    remark: '',
    discount: '',
    selectedRowKeys: [],
  };
  formRef = React.createRef();

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
      title: '商品名称',
      dataIndex: 'group',
      render: text => <div>{text.product_group_name}</div>,
    },
    {
      title: '数量(TB)',
      dataIndex: 'num',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber min={0} />;
      },
    },
    {
      title: '技术服务费',
      dataIndex: 'service_fee',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber min={0.0} step={0.1} />;
      },
    },
    {
      title: '折扣',
      dataIndex: 'discount',
      editable: true,
      required: true,
      render: text => <div>{parseFloat(text)}</div>,
      custom() {
        return <InputNumber min={0.1} max={1} step={0.1} />;
      },
    },
    {
      title: '订单金额',
      dataIndex: 'total_amount',
      editable: false,
      required: false,
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
      custom() {
        return (
          <Select placeholder="请选择">
            <Option value={0}>待审核</Option>
            <Option value={1}>已通过</Option>
            <Option value={2}>已拒绝</Option>
          </Select>
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'user',
      render: text => <div>{text.user_name}</div>,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
    },
    {
      title: '审核人',
      dataIndex: 'audit_user',
    },
    {
      title: '审核时间',
      dataIndex: 'audit_time',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      operation: true,
      showEdit: true,
      width: 60,
      fixed: 'right',
      statusShow(e) {
        // 隐藏
        let show = e.audit_status == 2;
        return show;
      },
      actions(record) {
        return record.audit_status == 0
          ? ['审核']
          : [''] || record.audit_status == 2
          ? ['']
          : [''];
      },
    },
  ];

  modelColumns = active => [
    {
      title: '用户账号',
      key: 'username',
      required: true,
      custom() {
        return (
          <Input
            allowClear
            style={{ width: '100%' }}
            placeholder="请输入用户手机/邮箱账号"
          />
        );
      },
    },
    {
      title: '商品名称',
      key: 'product_group_id',
      custom() {
        return (
          <Select>
            {active &&
              active.map(row => (
                <Option value={row.id} key={row.id}>
                  {row.product_group_name}
                </Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: '数量(TB)',
      key: 'num',
      required: true,
      custom() {
        return (
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入正数"
            step={0}
          />
        );
      },
    },
    {
      title: '折扣',
      key: 'discount',
      required: true,
      custom() {
        return (
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            step={0.1}
            placeholder="最多可输入小数位后两位,仅可输入正数"
          />
        );
      },
    },
    {
      title: '技术服务费',
      key: 'service_fee',
      required: true,
      custom() {
        return (
          <InputNumber
            style={{ width: '100%' }}
            placeholder="最多可输入小数位后两位,仅可输入正数"
            min={0}
            step={0.1}
          />
        );
      },
    },
    {
      title: '订单金额',
      key: 'amount',
      custom() {
        return (
          <Input
            disabled
            style={{ width: '100%' }}
            placeholder="系统自动计算金额"
            value={1}
          />
        );
      },
    },
    {
      title: '备注',
      key: 'remark',
    },
  ];

  componentDidMount() {
    this.loadData();
    this.asdda();
  }

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
            price: res[0].amount,
          },
          () => {},
        );
      });
  };
  handleClose = () => {
    this.setState({ visible: false });
  };

  handleSave = (row, id) => {
    this.props
      .dispatch({
        type: 'replenishmentRecord/update',
        payload: { id: id, ...row },
      })

      .then(data => {
        console.log(data);
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
  handleActions = (row, index) => {
    console.log(row);
    if (index == 0) {
      Modal.confirm({
        title: '审核',
        content: (
          <div>
            <div>
              <div
                style={{
                  width: '300px',
                  height: '30px',
                  lineHeight: '30px',
                  background: '#EAE8E8',
                }}
              >
                {' '}
                <div style={{ float: 'left' }}>订单编号:</div>{' '}
                <div style={{ float: 'left', marginLeft: '5px' }}>
                  {row.order_code}
                </div>{' '}
              </div>
              <div
                style={{
                  width: '300px',
                  height: '100px',
                  lineHeight: '30px',
                  border: '1px solid #EFEDED',
                  marginBottom: '24px',
                }}
              >
                <div>账号：{row.user.user_name}</div>
                <div>商品名称: {row.group.product_group_name} </div>
                <div>订单金额: {row.total_amount} </div>
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
            <div>
              <div
                style={{ float: 'left', height: '60px', lineHeight: '60px' }}
              >
                备注:
              </div>
              <div style={{ float: 'left', marginLeft: '8px' }}>
                <Input
                  allowClear
                  onChange={event => this.handleMaxBackUp(event)}
                  defaultValue=""
                  style={{ width: '260px', height: '60px' }}
                />
              </div>
            </div>
          </div>
        ),
        onOk: () => {
          const { remark } = this.state;
          console.log(remark);
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
    }
  };

  handleSubmit = values => {
    this.props
      .dispatch({
        type: 'replenishmentRecord/add',
        payload: values,
      })
      .then(data => {
        if (data != 'error') {
          this.loadData();
          this.handleClose();
        }
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
        console.log(this.stater.remark);
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
  render() {
    const { visible, page, count, search, selectedRowKeys } = this.state;
    const { data, active, listLoading, addLoading, updateLoading } = this.props;
    console.log(addLoading);

    const rowSelection =
      search && search.status == 0
        ? {
            selectedRowKeys,
            onSelect: this.onSelectChange,
          }
        : null;

    return (
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
              label: '状态',
              name: 'audit_status',
              custom: (
                <Select>
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
                          console.log(info.file.response);
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
        <EditModal
          visible={visible}
          width={630}
          onOk={this.handleSubmit}
          onCancel={this.handleClose}
          confirmLoading={addLoading}
          columns={this.modelColumns(active)}
        />

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
          onSave={this.handleSave}
          onActions={this.handleActions}
          rowKey="id"
          rowSelection={rowSelection}
        />
      </div>
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
