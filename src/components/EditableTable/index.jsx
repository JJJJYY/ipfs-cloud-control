import React, { useState } from 'react';
import { Table, Form, Divider, Input, Menu, Dropdown, Modal } from 'antd';

const EditableCell = ({
  editing,
  required,
  custom,
  dataIndex,
  title,
  record,
  valuePropName,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          valuePropName={valuePropName}
          rules={[
            {
              required: required,
              message: `输入${title}`,
            },
          ]}
        >
          {custom ? (
            custom(record)
          ) : (
            <Input allowClear style={{ minWidth: 120 }} />
          )}
        </Form.Item>
      ) : (
        restProps.children
      )}
    </td>
  );
};

const EditableTable = ({
  onSave,
  onDelete,
  onPutaway,
  onActions,
  dataSource,
  columns,
  total,
  current,
  loading,
  onChange,
  pagination,
  rowKey,
  rowSelection,
}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const isEditing = record => record.id === editingKey;

  const edit = record => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.id);
  };

  const save = id => {
    form.validateFields().then(row => {
      if (onSave) onSave(row, id);
      setEditingKey('');
    });
  };

  const handleMenuClick = (record, index) => {
    if (index == -1) {
      edit(record);
      return;
    } else if (index == -2) {
      Modal.confirm({
        title: '删除?',
        content: '删除本条纪录',
        okText: '提交',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          if (onDelete) onDelete(record.id);
        },
      });
      return;
    } else if (index == -3) {
      Modal.confirm({
        title: '上架?',
        content: '确定上架吗',
        okText: '提交',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          if (onPutaway) onPutaway(record.id);
        },
      });
      return;
    }
    if (onActions) onActions(record, index);
  };

  const ecolumns = columns.map(col => {
    if (col.operation) {
      return {
        ...col,
        render: record => {
          const editable = isEditing(record);
          var actionCount = 0;
          if (col.showEdit) actionCount++;
          if (col.showDelete) actionCount++;
          if (col.putaway) actionCount++;
          if (col.actions && col.actions(record).length)
            actionCount += col.actions(record).length;
          return (
            <div>
              {editable ? (
                <span>
                  <a
                    // href="javascript:;"
                    onClick={() => save(record.id)}
                  >
                    保存
                  </a>
                  <Divider />
                  <a
                    // href="javascript:;"
                    onClick={() => setEditingKey('')}
                  >
                    取消
                  </a>
                </span>
              ) : (
                <span>
                  {actionCount > 1 ? (
                    <Dropdown
                      disabled={editingKey !== ''}
                      trigger={['click']}
                      overlay={
                        <Menu onClick={e => handleMenuClick(record, e.key)}>
                          {col.showEdit && <Menu.Item key={-1}>编辑</Menu.Item>}
                          {col.showDelete && (
                            <Menu.Item key={-2}>删除</Menu.Item>
                          )}
                          {col.putaway && <Menu.Item key={-3}>上架</Menu.Item>}
                          {(col.showEdit || col.showDelete || col.putaway) &&
                            col.actions && <Menu.Divider />}
                          {col.actions &&
                            col
                              .actions(record)
                              .map((title, index) => (
                                <Menu.Item key={index}>{title}</Menu.Item>
                              ))}
                        </Menu>
                      }
                    >
                      <div>
                        {// 隐藏
                        col.statusShow && col.statusShow(record) ? null : (
                          <a>更多</a>
                        )}
                      </div>
                    </Dropdown>
                  ) : (
                    <span>
                      {col.showEdit && (
                        <a
                          disabled={editingKey !== ''}
                          onClick={() => edit(record)}
                        >
                          编辑
                        </a>
                      )}
                      {col.showDelete && (
                        <a onClick={() => handleMenuClick(record, -2)}>删除</a>
                      )}
                      {col.putaway && (
                        <a onClick={() => handleMenuClick(record, -3)}>上架</a>
                      )}
                      {col.actions && col.actions(record).length != 0 && (
                        <a onClick={() => handleMenuClick(record, 0)}>
                          {col.actions(record)[0]}
                        </a>
                      )}
                    </span>
                  )}
                </span>
              )}
            </div>
          );
        },
      };
    }
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        required: col.required,
        custom: col.custom,
        valuePropName: col.valuePropName,
        editing: isEditing(record),
      }),
    };
  });

  var page;
  if (pagination) {
    page = pagination;
  } else {
    page = {
      total: parseInt(total),
      showTotal: total => {
        return `总数:${total}`;
      },
    };
    if (current) {
      page.current = parseInt(current);
    }
  }

  return (
    <Form form={form} component={false}>
      <Table
        style={{ backgroundColor: 'white' }}
        scroll={{ x: 'max-content' }}
        tableLayout="auto"
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        columns={ecolumns}
        dataSource={dataSource}
        loading={loading}
        pagination={page}
        onChange={onChange}
        rowKey={rowKey ? rowKey : 'id'}
        rowSelection={rowSelection}
      />
    </Form>
  );
};

export default EditableTable;
