import { history } from 'umi';
import { setAuthority, removeAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import * as api from '../service/Api';

export default {
  namespace: 'sysuser',

  state: {
    list: {},
    menu: [],
  },

  effects: {
    *login({ payload }, { call, put }) {
      const data = yield call(api.sysUserLogin, payload);
      if (data && data != 'error') {
        reloadAuthorized();
        setAuthority(data);
        history.replace('/')
        yield put({ type: 'userMenu' });
      }
    },

    *logout(_, { call }) {
      yield call(api.sysUserLogout);
      removeAuthority();
      reloadAuthorized();
      history.replace('/login')
    },
    
    *add({ payload }, { call }) {
      return yield call(api.sysUserAdd, payload);
    },

    *update({ payload }, { call }) {
      return yield call(api.sysUserUpdate, payload);
    },

    *queryList({ payload }, { call, put }) {
      const data = yield call(api.sysUserList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *userRole({ payload }, { call }) {
      return yield call(api.sysUserRole, payload);
    },

    *userMenu(_, { call, put }) {
      const data = yield call(api.sysUserMenu);
      yield put({ type: 'menu', payload: { data: data } });
    },

  },

  reducers: {
    list(state, { payload: {data} }) {
      return {
        ...state,
        list: data,
      }
    },

    menu(state, { payload: {data} }) {
      return {
        ...state,
        menu: data instanceof Array ? data : [],
      }
    },
    
  },
}