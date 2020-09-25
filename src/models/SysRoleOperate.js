import * as api from '../service/Api';

export default {
  namespace: 'sysRoleOperate',

  state: {
    
  },

  effects: {
    *edit({ payload }, { call }) {
      return yield call(api.sysRoleOperateEdit, payload);
    },

  },

  reducers: {
    
  },
}