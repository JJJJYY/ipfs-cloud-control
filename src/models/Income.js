import * as api from '../service/Api';

export default {
  namespace: 'income',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.incomeList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *export({ payload }, { call }) {
      return yield call(api.incomeExport, payload);
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