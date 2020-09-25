import * as api from '../service/Api';

export default {
  namespace: 'withdrawal',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.withdrawalList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *audit({ payload }, { call }) {
      return yield call(api.withdrawalAudit, payload);
    },

    *export({ payload }, { call }) {
      return yield call(api.withdrawalExport, payload);
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