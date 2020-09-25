import * as api from '../service/Api';

export default {
  namespace: 'textInfo',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.textInfoList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *add({ payload }, { call }) {
      return yield call(api.textInfoAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.textInfoUpdate, payload);
    },

    *get({ payload }, { call }) {
      return yield call(api.textInfoGet, payload);
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