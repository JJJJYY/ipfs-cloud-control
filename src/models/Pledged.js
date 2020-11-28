import * as api from '../service/Api';

export default {
  namespace: 'pledged',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.pledgedList, payload);
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