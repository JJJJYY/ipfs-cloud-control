import * as api from '../service/Api';

export default {
  namespace: 'goods',

  state: {
    list: {},
    active: [],
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.goodsList, payload);
      yield put({ type: 'list', payload: { data: data } });
      return data;
    },

    *add({ payload }, { call }) {
      return yield call(api.goodsAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.goodsUpdate, payload);
    },

    *get({ payload }, { call }) {
      return yield call(api.goodsGet, payload);
    },
    *Change({ payload }, { call }) {
      return yield call(api.goodsChange, payload);
    },
    *Id({ payload }, { call }) {
      return yield call(api.goodsId, payload);
    },
    *List({ payload }, { call }) {
      return yield call(api.groupList, payload);
    },

    // *queryActive({ payload }, { call, put }) {
    //   const data = yield call(api.goodsGetActive, payload);
    //   yield put({ type: 'active', payload: { data: data } });
    // },
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
