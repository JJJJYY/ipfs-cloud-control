import * as api from '../service/Api';

export default {
  namespace: 'helpInfo',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.helpInfoList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *add({ payload }, { call }) {
      return yield call(api.helpInfoAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.helpInfoUpdate, payload);
    },

    *get({ payload }, { call }) {
      return yield call(api.helpInfoGet, payload);
    },

  },

  reducers: {
    list(state, { payload: {data} }) {
      return {
        ...state,
        list: data,
      }
    },
    
  },
}