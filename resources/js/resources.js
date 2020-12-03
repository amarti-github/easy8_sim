import Vue from 'vue';

export default {
  user: Vue.resource('user{/userId}'),
  folder: Vue.resource('folder{/entryId}'),
  source: Vue.resource('source{/entryId}'),
  entry:  Vue.resource('entry{/entryId}'),
  passwordReset: Vue.resource('password-reset{/rememberToken}'),


  takeFirstError: function (response) {
    if (response.body && response.body.errors) {
      return response.body.errors[Object.keys(response.body.errors)[0]];
    }
    else {
      return response.body.message;
    }
  },
}