import * as api from '../service/Api';

export default {
  namespace: 'sysmodule',

  state: {
    tree: [],
  },

  effects: {
    *add({ payload }, { call }) {
      return yield call(api.sysModuleAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.sysModuleUpdate, payload);
    },

    *queryTree({ payload }, { call, put }) {
      const data = yield call(api.sysModuleTree, payload);
      yield put({ type: 'tree', payload: { data: data } });
      return data;
    },

  },

  reducers: {
    tree(state, { payload: {data} }) {
      return {
        ...state,
        tree: data instanceof Array ? data : [],
      }
    },
  },
}