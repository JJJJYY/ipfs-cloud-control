
import { Component } from 'react';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import SiderMenu from "@/components/SiderMenu";
import GlobalHeader from "@/components/GlobalHeader";
import { connect, Redirect } from 'umi';
import { getAuthority } from '@/utils/authority';
import EditModal from '@/components/EditModal'
import styles from './index.less';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import UserLayout from './UserLayout.js';
import crypto from 'crypto';
import moment from 'moment';
import 'moment/locale/zh-cn';

import logo from '../img/logo.png';

moment.locale('zh-cn');
const { Header, Footer, Content } = Layout
const title = 'FILPool';
const footer = 'Copyright © FILPool 2020.';

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      visible: false,
      modalData: [],
    };
  }

  componentDidMount() {
    if (getAuthority()) {
      this.loadData();
    }
  }

  loadData = () => {
    this.props.dispatch({
      type: 'sysuser/userMenu',
    })
  }

  handleMenuCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  handleMenuClick = ({ key }) => {
    if (key == 'passwd') {
      const datas = [
        {
          title: '新密码',
          key: 'password',
          required: true,
        }
      ];
      this.setState({
        visible: true,
        modalData: datas,
      });

    } else if (key === 'logout') {
      const { dispatch } = this.props;
      dispatch({
        type: 'sysuser/logout',
      });
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = (values) => {
    const user = getAuthority();
    if (values.password) values.password = crypto.createHash('md5').update(values.password).digest('hex');
    this.props.dispatch({
      type: 'sysuser/update',
      payload: { id: user.id, ...values },
    });
    this.handleCancel();
  };

  getLayoutStyle = () => {
    const { isMobile } = this.props;
    if (!isMobile) {
      return {
        paddingLeft: this.state.collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  getHeadWidth = () => {
    const { isMobile } = this.props;
    if (isMobile) {
      return '100%';
    }
    return this.state.collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };

  render() {
    const { children, location, confirmLoading, isMobile, menu } = this.props;
    const { collapsed, visible, modalData } = this.state;

    // 登录页面用其他的Layout
    if (location.pathname === '/login') {
      return <UserLayout>{children}</UserLayout>

    } else if (menu.length && location.pathname != '/' && location.pathname != '/403' && location.pathname != '/404' && location.pathname != '/500') {
      var match = false;
      for (let item of menu) {
        if (location.pathname == item.path) {
          match = true;
          break;

        } else if (location.pathname.indexOf(item.path) != -1) {
          for (let child of item.children) {
            if (location.pathname == child.path) {
              match = true;
              break;
            }
          }
        }
      }
      if (!match) {
        return <Redirect to="/403" />
      }
    }

    const user = getAuthority();
    const width = this.getHeadWidth();
    const contentClassName = classNames(styles.content, {
      [styles.isMobile]: isMobile,
    });

    const layout = (
      <Layout>
        {menu.length && <SiderMenu
          logo={logo}
          title={title}
          collapsed={collapsed}
          menuData={menu}
          location={location}
          onCollapse={this.handleMenuCollapse}
          isMobile={isMobile}
          {...this.props}
        />}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header style={{ padding: 0, width }} className={styles.fixedHeader}>
            <GlobalHeader
              collapsed={collapsed}
              isMobile={isMobile}
              logo={logo}
              currentUser={{
                name: user && user.name,
                avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                userid: user && user.id,
              }}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
            />
          </Header>
          <Content className={contentClassName}>
            {children}
          </Content>
          <EditModal
            visible={visible}
            confirmLoading={confirmLoading}
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
            columns={modalData}
            title='编辑'
          />
          <Footer style={{ textAlign: 'center' }}>{footer}</Footer>
        </Layout>
      </Layout>
    );

    return (
      <ConfigProvider locale={zhCN}>
        <ContainerQuery query={query}>
          {params => (
            <div className={classNames(params)}>{layout}</div>
          )}
        </ContainerQuery>
      </ConfigProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    menu: state.sysuser.menu,
    confirmLoading: state.loading.effects['admin/editAdmin'],
  };
}

export default connect(mapStateToProps)(BasicLayout);
