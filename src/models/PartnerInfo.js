import * as api from '../service/Api';

export default {
  namespace: 'partnerInfo',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.partnerInfoList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *add({ payload }, { call }) {
      return yield call(api.partnerInfoAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.partnerInfoUpdate, payload);
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