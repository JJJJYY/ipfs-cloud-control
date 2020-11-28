import * as api from '../service/Api';

export default {
  namespace: 'flashSaleOrders',

  state: {
    list: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const data = yield call(api.flashSaleOrdersList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *update({ payload }, { call }) {
      return yield call(api.flashSaleOrdersUpdate, payload);
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