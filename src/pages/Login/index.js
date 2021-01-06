import { connect } from 'umi';
import { removeAuthority } from '@/utils/authority';
import LoginForm from '@/components/Login';
import crypto from 'crypto';
import styles from './index.less';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginForm;

class LoginPage extends React.Component {
  componentDidMount() {
    removeAuthority();
  }

  onSubmit = values => {
    values.password = crypto
      .createHash('md5')
      .update(values.password)
      .digest('hex');
    this.props.dispatch({
      type: 'sysuser/login',
      payload: values,
    });
  };

  onT = () => {
    // window.location.href = 'alipayqr://platformapi/startapp?saId=10000007&a=10&qrcode=' + encodeURIComponent('https://qr.alipay.com/fkx02790ddm7vct4bvmbs9e');
    // window.location.href = 'alipayqr://platformapi/startapp?saId=20000116&actionType=toAccount&goBack=NO&account=13727831211&amount=10';
    // window.location.href = 'alipays://platformapi/startapp?appId=20000067&url=' + encodeURIComponent('alipays://platformapi/startapp?appId=20000123&actionType=scan&biz_data={"s":"money","u":"2088702171263733","a":"6.66"}');
    // window.location.href = 'https://www.dedemao.com/alipay/authorize.php?scope=auth_base';
  };

  render() {
    const { submitting } = this.props;
    // var url = 'alipays://platformapi/startapp?appId=09999988&actionType=toAccount&goBack=YES&amount=10&account=13727831211';
    // var url = 'alipays://platformapi/startapp?appId=20000067&url=';
    return (
      <div className={styles.main}>
        <LoginForm onSubmit={this.onSubmit}>
          <UserName
            name="account"
            placeholder="账号"
            rules={[{ required: true, message: '请输入账号' }]}
          />
          <Password
            name="password"
            placeholder="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          />
          {/* <Captcha name='code' placeholder='验证码' rules={[{ required: true, message: '请输入验证码' }]} /> */}
          <Submit loading={submitting}>登录</Submit>
          {/* <a onClick={() => this.onT()}>123</a> */}
          {/* <a href='alipays://platformapi/startapp?appId=09999988&&actionType=toAccount&&goBack=YES&&account=13727831211&&amount=10'>123</a> */}
          {/* <a href={url+encodeURIComponent('http://pay-h5.cb4fbffea054143baad363e626d8dea91.cn-zhangjiakou.alicontainer.com?sn=P1597111987859')}>123</a> */}
        </LoginForm>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    submitting: state.loading.effects['sysuser/login'],
  };
}

export default connect(mapStateToProps)(LoginPage);
