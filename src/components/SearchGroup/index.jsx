import React from 'react';
import { Button, Form, Row, Col, Input } from 'antd';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import styles from './index.less';

const Group = React.memo(props => {
  const { onSearch, items } = props;
  const [form] = Form.useForm();
  var span = items.length < 3 ? 8 : 6;
  return <div className={styles.body}>
    <Form form={form} onFinish={onSearch}>
      <Row className={styles.row} gutter={12}>
        {items.map((row, index) => {
          return (
            <Col span={span} key={index}>
              <Form.Item
                className={styles.item}
                label={row.label}
                name={row.name}
              >
                {row.custom ? row.custom : <Input />}
              </Form.Item>
            </Col>
          )
        })}
        <Col span={span}>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>查询</Button>
          <Button style={{ marginLeft: 10 }} icon={<RedoOutlined />} onClick={() => {
            form.resetFields();
            onSearch();
          }}>重置</Button>
        </Col>
      </Row>
    </Form>
  </div>
});

export default Group;
