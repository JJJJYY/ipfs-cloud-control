import React, { Component } from 'react';
import {
  TreeSelect,
  Modal,
  Form,
  Input,
  Radio,
  InputNumber,
  Switch,
  Tag,
} from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import { connect } from 'umi';
import EditableTable from '@/components/EditableTable';
import OperationGroup from '@/components/OperationGroup';
import styles from './index.less';

const { TreeNode } = TreeSelect;
const RadioGroup = Radio.Group;

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1978130_pmm4smpkzzg.js',
});

class Page extends Component {
  state = {
    visible: false,
    sourceType: 0,
  };
  formRef = React.createRef();

  columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      editable: true,
      required: true,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      editable: true,
      render(text) {
        return <IconFont type={text} />;
      },
    },
    {
      title: '路径',
      dataIndex: 'path_name',
      editable: true,
      required: true,
    },
    {
      title: '排序',
      dataIndex: 'sort_no',
      editable: true,
      required: true,
      custom() {
        return <InputNumber min={0} />;
      },
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
      title: '操作',
      operation: true,
      showEdit: true,
      showDelete: true,
      width: 60,
      fixed: 'right',
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.dispatch({
      type: 'sysmodule/queryTree',
    });
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  handleSubmit = () => {
    this.formRef.current.validateFields().then(row => {
      this.props
        .dispatch({
          type: 'sysmodule/add',
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

  handleSave = (row, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysmodule/update',
      payload: { id: id, ...row },
    }).then(data => {
      if (data != 'error') {
        this.loadData();
      }
    });
  };

  handleDel = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysmodule/update',
      payload: { id: id, deleted: 1 },
    }).then(data => {
      if (data != 'error') {
        this.loadData();
      }
    });
  };

  handelChangeSource = e => {
    this.setState({ sourceType: e.target.value });
  };

  createChildNode = datas => {
    return (
      datas &&
      datas.map(row => (
        <TreeNode key={row.id} value={row.id} title={row.name}>
          {this.createChildNode(row.children)}
        </TreeNode>
      ))
    );
  };

  render() {
    const { visible, sourceType } = this.state;
    const { data, listLoading, addLoading, updateLoading } = this.props;

    return (
      <div>
        <OperationGroup onAdd={() => this.setState({ visible: true })} />
        <EditableTable
          columns={this.columns}
          dataSource={data}
          loading={listLoading || updateLoading}
          onSave={this.handleSave}
          onDelete={this.handleDel}
          rowKey="id"
        />
        <Modal
          title="添加"
          okText="提交"
          cancelText="取消"
          width={600}
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.handleClose}
          confirmLoading={addLoading}
          destroyOnClose
        >
          <Form layout="vertical" ref={this.formRef}>
            <Form.Item
              className={styles.formItem}
              label="菜单类型"
              name="type"
              rules={[{ required: true }]}
              initialValue={sourceType}
            >
              <RadioGroup onChange={this.handelChangeSource}>
                <Radio value={0}>一级菜单</Radio>
                <Radio value={1}>子菜单</Radio>
              </RadioGroup>
            </Form.Item>

            <Form.Item
              className={styles.formItem}
              label="菜单名称"
              name="name"
              rules={[{ required: true }]}
            >
              <Input allowClear maxLength={100} />
            </Form.Item>

            {sourceType == 1 && (
              <Form.Item
                className={styles.formItem}
                label="上级菜单"
                name="parent_id"
                rules={[{ required: true }]}
              >
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  allowClear
                  treeDefaultExpandAll
                >
                  {data && this.createChildNode(data)}
                </TreeSelect>
              </Form.Item>
            )}

            <Form.Item
              className={styles.formItem}
              label="菜单路径"
              name="path"
              rules={[{ required: true }]}
            >
              <Input allowClear maxLength={100} />
            </Form.Item>

            <Form.Item className={styles.formItem} label="菜单图标" name="icon">
              <Input allowClear maxLength={100} />
            </Form.Item>

            <div className={styles.formDiv}>
              <Form.Item
                className={styles.formItem}
                label="排序"
                name="sort_no"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} />
              </Form.Item>

              <Form.Item
                className={styles.formItem}
                style={{ marginLeft: '32px' }}
                label="是否启用"
                name="is_enable"
                rules={[{ required: true }]}
                initialValue={1}
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.sysmodule.tree,
    listLoading: state.loading.effects['sysmodule/queryTree'],
    addLoading: state.loading.effects['sysmodule/add'],
    updateLoading: state.loading.effects['sysmodule/update'],
  };
}

export default connect(mapStateToProps)(Page);
