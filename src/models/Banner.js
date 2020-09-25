import * as api from '../service/Api';

export default {
  namespace: 'banner',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.bannerList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *add({ payload }, { call }) {
      return yield call(api.bannerAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.bannerUpdate, payload);
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