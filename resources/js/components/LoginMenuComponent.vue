<template>
<div>  
  <div class="section no-sep">Usuarios</div>
  <ul>
    <li><router-link v-bind:to="{ name: 'login' }">Iniciar sesión</router-link></li>
    <li><router-link v-bind:to="{ name: 'register' }">Registro</router-link></li>
  </ul>

  <div class="section">Ayuda</div>
  <ul>
    <li>
      <a href="#">Easy8</a>
      <ul>
        <li><a href="#">Set de instrucciones</a></li>
        <li><a href="#">Periféricos</a></li>
      </ul>
    </li>
    <li><a href="#">Acerca de</a></li>
  </ul>
</div>
</template>

<script>
export default {

}
</script>

<style>

</style>
