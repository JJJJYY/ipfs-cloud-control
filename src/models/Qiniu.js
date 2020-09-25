import * as api from '../service/Api';

export default {
  namespace: 'qiniu',

  state: {
    token: null,
    tokenTime: 0,
  },

  effects: {
    *token({ }, { call, put }) {
      const data = yield call(api.qiniu);
      if (data != 'error') {
        yield put({ type: 'rtoken', payload: { data } });
      }
      return data;
    },
  },

  reducers: {
    rtoken(state, { payload: {data} }) {
      const time = new Date();
      return {
        ...state,
        token: data,
        tokenTime: time.getTime(),
      }
    }
  },
}