import { Result, Button } from 'antd';
import { history } from 'umi';

const Exception403 = () => (
  <Result
    status="403"
    title="403"
    subTitle="对不起，你没有权限"
    extra={<Button type="primary" onClick={() => history.push('/')}>返回首页</Button>}
  />
);

export default Exception403;
