import * as api from '../service/Api';

export default {
  namespace: 'app',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.appList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *add({ payload }, { call }) {
      return yield call(api.appAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.appUpdate, payload);
    },

  },

  reducers: {
    list(state, { payload: { data } }) {
      return {
        ...state,
        list: data,
      }
    },

  },
}