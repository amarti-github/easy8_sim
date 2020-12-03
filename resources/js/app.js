import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex'
import VueResource from 'vue-resource';
import VueToasted from 'vue-toasted';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(VueToasted);

//////////////////////////////////////////
///             API CONFIG             ///
//////////////////////////////////////////

Vue.http.options.root = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + '/api';

//////////////////////////////////////////
///               ROUTER               ///
//////////////////////////////////////////
Vue.component('alert', require('./components/AlertComponent.vue').default);

const routes = [
  {
    name: 'register',
    path: '/register',
    components: {
        'main-view': require('./components/RegisterComponent.vue').default,

    },
    meta: { requiresAuth: false, redirectIfAuthenticated: true }
  },
  {
    name: 'login',
    path: '/login',
    components: {
      'main-view': require('./components/LoginComponent.vue').default
    },
    meta: { requiresAuth: false, redirectIfAuthenticated: true }
  },
  {
    name: 'reset-password',
    path: '/reset-password',
    components: {
      'main-view': require('./components/ResetPasswordComponent.vue').default,

    },
    meta: { requiresAuth: false, redirectIfAuthenticated: true }
  },
  {
    name: 'explorer',
    path: '/explorer',
    components: {
      'main-view': require('./components/ExplorerComponent.vue').default
    },
    meta: { requiresAuth: true }
  },

  {
    name: 'simulator',
    path: '/simulator/:entryId?', alias: '/',
    components: {
      'main-view': require('./components/SimulatorComponent.vue').default
    },
    meta: { requiresAuth: false }
  },
];

const router = new VueRouter({
  routes: routes
});

//////////////////////////////////////////
///           GLOBAL STATE             ///
//////////////////////////////////////////

const store = new Vuex.Store(require('./store/store').default);

//////////////////////////////////////////
///             LOGIN CHECK            ///
//////////////////////////////////////////

router.beforeEach(function (to, from, next) {
  if (!store.state.login.authenticated && window.localStorage.getItem('token')) {
    store.dispatch('loginWithToken', window.localStorage.getItem('token'));
  }

  if (to.meta.redirectIfAuthenticated && store.state.login.authenticated === true) {
    next({ name: 'explorer' });
  }
  else if (to.meta.requiresAuth && store.state.login.authenticated === false && to.name != 'login') {
    next({ name: 'login' });
  }
  else {
    next();
  }
});

//////////////////////////////////////////
///     INTERCEPT UNAUTHENTICATED      ///
//////////////////////////////////////////

// Se introduce in interceptor para ejecutar una comprobación en cada petición
// HTTP. Lo que hace esa comprobación es revisar si la respuesta de la API es 401
// o 403 y, en ese caso, mandamos al usuario a la página de login.

Vue.http.interceptors.push(function(request) {
  return function(response) {
    if (response.status == 401 || response.status == 403) {
      store.dispatch('logout');
      router.push({ name: 'login' });
    }
  };
});

//////////////////////////////////////////
///            VUE INSTANCE            ///
//////////////////////////////////////////

const app = new Vue({
  /*el: '#app',*/
  router: router,
  store: store,
  resource: VueResource,
  data: {
    aboutModalVisible: false
  },
  created: function () {
  },
  mounted: function () {
  }
}).$mount('#app');
