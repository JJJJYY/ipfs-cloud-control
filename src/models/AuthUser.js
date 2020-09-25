import * as api from '../service/Api';

export default {
  namespace: 'authUser',

  state: {
    list: {},
    invitationList: {},
    inviteDetailList: {},
    userDetail: null,
  },

  effects: {
    *update({ payload }, { call }) {
      return yield call(api.authUserUpdate, payload);
    },

    *queryList({ payload }, { call, put }) {
      const data = yield call(api.authUserList, payload);
      yield put({ type: 'list', payload: { data: data } });
    },

    *queryInvitationList({ payload }, { call, put }) {
      const data = yield call(api.authUserInvitationList, payload);
      yield put({ type: 'invitationList', payload: { data: data } });
    },

    *queryInviteDetailList({ payload }, { call, put }) {
      const data = yield call(api.authUserInviteDetailList, payload);
      yield put({ type: 'inviteDetailList', payload: { data: data } });
    },

    *queryUserDetail({ payload }, { call, put }) {
      const data = yield call(api.authUserDetail, payload);
      yield put({ type: 'userDetail', payload: { data: data } });
      return data;
    },

    *userExport({ payload }, { call }) {
      return yield call(api.authUserExport, payload);
    },

    *invitationExport({ payload }, { call }) {
      return yield call(api.authUserInvitationExport, payload);
    },

    *inviteDetailExport({ payload }, { call }) {
      return yield call(api.authUserInviteDetailExport, payload);
    },
    
  },

  reducers: {
    list(state, { payload: {data} }) {
      return {
        ...state,
        list: data,
      }
    },

    invitationList(state, { payload: {data} }) {
      return {
        ...state,
        invitationList: data,
      }
    },

    inviteDetailList(state, { payload: {data} }) {
      return {
        ...state,
        inviteDetailList: data,
      }
    },

    userDetail(state, { payload: {data} }) {
      return {
        ...state,
        userDetail: data,
      }
    },
    
  },
}