<template>
  <div class="login-area lshadow">
    <h1>Iniciar sesión</h1>

    <form v-on:submit="authenticate">
      <alert type="error" v-bind:visible="showLoginError">
        {{ loginErrorMessage }}
      </alert>
      <alert type="success" v-bind:visible="registerSuccess">
        Se ha enviado un correo de verificación a tu correo electrónico. Accede a él para verificar tu cuenta.
      </alert>
      <div class="input-block">
        <label for="email">Correo electrónico</label>
        <input id="email" name="email" class="input wide big" v-model="login.email">
      </div>

      <div class="input-block">
        <label for="password">Contraseña</label>
        <input id="password" name="password" class="input wide big" type="password" v-model="login.password">
      </div>

      <div style="display: flex; align-items: center">
        <a class="reset-password-link" v-on:click="showResetPassword = !showResetPassword; resetPassword.email = login.email">Recuperar contraseña</a>
        <div style="flex-grow: 1"></div>
        <button class="btn primary">Iniciar sesión</button>
      </div>
    </form>

    <form v-if="showResetPassword" v-on:submit="resetPasswordRequest">
      <div class="input-block">
        <label for="reset-password-email">Correo electrónico</label>
        <input id="reset-password-email" name="email" class="input wide big" v-model="resetPassword.email">
      </div>

      <div style="text-align: right">
        <button class="btn">Recuperar</button>
      </div>

    </form>

    <div class="create-account-area">
      <router-link v-bind:to="{ name: 'register' }">Crear una cuenta</router-link>
    </div>

  </div>
</template>

<script>
import Alert from './AlertComponent.vue';
import resources from '../resources';

export default {
  data: function () {
    return {
      login: {
        email: '',
        password: ''
      },
      resetPassword: {
        email: ''
      },
      showLoginError: false,
      loginErrorMessage: '',
      registerSuccess: false,
      showResetPassword: false
    }
  },
  methods: {
    authenticate: function (ev) {
      var self = this;

      this.$store.dispatch('login', this.login).then(function (response) {
        self.$router.push({ name: 'explorer' });
        self.showLoginError = false;
      }).catch(function (response) {
        console.log(response);
        self.showLoginError = true;
        self.loginErrorMessage = response.body.message;
        console.log('Error');
      });

      ev.preventDefault();
    },

    resetPasswordRequest: function (ev) {
      ev.preventDefault();

      this.$toasted.info('Enviando mensaje de recuperación...', { duration: 6000 });
      resources.passwordReset.save({}, this.resetPassword).then((response) => {
        console.log(response);
        this.$toasted.success('Se ha enviado un mensaje para recuperar la contraseña.', { duration: 6000 });
      }, () => {
        this.$toasted.error('No se ha podido enviar el correo de recuperación.', { duration: 6000 });
      });
    }
  },
  created: function () {
    if (this.$route.query.email) {
        this.login.email = this.$route.query.email;
        this.registerSuccess = true;
    }

    if (this.$route.query.confirmation_token && this.$route.query.user_id) {
      this.$http.post('user/' + this.$route.query.user_id + '/confirm' , {}, { params: {
        confirmation_token: this.$route.query.confirmation_token
      }}).then((response) => {
        this.$store.dispatch('loginWithToken', response.body.api_token);
        this.$router.push({ name: 'explorer' });
      }, (response) => {
        this.$toasted.error('Código de validación incorrecto.');
      });
    }
  }
}
</script>

<style scoped>

.login-area {
  width: 500px;
  margin: 65px auto;
  padding: 25px 30px 30px 30px;
  background-color: white;
}

.login-area h1 {
  font-size: 100%;
  color: #505050;
  margin: 0px 0px 20px 0px;
  letter-spacing: 1px;
}

.input-block {
  margin-bottom: 15px;
}

.create-account-area {
  border-top: solid 1px #d9d9d9;
  margin-top: 25px;
  padding-top: 25px;
  text-align: center;
}

.create-account-area a {
  color: #3480e4;
  font-size: 120%;
  font-weight: bold;
  text-decoration: none;
  border-bottom: solid 1px #3787f1;
}

.reset-password-link {
  color: #3063bb;
  cursor: pointer;
}

</style>
