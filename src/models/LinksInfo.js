import * as api from '../service/Api';

export default {
  namespace: 'linksInfo',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.linksInfoList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *add({ payload }, { call }) {
      return yield call(api.linksInfoAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.linksInfoUpdate, payload);
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