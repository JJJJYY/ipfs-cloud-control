import * as api from '../service/Api';

export default {
  namespace: 'replenishmentRecord',

  state: {
    list: {},
    active: [],
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.replenishmentRecordList, payload);
      yield put({ type: 'list', payload: { data: data } });
      return data;
    },

    *add({ payload }, { call }) {
      return yield call(api.replenishmentRecordAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.replenishmentRecordUpdate, payload);
    },

    *batchAudit({ payload }, { call }) {
      return yield call(api.replenishmentRecordBatchAudit, payload);
    },

    *Audit({ payload }, { call }) {
      return yield call(api.replenishmentRecordAudit, payload);
    },

    *queryActive({ payload }, { call, put }) {
      const data = yield call(api.replenishmentRecordBatchAudit, payload);
      yield put({ type: 'active', payload: { data: data } });
      console.log(data.data);
      return data;
    },
  },

  reducers: {
    list(state, { payload: { data } }) {
      return {
        ...state,
        list: data,
      };
    },
    active(state, { payload: { data } }) {
      return {
        ...state,
        active: data instanceof Array ? data : [],
      };
    },
  },
};
