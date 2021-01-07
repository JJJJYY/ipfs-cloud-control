import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

export default class EditModal extends Component {
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
  formRef = React.createRef();

  onOk = () => {
    this.formRef.current.validateFields().then(values => {
      const { onOk } = this.props;
      if (onOk) onOk(values);
    });
  };

  render() {
    const {
      width,
      visible,
      title,
      confirmLoading,
      onCancel,
      columns,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        width={width ? width : 500}
        title={title ? title : '添加'}
        okText="提交"
        cancelText="取消"
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={this.onOk}
        onCancel={onCancel}
      >
        <Form ref={this.formRef}>
          {columns.map(data => (
            <FormItem
              label={data.title}
              name={data.key}
              rules={[{ required: data.required, message: `${data.title}` }]}
              initialValue={data.value}
              valuePropName={data.valuePropName}
              {...this.formLayout}
              key={data.key}
            >
              {data.custom ? (
                data.custom(data.value)
              ) : (
                <Input allowClear placeholder="" />
              )}
            </FormItem>
          ))}
        </Form>
      </Modal>
    );
  }
}
