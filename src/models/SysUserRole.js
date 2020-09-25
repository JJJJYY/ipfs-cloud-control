import * as api from '../service/Api';

export default {
  namespace: 'sysUserRole',

  state: {
    
  },

  effects: {
    *add({ payload }, { call }) {
      return yield call(api.sysUserRoleAdd, payload);
    },

  },

  reducers: {
    
  },
}