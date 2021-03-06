import * as api from '../service/Api';

export default {
  namespace: 'userIdInfo',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.userIdInfoList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *update({ payload }, { call }) {
      return yield call(api.userIdInfoUpdate, payload);
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