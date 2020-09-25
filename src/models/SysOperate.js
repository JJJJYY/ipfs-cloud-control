import * as api from '../service/Api';

export default {
  namespace: 'sysOperate',

  state: {
    list: [],
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.sysOperateList, payload);
      yield put({ type: 'list', payload: { data: data } });
      return data;
    },

    *add({ payload }, { call }) {
      return yield call(api.sysOperateAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.sysOperateUpdate, payload);
    },

  },

  reducers: {
    list(state, { payload: { data } }) {
      return {
        ...state,
        list: data instanceof Array ? data : [],
      }
    },
  },
}