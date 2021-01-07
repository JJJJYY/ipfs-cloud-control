import umirequest from 'umi-request';
import { message } from 'antd';
import { getDvaApp, history } from 'umi';
import { getAuthority } from '@/utils/authority';

const fetchData = response => {
  return new Promise((resolve, reject) => {
    let json = response;
    let token = json.data.token;
    if (json.code == 200) {
      localStorage.getItem('token', token);
    } else {
      const errortext = json.msg;
      console.log(errortext);
      message.error(errortext);
      history.location.pathname == '/login';
      const error = new Error(errortext);
      error.name = json.ret;
      error.response = response;
      reject(error);
    }
    resolve(json.data);
  });
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  const options = {
    ...option,
  };
  // options.body['token'] = localStorage.getItem('Bg_AuthKey');

  const defaultOptions = {};
  const newOptions = { ...defaultOptions, ...options };
  const user = getAuthority();
  if (user && user.token) {
    newOptions.headers = {
      Authorization: 'Bearer ' + user.token,
      ...newOptions.headers,
    };
  }
  // newOptions.body = urlForQuery(newOptions.body)
  // newOptions.body = JSON.stringify(newOptions.body)

  return umirequest(url, newOptions)
    .then(response => {
      console.log(response);
      // token失效
      if (response.code == 403) {
        history.push('/login');
      }
      return fetchData(response);
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        getDvaApp()._store.dispatch({
          type: 'sysuser/logout',
        });
      } else if (status === 403) {
        history.push('/403');
      } else if (status <= 504 && status >= 500) {
        history.push('/500');
      } else if (status >= 404 && status < 422) {
        history.push('/404');
      }
      return String('error');
    });
}
