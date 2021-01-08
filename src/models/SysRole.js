import * as api from '../service/Api';

export default {
  namespace: 'sysrole',

  state: {
    list: {},
  },

  effects: {
    *add({ payload }, { call }) {
      return yield call(api.sysRoleAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.sysRoleUpdate, payload);
    },

    *queryList({ payload }, { call, put }) {
      const data = yield call(api.sysRoleList, payload);
      yield put({ type: 'list', payload: { data: data } });
      let index = data.data.map(item => {
        return item;
      });

      return index;
    },

    *queryRoleTree({ payload }, { call }) {
      return yield call(api.sysRoleTree, payload);
    },

    *queryRoleOperate({ payload }, { call }) {
      return yield call(api.sysRoleOperate, payload);
    },
  },

  reducers: {
    list(state, { payload: { data } }) {
      return {
        ...state,
        list: data,
      };
    },
  },
};
