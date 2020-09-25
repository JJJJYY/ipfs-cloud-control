import * as api from '../service/Api';

export default {
  namespace: 'weight',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.weightList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *update({ payload }, { call }) {
      return yield call(api.weightUpdate, payload);
    },

    *export({ payload }, { call }) {
      return yield call(api.weightExport, payload);
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