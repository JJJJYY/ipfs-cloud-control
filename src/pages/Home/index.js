import React, { Component } from 'react';
import { history } from 'umi';
import { Row, Col, Card, Progress } from 'antd';
import { connect, Link } from 'umi';
import { Line, Area, Column } from '@ant-design/charts';
import {
  UserOutlined,
  ProfileOutlined,
  AccountBookOutlined,
  RightOutlined,
} from '@ant-design/icons';

import styles from './index.less';

class Page extends Component {
  state = {
    data: null,
    active: null,
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props
      .dispatch({
        type: 'overview/queryHome',
        payload: {
          count: 5,
        },
      })
      .then(res => {
        this.setState({
          active: res,
        });
      });
    this.props
      .dispatch({
        type: 'goods/queryActive',
      })
      .then(res => {
        console.log(res);
        this.setState({
          data: res,
        });
      });
  };
  ReplenishmentRecord = () => {
    history.replace('/order/replenishmentRecord');
  };
  render() {
    const { loading } = this.props;
    const { data, active } = this.state;
    console.log(data);
    return (
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <Card type="inner" size="small" title="总销售额" loading={loading}>
              <div style={{ display: 'flex' }}>
                <AccountBookOutlined style={{ fontSize: '36px' }} />
                <div className={styles.t1}>¥{data && data.total_amount}</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card type="inner" size="small" title="总订单量" loading={loading}>
              <div style={{ display: 'flex' }}>
                <ProfileOutlined style={{ fontSize: '36px' }} />
                <div className={styles.t1}>{data && data.orderCount}</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card type="inner" size="small" title="总用户数" loading={loading}>
              <div style={{ display: 'flex' }}>
                <UserOutlined style={{ fontSize: '36px' }} />
                <div className={styles.t1}>{data && data.userCount}</div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Card
              type="inner"
              className={styles.card}
              title="库存概括"
              loading={loading}
            >
              <div style={{ display: 'flex' }}>
                {active
                  ? active.map(item => {
                      return (
                        <div key={item.id} style={{ flex: '1' }}>
                          <div
                            style={{ fontSize: '20px', textAlign: 'center' }}
                          >
                            {item.stock + '/' + item.unit}
                          </div>
                          <div
                            style={{ textAlign: 'center', marginTop: '10px' }}
                          >
                            {item.product_type_name}
                          </div>
                        </div>
                      );
                    })
                  : null}
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Card
              type="inner"
              className={styles.card}
              title="待处理"
              loading={loading}
            >
              <div style={{ display: 'flex' }}>
                {' '}
                <div style={{ flex: '1', color: '#1890ff' }}>补单审核</div>{' '}
                <div
                  onClick={this.ReplenishmentRecord}
                  style={{ flex: '1', color: '#1890ff', textAlign: 'right' }}
                >
                  {data && data.auditCount}
                  <RightOutlined />
                </div>
              </div>
              <div className={styles.line} />
            </Card>
          </Col>
        </Row>
        {/* <Row gutter={16}>
          <Col md={20} xs={24}>
            <Card type="inner" className={styles.card} title="云算力矿机" loading={loading}>
              <div className={styles.cardOrder}>
                {active && active.map((item) => (
                  <div className={styles.progressDiv} key={item.id}>
                    <div className={styles.t4}>{item.name}</div>
                    <Progress className={styles.progress} type="circle" percent={parseFloat((item.quantity - item.remaining_quantity) / item.quantity * 100).toFixed(1)} width={62} />
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          <Col md={4} xs={24}>
            <Card type="inner" className={styles.card} title="待处理" loading={loading}>
              <div className={styles.undealRow}>
                实名审核
                <Link className={styles.t3} to='/comsumer/userIdInfo'>{data.user_id_info}</Link>
              </div>
              <div className={styles.undealRow}>
                提币审核
                <Link className={styles.t3} to='/order/withdrawal'>{data.withdrawal}</Link>
              </div>
              <div className={styles.undealRow}>
                补单审核
                <Link className={styles.t3} to='/order/replenishmentRecord'>{data.replenishment_record}</Link>
              </div>
            </Card>
          </Col>
        </Row> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.overview.home,
    active: state.goods.active,
    loading:
      state.loading.effects['overview/queryHome'] ||
      state.loading.effects['goods/queryActive'],
  };
}

export default connect(mapStateToProps)(Page);
