import * as api from '../service/Api';

export default {
  namespace: 'authAgent',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.authAgentList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *add({ payload }, { call }) {
      return yield call(api.authAgentAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.authAgentUpdate, payload);
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