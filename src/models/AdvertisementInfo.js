import * as api from '../service/Api';

export default {
  namespace: 'advertisementInfo',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.advertisementInfoList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *add({ payload }, { call }) {
      return yield call(api.advertisementInfoAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.advertisementInfoUpdate, payload);
    },

    *get({ payload }, { call }) {
      return yield call(api.advertisementInfoGet, payload);
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