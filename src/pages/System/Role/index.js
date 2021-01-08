import React, { Component } from 'react';
import { Drawer, Button, Tree, Switch, Tag, Checkbox } from 'antd';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import EditModal from '@/components/EditModal';

class Page extends Component {
  state = {
    visible: false,
    visibleDrawer: false,
    visibleDrawer2: false,
    page: 1,
    count: 10,
    treeData: [],
    checkedKeys: [],
    sys_role_id: null,
    operatesList: [],
    operatesCheck: [],
  };

  columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      editable: true,
      required: true,
    },
    {
      title: '是否启用',
      dataIndex: 'is_enable',
      editable: true,
      required: true,
      valuePropName: 'checked',
      render(text) {
        return (
          <div>
            {
              [<Tag color="black">关闭</Tag>, <Tag color="green">开启</Tag>][
                text
              ]
            }
          </div>
        );
      },
      custom() {
        return <Switch checkedChildren="开启" unCheckedChildren="关闭" />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '操作',
      operation: true,
      showEdit: true,
      showDelete: true,
      width: 60,
      fixed: 'right',
      actions() {
        return ['授权页面', '授权操作'];
      },
    },
  ];

  modelColumns = [
    {
      title: '角色名称',
      key: 'name',
      required: true,
    },
    {
      title: '是否启用',
      key: 'is_enable',
      valuePropName: 'checked',
      value: true,
      custom() {
        return <Switch checkedChildren="开启" unCheckedChildren="关闭" />;
      },
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.dispatch({
      type: 'sysrole/queryList',
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
    this.props
      .dispatch({
        type: 'sysrole/add',
        payload: values,
      })
      .then(data => {
        if (data != 'error') {
          this.loadData();
          this.handleClose();
        }
      });
  };

  handleSave = (row, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysrole/update',
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
        type: 'sysrole/update',
        payload: { id: id, deleted: 1 },
      })
      .then(data => {
        if (data != 'error') {
          this.loadData();
        }
      });
  };

  handleActions = (row, index) => {
    this.setState({ sys_role_id: row.id });
    if (index == 0) {
      this.props
        .dispatch({
          type: 'sysrole/queryRoleTree',
          payload: { sys_role_id: row.id },
        })
        .then(data => {
          if (data != 'error' && data) {
            var modules = [];
            if (data.modules) {
              data.modules.map(row => {
                modules.push(row.sys_module_id);
              });
            }
            this.setState({
              visibleDrawer: true,
              treeData: this.createChildNode(data.tree),
              checkedKeys: modules,
            });
          }
        });
    } else if (index == 1) {
      this.props
        .dispatch({
          type: 'sysrole/queryRoleOperate',
          payload: { sys_role_id: row.id },
        })
        .then(data => {
          if (data != 'error' && data) {
            var operatesList = [];
            if (data.operatesList) {
              data.operatesList.map(row => {
                operatesList.push({
                  label: row.name,
                  value: row.id,
                  disabled: !row.is_enable,
                });
              });
            }
            var operates = [];
            if (data.userOperate) {
              data.userOperate.map(row => {
                operates.push(row.sys_operate_id);
              });
            }
            this.setState({
              visibleDrawer2: true,
              operatesList: operatesList,
              operatesCheck: operates,
            });
          }
        });
    }
  };

  handleSubmitAuth = () => {
    const { sys_role_id, checkedKeys } = this.state;
    this.props
      .dispatch({
        type: 'sysRoleModule/edit',
        payload: { sys_role_id: sys_role_id, modules: checkedKeys.checked },
      })
      .then(data => {
        if (data != 'error') {
          this.handleCloseDrawer();
        }
      });
  };

  handleSubmitOperates = () => {
    const { sys_role_id, operatesCheck } = this.state;
    this.props
      .dispatch({
        type: 'sysRoleOperate/edit',
        payload: { sys_role_id: sys_role_id, operates: operatesCheck },
      })
      .then(data => {
        if (data != 'error') {
          this.handleCloseDrawer();
        }
      });
  };

  handleCloseDrawer = () => {
    this.setState({
      visibleDrawer: false,
      visibleDrawer2: false,
      treeData: null,
      checkedKeys: [],
      sys_role_id: null,
      operatesList: [],
      operatesCheck: [],
    });
  };

  onTreeCheck = checkedKeys => {
    this.setState({ checkedKeys: checkedKeys });
  };

  createChildNode = datas => {
    var treeData = [];
    datas &&
      datas.map(row => {
        var tree = {
          title: row.name,
          key: row.id,
          disabled: !row.is_enable,
        };
        if (row.children) {
          tree.children = this.createChildNode(row.children);
        }
        treeData.push(tree);
      });
    return treeData;
  };

  onOperatesCheck = checks => {
    this.setState({ operatesCheck: checks });
  };

  render() {
    const {
      visible,
      visibleDrawer,
      visibleDrawer2,
      treeData,
      checkedKeys,
      operatesList,
      operatesCheck,
    } = this.state;
    const { data, listLoading, addLoading, updateLoading } = this.props;

    return (
      <div>
        <OperationGroup onAdd={() => this.setState({ visible: true })} />
        <EditableTable
          columns={this.columns}
          dataSource={data.data}
          total={data.total}
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

        <Drawer
          title="角色权限配置"
          placement="right"
          closable={false}
          onClose={this.handleCloseDrawer}
          visible={visibleDrawer}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button
                onClick={this.handleCloseDrawer}
                style={{ marginRight: 8 }}
              >
                取消
              </Button>
              <Button type="primary" onClick={() => this.handleSubmitAuth()}>
                提交
              </Button>
            </div>
          }
        >
          <Tree
            checkable
            checkStrictly
            checkedKeys={checkedKeys}
            treeData={treeData}
            onCheck={this.onTreeCheck}
          />
        </Drawer>

        <Drawer
          title="角色操作权限配置"
          placement="right"
          closable={false}
          onClose={this.handleCloseDrawer}
          visible={visibleDrawer2}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button
                onClick={this.handleCloseDrawer}
                style={{ marginRight: 8 }}
              >
                取消
              </Button>
              <Button
                type="primary"
                onClick={() => this.handleSubmitOperates()}
              >
                提交
              </Button>
            </div>
          }
        >
          <Checkbox.Group
            style={{ display: 'flex', flexDirection: 'column' }}
            options={operatesList}
            value={operatesCheck}
            onChange={this.onOperatesCheck}
          />
        </Drawer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.sysrole.list,
    listLoading:
      state.loading.effects['sysrole/queryList'] ||
      state.loading.effects['sysrole/queryRoleTree'] ||
      state.loading.effects['sysrole/queryRoleOperate'],
    addLoading: state.loading.effects['sysrole/add'],
    updateLoading: state.loading.effects['sysrole/update'],
  };
}

export default connect(mapStateToProps)(Page);
