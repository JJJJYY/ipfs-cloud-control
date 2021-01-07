import React from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import styles from './index.less';

const Group = React.memo(props => {
  const { onAdd, onExport } = props;
  return (
    <div className={styles.body}>
      {onAdd && (
        <Button
          type="primary"
          className={styles.btn}
          icon={<PlusOutlined />}
          onClick={onAdd}
        >
          添加
        </Button>
      )}
      {/* {onExport &&
      <Button
        className={styles.btn}
        icon={<DownloadOutlined />}
        onClick={() => {
          const modal = Modal.success({
            title: '生成Excel',
            content: (
              <div>
                <br />
                <Button 
                  onClick={() => {
                    onExport(false);
                    modal.destroy();
                  }}
                >
                  导出当前页
                </Button>
                <Button
                  onClick={() => {
                    onExport(true);
                    modal.destroy();
                  }}
                  className={styles.btn}
                >
                  导出所有结果
                </Button>
              </div>
            ),
            okText: '取消',
          });
        }}
      >
        导出
      </Button>
    } */}
    </div>
  );
});

export default Group;
