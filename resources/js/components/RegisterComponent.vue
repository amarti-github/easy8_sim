<template>
  <div class="login-area lshadow">
    <h1>Iniciar sesión</h1>

    <form v-on:submit="register">

      <alert type="error" visible="true" v-bind:key="error" v-for="error in errors">{{ error }}</alert>

      <div class="input-block">
        <label for="name">Nombre</label>
        <input id="name" name="email" class="input wide big" v-model="registerData.name">
      </div>
      <div class="input-block">
        <label for="surname">Apellidos</label>
        <input id="surname" name="email" class="input wide big" v-model="registerData.surname">
      </div>
      <div class="input-block">
        <label for="email">Correo electrónico</label>
        <input id="email" name="email" class="input wide big" v-model="registerData.email">
      </div>
      <div class="input-block">
        <label for="password">Contraseña</label>
        <input id="password" name="password" class="input wide big" type="password" v-model="registerData.password">
      </div>
      <div class="input-block">
        <label for="password_confirmation">Repetir contraseña</label>
        <input id="password_confirmation" name="password" class="input wide big" type="password" v-model="registerData.password_confirmation">
      </div>

      <div style="text-align: right">
        <button class="btn primary" v-bind:disabled="blockButton">Crear cuenta</button>
      </div>

    </form>

  </div>
</template>

<script>

import resources from '../resources';

export default {
  data: function () {
    return {
      registerData: {
          email: '',
          password: '',
          password_confirmation: '',
          name: '',
          surname: ''
      },
      errors: [],
      blockButton: false,
    }
  },
  methods: {
    register: function (ev) {
      this.errors = [];
      this.blockButton = true;

      resources.user.save({}, this.registerData).then((response) => {
        this.$toasted.success('Cuenta creada con éxito.', { duration: 10000 });
        this.$router.push({ name: 'login', query: { email: this.registerData.email }});
      }, (response) => {
        this.$toasted.error(resources.takeFirstError(response), { duration: 5000 });
        this.blockButton = false;
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
