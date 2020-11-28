import * as api from '../service/Api';

export default {
  namespace: 'userAdjPower',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.userAdjPowerList, payload);
      yield put({ type: 'list', payload: { data: data } });
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