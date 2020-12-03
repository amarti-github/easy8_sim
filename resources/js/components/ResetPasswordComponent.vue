<template>
  <div class="login-area lshadow">
    <h1>Cambiar contraseña</h1>

    <form v-on:submit="resetPassword">
      <div class="input-block">
        <label for="password">Contraseña</label>
        <input id="password" name="password" class="input wide big" type="password" v-model="data.password">
      </div>
      <div class="input-block">
        <label for="password-confirmation">Repetir contraseña</label>
        <input id="password-confirmation" name="password" class="input wide big" type="password" v-model="data.password_confirmation">
      </div>

      <div style="text-align: right">
        <button class="btn primary">Cambiar contraseña</button>
      </div>

    </form>

  </div>
</template>

<script>

import resources from '../resources';

export default {
  data: function () {
    return {
      data: {
          password: '',
          password_confirmation: '',
      },
    }
  },
  methods: {
    resetPassword: function (ev) {
      resources.passwordReset.save({ rememberToken: this.$route.query.remember_token }, this.data).then((response) => {
        this.$toasted.success('Contraseña actualizada con éxito.', { duration: 10000 });
        this.$router.push({ name: 'login' });
      }, (response) => {
        this.$toasted.error(resources.takeFirstError(response), { duration: 5000 });
      });

      ev.preventDefault();
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

</style>
