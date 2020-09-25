import React, { PureComponent } from 'react';
import { ConfigProvider } from 'antd';
import styles from './UserLayout.less';
import zhCN from 'antd/es/locale/zh_CN';

const title =  'FILPool管理后台';

class UserLayout extends PureComponent {

  render() {
    const { children } = this.props;
    return (
      <ConfigProvider locale={zhCN}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <span className={styles.title}>{title}</span>
              </div>
            </div>
            {children}
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

export default UserLayout;
