import * as api from '../service/Api';

export default {
  namespace: 'announcement',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.announcementList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *add({ payload }, { call }) {
      return yield call(api.announcementAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.announcementUpdate, payload);
    },

    *get({ payload }, { call }) {
      return yield call(api.announcementGet, payload);
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