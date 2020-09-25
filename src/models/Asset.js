import * as api from '../service/Api';

export default {
  namespace: 'asset',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.assetList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *add({ payload }, { call }) {
      return yield call(api.assetAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.assetUpdate, payload);
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