import Vue from 'vue';

export default {
  state: {
    authenticated: false,
    token: ''
  },

  mutations: {
    authenticate: function (state) {
      state.authenticated = true;
    },

    logout: function (state) {
      state.authenticated = false;
    },

    setToken: function (state, token) {
      state.token = token;
    },
  },

  actions: {
    login: function (context, data) {
      var login = new Vue.resource('login');

      return login.save({}, data).then(function (response) {
        context.dispatch('loginWithToken', response.body.api_token);
      });
    },

    loginWithToken: function (context, token) {
      context.commit('setToken', token);
      context.commit('authenticate');
      window.localStorage.setItem('token', token);
      Vue.http.headers.common['Authorization'] = 'Bearer ' + token;
    },

    logout: function (context) {
      window.localStorage.removeItem('token');
      context.commit('logout');
    },
  }
}