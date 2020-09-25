import * as api from '../service/Api';

export default {
  namespace: 'balance',

  state: {
   
  },

  effects: {
    *exchange({ payload }, { call }) {
      return yield call(api.balanceExchange, payload);
    },

  },

  reducers: {

    
  },
}