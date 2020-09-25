import * as api from '../service/Api';

export default {
  namespace: 'sysRoleModule',

  state: {
    
  },

  effects: {
    *edit({ payload }, { call }) {
      return yield call(api.sysRoleModuleEdit, payload);
    },

  },

  reducers: {
    
  },
}