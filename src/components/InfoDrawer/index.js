import React, { Component } from 'react';
import { Drawer, Divider, Spin, Col } from 'antd';

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: '22px',
      marginBottom: 3,
      color: 'rgba(0,0,0,0.6)',
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: 'inline-block',
        color: 'rgba(0,0,0,0.9)',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

export default class InfoDrawer extends Component {
  render() {
    const { visible, onClose, dataSource, loading, extend } = this.props;
    return (
      <div>
        <Drawer
          width={380}
          placement="right"
          destroyOnClose
          closable={true}
          onClose={onClose}
          visible={visible}
        >
          <Spin spinning={loading}>
            {dataSource.map(data => (
              <Col span={24} key={data.h}>
                <Divider>{data.h}</Divider>
                {data.rows.map(row => (
                  <DescriptionItem key={row.title} title={row.title} content={row.value} />
                ))}
              </Col>
            ))}
            {extend}
          </Spin>
        </Drawer>
      </div>
    );
  }
}