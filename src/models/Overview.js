import * as api from '../service/Api';

export default {
  namespace: 'overview',

  state: {
    home: {},
  },

  effects: {
    *queryHome({ payload }, { call }) {
      return yield call(api.overviewHome, payload);
    },
  },

  // reducers: {
  //   home(state, { payload: { data } }) {
  //     data.weight.orderSomeDay.map((item) => {
  //       item.quantity = parseFloat(item.quantity)
  //     })
  //     return {
  //       ...state,
  //       home: data,
  //     }
  //   },

  // },
};
