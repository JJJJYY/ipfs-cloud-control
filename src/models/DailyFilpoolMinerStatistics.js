import * as api from '../service/Api';

export default {
  namespace: 'dailyMinerStatistics',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.dailyFilpoolMinerStatisticsList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },
  },

  reducers: {
    list(state, { payload: { data } }) {
      return {
        ...state,
        list: data,
      };
    },
  },
};
