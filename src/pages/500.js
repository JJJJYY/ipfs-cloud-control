import { Result, Button } from 'antd';
import { history } from 'umi';

const Exception500 = () => (
  <Result
    status="500"
    title="500"
    subTitle="对不起，服务出错了"
    extra={<Button type="primary" onClick={() => history.push('/')}>返回首页</Button>}
  />
);

export default Exception500;
