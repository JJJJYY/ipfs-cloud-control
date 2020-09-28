import * as api from '../service/Api';

export default {
  namespace: 'overview',

  state: {
    home: {},
  },

  effects: {
    *queryHome({ payload }, { call, put }) {
      const data = yield call(api.overviewHome, payload);
      yield put({ type: 'home', payload: { data: data } });
    },
  },

  reducers: {
    home(state, { payload: { data } }) {
      data.weight.orderSomeDay.map((item) => {
        item.quantity = parseFloat(item.quantity)
      })
      return {
        ...state,
        home: data,
      }
    },

  },
}