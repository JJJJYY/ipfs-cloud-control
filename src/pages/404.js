import { Result, Button } from 'antd';
import { history } from 'umi';

const Exception404 = () => (
  <Result
    status="404"
    title="404"
    subTitle="对不起，页面不存在"
    extra={<Button type="primary" onClick={() => history.push('/')}>返回首页</Button>}
  />
);

export default Exception404;
