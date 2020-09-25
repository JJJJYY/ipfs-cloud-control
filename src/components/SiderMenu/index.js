import React from 'react';
import { Drawer } from 'antd';
import SiderMenu from './SiderMenu';

const SiderMenuWrapper = React.memo(props => {
  const { isMobile, collapsed, onCollapse } = props;
  return isMobile ? (
    <Drawer
      visible={!collapsed}
      placement="left"
      onClose={() => onCollapse(true)}
      style={{
        padding: 0,
        height: '100vh',
      }}
    >
      <SiderMenu {...props} collapsed={isMobile ? false : collapsed} />
    </Drawer>
  ) : (
    <SiderMenu {...props} />
  );
});

export default SiderMenuWrapper;
