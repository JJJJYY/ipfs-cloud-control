import React, { Component } from 'react';
import { Form, Input, Switch, Tag, Modal, Select } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import EditModal from '@/components/EditModal';
import crypto from 'crypto';

const Option = Select.Option;

class Page extends Component {
  state = {
    visible: false,
    page: 1,
    count: 10,
  };
  formRef = React.createRef();

  columns = [
    {
      title: '用户账号',
      dataIndex: 'account',
    },
    {
      title: '用户名称',
      dataIndex: 'username',
      editable: true,
      required: true,
    },
    {
      title: '状态',
      dataIndex: 'is_enable',
      editable: true,
      required: true,
      valuePropName: 'checked',
      render(text) {
        return (
          <div>
            {
              [<Tag color="#000">冻结</Tag>, <Tag color="green">正常</Tag>][
                text
              ]
            }
          </div>
        );
      },
      custom() {
        return <Switch checkedChildren="正常" unCheckedChildren="冻结" />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
    },
    {
      title: '操作',
      operation: true,
      showEdit: true,
      showDelete: true,
      width: 60,
      fixed: 'right',
      actions() {
        return ['修改密码', '角色'];
      },
    },
  ];

  modelColumns = [
    {
      title: '用户账号',
      key: 'account',
      required: true,
    },
    {
      title: '用户名称',
      key: 'username',
      required: true,
    },
    {
      title: '密码',
      key: 'password',
      required: true,
      custom() {
        return <Input.Password placeholder="密码" />;
      },
    },
    {
      title: '状态',
      key: 'is_enable',
      valuePropName: 'checked',
      value: true,
      custom() {
        return <Switch checkedChildren="正常" unCheckedChildren="冻结" />;
      },
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.dispatch({
      type: 'sysuser/queryList',
      payload: {
        page: this.state.page,
        count: this.state.count,
      },
    });
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  handleSubmit = values => {
    values.password = crypto
      .createHash('md5')
      .update(values.password)
      .digest('hex');
    this.props
      .dispatch({
        type: 'sysuser/add',
        payload: values,
      })
      .then(data => {
        console.log(data);
        if (data != 'error') {
          this.loadData();
          this.handleClose();
        }
      });
  };

  handleSave = (row, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysuser/update',
      payload: { id: id, ...row },
    }).then(data => {
      if (data != 'error') {
        this.loadData();
      }
    });
  };

  handleDel = id => {
    this.props
      .dispatch({
        type: 'sysuser/update',
        payload: { id: id, deleted: 1 },
      })
      .then(data => {
        if (data != 'error') {
          this.loadData();
        }
      });
  };

  handleActions = (row, index) => {
    if (index == 0) {
      Modal.confirm({
        title: '修改密码',
        content: (
          <div>
            用户：{row.username}
            <br />
            <br />
            <Form ref={this.formRef}>
              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: `密码` }]}
              >
                <Input.Password placeholder="密码" />
              </Form.Item>
            </Form>
          </div>
        ),
        onOk: () => {
          return new Promise((resolve, reject) => {
            this.formRef.current
              .validateFields()
              .then(values => {
                values.password = crypto
                  .createHash('md5')
                  .update(values.password)
                  .digest('hex');
                this.props
                  .dispatch({
                    type: 'sysuser/update',
                    payload: { id: row.id, ...values },
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
      this.props
        .dispatch({
          type: 'sysuser/userRole',
          payload: { sys_user_id: row.id },
        })
        .then(data => {
          if (data != 'error') {
            Modal.confirm({
              title: '编辑用户角色',
              content: (
                <div>
                  用户：{row.username}
                  <br />
                  <br />
                  <Form ref={this.formRef}>
                    <Form.Item
                      label="角色"
                      name="sys_role_id"
                      initialValue={
                        data.userRole == null ? '' : data.userRole.sys_role_id
                      }
                      rules={[{ required: true, message: `请选择角色` }]}
                    >
                      <Select placeholder="请选择角色">
                        {data &&
                          data.roles.map(item => (
                            <Option
                              value={item.id}
                              key={item.id}
                              disabled={!item.is_enable}
                            >
                              {item.name}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
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
                          type: 'sysUserRole/add',
                          payload: { sys_user_id: row.id, ...values },
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
        });
    }
  };

  render() {
    const { visible } = this.state;
    const { data, listLoading, addLoading, updateLoading } = this.props;

    return (
      <div>
        <OperationGroup onAdd={() => this.setState({ visible: true })} />
        <EditableTable
          columns={this.columns}
          dataSource={data.data}
          total={data ? data.total : 0}
          loading={listLoading || updateLoading}
          onChange={pagination => {
            this.state.page = pagination.current;
            this.loadData();
          }}
          onSave={this.handleSave}
          onDelete={this.handleDel}
          onActions={this.handleActions}
          rowKey="id"
        />
        <EditModal
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.handleClose}
          confirmLoading={addLoading}
          columns={this.modelColumns}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.sysuser.list,
    listLoading:
      state.loading.effects['sysuser/queryList'] ||
      state.loading.effects['sysuser/userRole'],
    addLoading: state.loading.effects['sysuser/add'],
    updateLoading: state.loading.effects['sysuser/update'],
  };
}

export default connect(mapStateToProps)(Page);
