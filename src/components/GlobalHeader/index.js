import React, { PureComponent } from 'react';
import { Menu, Spin, Dropdown, Avatar } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, EditOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import styles from './index.less';

export default class GlobalHeader extends PureComponent {

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
  };

  render() {
    const {
      currentUser = {},
      collapsed,
      onMenuClick,
      isMobile,
      logo,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="passwd">
          <LockOutlined />密码
        </Menu.Item>
        <Menu.Item key="logout">
          <LogoutOutlined />注销
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} width="32" />
          </Link>
        )}
        {collapsed ? <MenuUnfoldOutlined className={styles.trigger} onClick={this.toggle} /> : <MenuFoldOutlined className={styles.trigger} onClick={this.toggle}/>}
        <div className={styles.right}>
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
