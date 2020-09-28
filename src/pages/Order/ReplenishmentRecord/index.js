import React, { Component } from 'react';
import { Form, Button, InputNumber, Tag, Modal, Select, Upload as AntUpload, message } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import EditModal from '@/components/EditModal';
import Upload from '@/components/Upload';
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
    search: null,
  };
  formRef = React.createRef();

  columns = [
    {
      title: '补单号',
      dataIndex: 'pid',
    }, {
      title: '账号',
      dataIndex: 'account',
    }, {
      title: '补单类型',
      dataIndex: 'oper_type',
      editable: true,
      required: true,
      render(text) {
        switch (text) {
          case 1:
            name = '矿机租赁';
            break;
          case 6:
            name = '活动奖励';
            break;
          case 7:
            name = '矿机托管';
            break;
          case 8:
            name = '推广奖励';
            break;
        }
        return name;
      },
      custom() {
        return (
          <Select placeholder="请选择">
            <Option value={1}>矿机租赁</Option>
            <Option value={7}>矿机托管</Option>
            <Option value={6}>活动奖励</Option>
            <Option value={8}>推广奖励</Option>
          </Select>
        )
      },
    }, {
      title: '是否保底',
      dataIndex: 'service_charge_rate',
      editable: true,
      required: true,
      render(text) {
        return (
          <div>{text == 0.2 ? <Tag color="green">不保底</Tag> : <Tag color="red">保底</Tag>}</div>
        );
      },
      custom() {
        return (
          <Select>
            <Option value='0.2000'>不保底</Option>
            <Option value='0.1490'>保底</Option>
          </Select>
        )
      },
    }, {
      title: '算力(TB)',
      dataIndex: 'hashrate',
      editable: true,
      required: true,
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
      custom() {
        return (
          <InputNumber min={0} />
        )
      },
    }, {
      title: '金额',
      dataIndex: 'amount',
      editable: true,
      required: true,
      render: (text) => (
        <div>{parseFloat(text)}</div>
      ),
      custom() {
        return (
          <InputNumber min={0} />
        )
      },
    }, {
      title: '金额单位',
      dataIndex: 'asset',
      editable: true,
      required: true,
      custom() {
        return (
          <Select placeholder="请选择">
            <Option value='USDT'>USDT</Option>
            <Option value='BTC'>BTC</Option>
            <Option value='ETH'>ETH</Option>
            <Option value='FIL'>FIL</Option>
            <Option value='RMB'>RMB</Option>
          </Select>
        )
      },
    }, {
      title: '状态',
      dataIndex: 'status',
      editable: true,
      required: true,
      render(text) {
        return (
          <div>{[<Tag color="blue">待审核</Tag>, <Tag color="green">通过</Tag>, <Tag color="black">拒绝</Tag>][text]}</div>
        );
      },
      custom() {
        return (
          <Select placeholder="请选择">
            <Option value={0} disabled>待审核</Option>
            <Option value={1} disabled>通过</Option>
            <Option value={2}>拒绝</Option>
          </Select>
        )
      },
    }, {
      title: '创建人',
      dataIndex: 'add_sys_user_name',
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
    }, {
      title: '审核人',
      dataIndex: 'sys_user_name',
    }, {
      title: '审核时间',
      dataIndex: 'oper_time',
    }, {
      title: '客户姓名',
      dataIndex: 'customer_name',
      editable: true,
    }, {
      title: '代理商',
      dataIndex: 'agent',
      editable: true,
    }, {
      title: '备注',
      dataIndex: 'remark',
      editable: true,
    }, {
      title: '图片',
      dataIndex: 'images',
      render(text) {
        return (
          <a href={text} target='view_window'><img src={text} width={60} alt='' /></a>
        );
      },
    }, {
      title: '操作',
      operation: true,
      showEdit: true,
      width: 60,
      fixed: 'right',
      actions(record) {
        return record.status == 0 ? ['审核'] : [];
      },
    },
  ];

  modelColumns = (active) => [
    {
      title: '用户账号',
      key: 'account',
      required: true,
    }, {
      title: '补单类型',
      key: 'oper_type',
      required: true,
      custom() {
        return (
          <Select>
            <Option value={1}>矿机租赁</Option>
            <Option value={7}>矿机托管</Option>
            <Option value={6}>活动奖励</Option>
            <Option value={8}>推广奖励</Option>
          </Select>
        )
      }
    }, {
      title: '是否保底',
      key: 'service_charge_rate',
      required: true,
      custom() {
        return (
          <Select>
            <Option value={0.2}>不保底</Option>
            <Option value={0.149}>保底</Option>
          </Select>
        )
      },
    }, {
      title: '算力(TB)',
      key: 'hashrate',
      required: true,
      custom() {
        return (<InputNumber style={{ width: '100%' }} min={0} />)
      }
    }, {
      title: '金额',
      key: 'amount',
      required: true,
      custom() {
        return (<InputNumber style={{ width: '100%' }} min={0} />)
      }
    }, {
      title: '金额单位',
      key: 'asset',
      required: true,
      custom() {
        return (
          <Select>
            <Option value='USDT'>USDT</Option>
            <Option value='BTC'>BTC</Option>
            <Option value='ETH'>ETH</Option>
            <Option value='FIL'>FIL</Option>
            <Option value='RMB'>RMB</Option>
          </Select>
        )
      }
    }, {
      title: '产品',
      key: 'goods_id',
      custom() {
        return (
          <Select>
            {active && active.map((row) =>
              <Option value={row.id} key={row.id}>{row.name}</Option>
            )}
          </Select>
        )
      }
    }, {
      title: '客户姓名',
      key: 'customer_name',
    }, {
      title: '代理商',
      key: 'agent',
    }, {
      title: '备注',
      key: 'remark',
    }, {
      title: '图片',
      key: 'images',
      custom() {
        return (
          <Upload />
        )
      }
    },
  ]

  componentDidMount() {
    this.loadData();
    this.props.dispatch({
      type: 'goods/queryActive',
    });
  }

  loadData = () => {
    const { page, count, search } = this.state;
    this.props.dispatch({
      type: 'replenishmentRecord/queryList',
      payload: {
        page: page,
        count: count,
        search: search,
      }
    });
  };

  handleClose = () => {
    this.setState({ visible: false })
  }

  handleSave = (row, id) => {
    this.props.dispatch({
      type: 'replenishmentRecord/update',
      payload: { id: id, ...row },
    }).then((data) => {
      if (data != 'error') {
        this.loadData();
      }
    });
  }

  handleActions = (row, index) => {
    if (index == 0) {
      Modal.confirm({
        title: '审核',
        content: (
          <div>
            账号：{row.account}<br />
            创建人：{row.add_sys_user_name}<br /><br />
            <Form ref={this.formRef}>
              <FormItem
                label='审核'
                name='status'
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
        onOk: (() => {
          return new Promise((resolve, reject) => {
            this.formRef.current.validateFields().then(values => {
              this.props.dispatch({
                type: 'replenishmentRecord/update',
                payload: {
                  id: row.id,
                  ...
                  values
                },
              }).then((data) => {
                if (data != 'error') {
                  resolve()
                  this.loadData();

                } else {
                  reject()
                }
              })
            }).catch(() => reject());
          })
        }),
      });
    }
  }

  handleSubmit = (values) => {
    this.props.dispatch({
      type: 'replenishmentRecord/add',
      payload: values,
    }).then((data) => {
      if (data != 'error') {
        this.loadData();
        this.handleClose()
      }
    });
  };

  handleUpload = (info) => {

  }

  render() {
    const { visible, page, count, search } = this.state;
    const { data, active, listLoading, addLoading, updateLoading } = this.props;

    return (
      <div>
        <SearchGroup onSearch={(e) => {
          this.state.page = 1;
          this.state.search = e;
          this.loadData();
        }} items={
          [{ label: '补单号', name: 'pid' },
          { label: '账号', name: 'account' },
          {
            label: '补单类型', name: 'oper_type',
            custom: (
              <Select>
                <Option value={1}>矿机租赁</Option>
                <Option value={7}>矿机托管</Option>
                <Option value={6}>活动奖励</Option>
                <Option value={8}>推广奖励</Option>
              </Select>
            )
          },
          {
            label: '状态', name: 'status',
            custom: (
              <Select>
                <Option value={0}>待审核</Option>
                <Option value={1}>通过</Option>
                <Option value={2}>拒绝</Option>
              </Select>
            )
          }]
        } />
        <div className={styles.btnGroup}>
          <OperationGroup
            onAdd={() => this.setState({ visible: true })}
            onExport={(all) => {
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
                      name='file'
                      action='/public/?s=Portal.ReplenishmentRecord.Import'
                      onChange={(info) => {
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
                                  {res.data.error != 0 && <a href={res.data.path} download='失败补单.xlsx'>查看失败结果</a>}
                                </div>
                              ),
                              okText: '确认',
                            });
                          }
                          console.log(info.file.response)
                        } else if (status === 'error') {
                          message.error('上传失败');
                        }
                      }}
                    >
                      <InboxOutlined className={styles.icon} />
                      <p>选择或拖拽Excel文件到此区域上传</p>
                    </Dragger>
                    <a href='/public/replenishment.xlsx' download='补单模板.xlsx'>
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
          dataSource={data ? data.list : []}
          total={data ? data.total : 0}
          current={data ? data.current : 0}
          loading={listLoading || updateLoading}
          onChange={(pagination) => {
            this.state.page = pagination.current;
            this.state.count = pagination.pageSize;
            this.loadData()
          }}
          onSave={this.handleSave}
          onActions={this.handleActions}
          rowKey="id"
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    data: state.replenishmentRecord.list,
    active: state.goods.active,
    listLoading: state.loading.effects['replenishmentRecord/queryList'],
    addLoading: state.loading.effects['replenishmentRecord/add'],
    updateLoading: state.loading.effects['replenishmentRecord/update'],
  };
}

export default connect(mapStateToProps)(Page);