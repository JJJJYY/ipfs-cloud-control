import * as api from '../service/Api';

export default {
  namespace: 'replenishmentRecord',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.replenishmentRecordList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *add({ payload }, { call }) {
      return yield call(api.replenishmentRecordAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.replenishmentRecordUpdate, payload);
    },

    *export({ payload }, { call }) {
      return yield call(api.replenishmentRecordExport, payload);
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