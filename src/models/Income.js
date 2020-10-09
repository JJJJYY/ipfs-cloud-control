import * as api from '../service/Api';

export default {
  namespace: 'income',

  state: {
    list: {},
    rewards: [],
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.incomeList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *queryReward({ payload }, { call, put }) {
      const data = yield call(api.incomeRewardBy24H, payload);
      yield put({ type: 'rewards', payload: { data: data } });
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

    rewards(state, { payload: { data } }) {
      return {
        ...state,
        rewards: data,
      }
    },

  },
}