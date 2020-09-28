import React, { Component } from 'react';
import { Row, Col, Card, Progress } from 'antd';
import { connect, Link } from 'umi';
import { Line, Area, Column } from '@ant-design/charts';
import styles from './index.less';

class Page extends Component {

  state = {

  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.dispatch({
      type: 'overview/queryHome',
    });
    this.props.dispatch({
      type: 'goods/queryActive',
    });
  };

  render() {
    const { data, active, loading } = this.props;
    return (
      <div>
        <Row gutter={16}>
          <Col lg={6} md={12} xs={24}>
            <Card type="inner" size="small" title="总销售额" loading={loading}>
              <div>¥ <span className={styles.t1}>{data.weight && parseFloat(data.weight.paymentTotal.RMB)}</span></div>
              <div>$ <span className={styles.t1}>{data.weight && parseFloat(data.weight.paymentTotal.USDT)}</span></div>
              <div className={styles.line} />
              <div className={styles.cardTextDiv}>
                <div className={styles.t2}>ETH: {data.weight && parseFloat(data.weight.paymentTotal.ETH)}</div>
                <div className={styles.t2} style={{ marginLeft: '12px' }}>BTC: {data.weight && parseFloat(data.weight.paymentTotal.BTC)}</div>
              </div>
            </Card>
          </Col>
          <Col lg={6} md={12} xs={24}>
            <Card type="inner" size="small" title="总销售算力" loading={loading}>
              <div className={styles.t1}>{data.weight && parseFloat(data.weight.hashrateTotal).toFixed(2)} TB</div>
              <Area
                data={data.weight && data.weight.orderSomeDay}
                xField='time'
                yField='quantity'
                height={40}
                forceFit={true}
                xAxis={{ visible: false }}
                yAxis={{ visible: false }}
                meta={{ quantity: { alias: '算力', formatter: (v) => parseFloat(v) } }}
                padding={[6, 0, 0, 0]}
              />
              <div className={styles.line} />
              <div className={styles.t2}>日销售算力 {data.weight && data.weight.hashrateDay} TB</div>
            </Card>
          </Col>
          <Col lg={6} md={12} xs={24}>
            <Card type="inner" size="small" title="总订单量" loading={loading}>
              <div className={styles.t1}>{data.weight && data.weight.orderTotal}</div>
              <Area
                data={data.weight && data.weight.orderSomeDay}
                xField='time'
                yField='count'
                height={40}
                forceFit={true}
                xAxis={{ visible: false }}
                yAxis={{ visible: false }}
                meta={{ count: { alias: '数量' } }}
                padding={[6, 0, 0, 0]}
              />
              <div className={styles.line} />
              <div className={styles.t2}>日订单量 {data.weight && data.weight.orderDay}</div>
            </Card>
          </Col>
          <Col lg={6} md={12} xs={24}>
            <Card type="inner" size="small" title="总用户数" loading={loading}>
              <div className={styles.t1}>{data.user && data.user.total}</div>
              <Column
                data={data.user && data.user.someDay}
                xField='time'
                yField='count'
                height={40}
                forceFit={true}
                xAxis={{ visible: false }}
                yAxis={{ visible: false }}
                meta={{ count: { alias: '数量' } }}
                padding={[0, 0, 0, 0]}
              />
              <div className={styles.line} />
              <div className={styles.t2}>日注册量 {data.user && data.user.day}</div>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Card type="inner" className={styles.card} title="30天算力销售量" loading={loading}>
              <Line
                forceFit={true}
                data={data.weight && data.weight.orderMonth}
                height={300}
                forceFit={true}
                xField='time'
                yField='count'
                meta={{ count: { alias: '订单' } }}
                label={{ visible: true, type: 'point' }}
                point={{ visible: true, size: 5, shape: 'diamond', style: { fill: 'white', stroke: '#2593fc', lineWidth: 2 } }}
                tooltip={{
                  custom: {
                    onChange: (_, cfg) => {
                      const { items } = cfg;
                      if (items.length == 1) {
                        items.push(
                          {
                            name: '算力',
                            value: parseFloat(items[0].data.quantity) + ' TB',
                            marker: false,
                            color: null,
                          },
                        );
                      }
                    },
                  },
                }}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
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
        </Row>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    data: state.overview.home,
    active: state.goods.active,
    loading: state.loading.effects['overview/queryHome'] || state.loading.effects['goods/queryActive'],
  };
}

export default connect(mapStateToProps)(Page);