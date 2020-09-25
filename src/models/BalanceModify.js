import * as api from '../service/Api';

export default {
  namespace: 'balanceModify',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.balanceModifyList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *export({ payload }, { call }) {
      return yield call(api.balanceModifyExport, payload);
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