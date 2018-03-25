import { API_ADDRESS } from '../config/connections';

const axios = require('axios');

export const POST_USER_REQUEST = 'POST_USER_REQUEST';
export const POST_USER_SUCCESS = 'POST_USER_SUCCESS';
export const POST_USER_FAILURE = 'POST_USER_FAILURE';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export function postUserFailure(bool) {
  return {
    type: 'POST_USER_FAILURE',
    hasErrored: bool,
    isLoggedIn: false,
  };
}
export function postUserLoading(bool) {
  return {
    type: 'POST_USER_REQUEST',
    isLoading: bool,
    isLoggedIn: false,
  };
}
export function postUserSuccess(user) {
  return {
    type: 'POST_USER_SUCCESS',
    isLoggedIn: true,
    user,
  };
}

export function loginSuccess() {
  return {
    type: 'LOGIN_SUCCESS',
  };
}

export function logoutSuccess(bool) {
  return {
    type: 'LOGOUT_SUCCESS',
    isLoggedIn: !bool,
  };
}

export function postUser(username, password) {
  return (dispatch) => {
    dispatch(postUserLoading(true));
    axios.post(API_ADDRESS + '/api/user/login', {
      Email: username,
      Password: password,
    })
      .then((response) => {
        dispatch(postUserLoading(false));
        return response.data;
      })
      .then((user) => {
        dispatch(postUserSuccess(user));
        dispatch(loginSuccess());
      })
      .catch(() => {
        dispatch(postUserFailure(true));
      });
  };
}

export function postCurrent() {
  return (dispatch) => {
    dispatch(postUserLoading(true));
    axios.get(API_ADDRESS + '/api/user/current')
      .then((response) => {
        dispatch(postUserLoading(false));
        return response.data;
      })
      .then((user) => {
        dispatch(postUserSuccess(user));
        dispatch(loginSuccess());
      })
      .catch(() => dispatch(postUserFailure(true)));
  };
}

export function logout() {
  return (dispatch) => {
    dispatch(postUserLoading(true));
    axios.get(API_ADDRESS + '/api/user/logout')
      .then(() => {
        dispatch(postUserLoading(false));
        dispatch(logoutSuccess(true));
      })
      .catch(() => dispatch(logoutSuccess(false)));
  };
}
