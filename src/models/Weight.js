import * as api from '../service/Api';

export default {
  namespace: 'weight',

  state: {
    list: {},
    topList: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.weightList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *queryTopList({ payload }, { call, put }) {
      const data = yield call(api.weightTopList, payload);
      yield put({ type: 'topList', payload: { data: data } });
    },

    *update({ payload }, { call }) {
      return yield call(api.weightUpdate, payload);
    },

    *export({ payload }, { call }) {
      return yield call(api.weightExport, payload);
    },

  },

  reducers: {
    list(state, { payload: { data } }) {
      return {
        ...state,
        list: data,
      }
    },
    topList(state, { payload: { data } }) {
      return {
        ...state,
        topList: data,
      }
    },

  },
}