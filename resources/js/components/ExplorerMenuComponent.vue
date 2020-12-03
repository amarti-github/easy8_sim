<template>
<div>
  <div class="section no-sep">Directorio</div>
  <ul>
    <li><a class="clickable" v-on:click="newFolder()"><i class="fas fa-folder"></i>Nueva carpeta</a></li>
    <li><a class="clickable" v-on:click="newProgram()"><i class="fas fa-file-alt"></i>Nuevo programa</a></li>
  </ul>
  <template v-if="$store.state.explorer.selectionCount > 0">
    <div class="section">Selección ({{ $store.state.explorer.selectionCount }})</div>
    <ul>
      <li v-if="$store.state.explorer.uniqueSelectedEntry && $store.state.explorer.uniqueSelectedEntry.folder"><a class="clickable" v-on:click="editSelectedEntry()"><i class="fas fa-info-circle"></i>Propiedades</a></li>
      <!--<li v-if="$store.state.explorer.uniqueSelectedEntry && $store.state.explorer.uniqueSelectedEntry.source"><a class="clickable" v-on:click="sendSelectedEntry()"><i class="fas fa-envelope"></i>Enviar</a></li>-->
      <li><a class="clickable" v-on:click="cutSelectedEntries()"><i class="fas fa-cut"></i>Cortar</a></li>
      <li v-if="$store.getters.cuttedEntries.length > 0"><a class="clickable" v-on:click="pasteEntries()"><i class="fas fa-paste"></i>Pegar</a></li>
      <li><a class="clickable" v-on:click="deleteSelectedEntries()"><i class="fas fa-trash"></i>Eliminar</a></li>
    </ul>
  </template>
  <template v-if="$store.getters.cuttedEntries.length > 0 && $store.state.explorer.selectionCount == 0">
    <div class="section">Ficheros ({{ $store.getters.cuttedEntries.length }})</div>
    <ul><li><a class="clickable" v-on:click="pasteEntries()"><i class="fas fa-paste"></i>Pegar</a></li></ul>
  </template>
  <div class="section">Cuenta</div>
  <ul>
    <li><a v-on:click="logout()" class="clickable"><i class="fas fa-sign-out-alt"></i>Cerrar sesión</a></li>
  </ul>
</div>
</template>

<script>
import resources from '../resources';
export default {
  data: function () {
    return {
    }
  },
  methods: {
    newFolder: function () {
        var name = prompt('Nombre de la carpeta');

        this.$store.dispatch('createFolder', { name: name }).then((response) => {
          this.$toasted.success('Carpeta creada.', { duration: 3500 });
        }, (response) => {
          this.$toasted.error('No se pudo crear la carpeta. ' + resources.takeFirstError(response), { duration: 3500 });
        });
    },

    newProgram: function () {
      var name = prompt('Nombre del fichero:');
      if (!name.endsWith('.asm')) {
        name += '.asm';
      }

      this.$store.dispatch('createSource', { name: name }).then((response) => {
        this.$toasted.success('Programa creado.', { duration: 3500 });
      }, (response) => {
        this.$toasted.error('No se pudo crear el programa. ' + resources.takeFirstError(response), { duration: 3500 });
      });;
    },

    cutSelectedEntries: function() {
      this.$store.dispatch('cutSelectedEntries');
    },

    pasteEntries: function () {
      this.$store.dispatch('pasteEntries');
    },

    deleteSelectedEntries: function () {
      if (confirm("¿Seguro que quieres eliminar la selección?")) {
        this.$store.dispatch('deleteSelectedEntries');
      }
    },

    editSelectedEntry: function () {
      this.$store.dispatch('editSelectedEntry');
    },

    logout: function () {
      this.$store.dispatch('logout');
      this.$router.push({ name: 'login' });
    },
  }
};
</script>

<style>
  i {
    width: 15px;
  }
</style>
