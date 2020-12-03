import resources from  '../resources';
import Vue from 'vue';
import Entry from '../entry';

export default {
  state: {
    folders: [],
      sources: [],
      breadcrumbs: [],
      selectionCount: 0,
      uniqueSelectedEntry: null,
      loading: false,
      editingEntry: null,
      cutEntries: [],
  },

  getters: {
    cwd: function (state) {
      return state.breadcrumbs[state.breadcrumbs.length - 1];
    },
    inRoot: function (state) {
      return state.breadcrumbs.length == 1;
    },
    loading: function (state) {
      return state.loading;
    },
    cuttedEntries: function (state) {
      return state.cutEntries;
    }
  },

  mutations: {
    incrementSelectionCount: function (state) {
      state.selectionCount++;
    },

    decrementSelectionCount: function (state) {
      state.selectionCount--;
    },

    setSelectionCount: function (state, value) {
      state.selectionCount = value;
    }
  },

  actions: {
    ////////////////////////////////////////////////////////
    ///          FILE CREATION AND MODIFICATION          ///

    // Creates a folder in the current working directory and
    // reloads.
    createFolder: function (context, data) {
      if (!data.name) return;

      data.parent_id = context.state.breadcrumbs[context.state.breadcrumbs.length - 1].id;
      return resources.folder.save({}, data).then(function (response) {
        // To update  the folders:
        context.dispatch('loadFolders', data.parent_id);
      });
    },

    createSource: function (context, data) {
      if (!data.name) return;

      data.parent_id = context.state.breadcrumbs[context.state.breadcrumbs.length - 1].id;

      return resources.source.save({}, data).then(function (response) {
        // To update  the folders:
        context.dispatch('loadSources', data.parent_id);
      });
    },

    // Updates the opened file.
    updateEditingFolder: function (context) {
      resources.folder.save({ entryId: context.state.editingEntry.id }, context.state.editingEntry).then(function (response) {
        // To update  the folders:
        context.dispatch('listDirectory', context.getters.cwd.id);
      })
    },

    cutSelectedEntries: function (context) {
      context.state.cutEntries.splice(0, context.state.cutEntries.length);
      var entries = context.state.folders.concat(context.state.sources);
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].selected) {
          context.state.cutEntries.push(entries[i]);
          Vue.set(entries[i], 'cutting', true);
          console.log(entries[i].name);
        }
      }
    },

    pasteEntries: function (context) {
      for (var i = 0; i < context.state.cutEntries.length; i++) {
        var entry = context.state.cutEntries[i];
        resources.entry.save({ entryId: entry.id }, { parent_id: context.getters.cwd.id });
      }
      context.state.cutEntries.splice(0, context.state.cutEntries.length);
      context.dispatch('listDirectory', context.getters.cwd.id);
    },

    deleteSelectedEntries: function (context) {
      var promises = [];
      for (var i = 0; i < context.state.folders.length; i++) {
        if (context.state.folders[i].selected) {
          promises.push(context.dispatch('deleteFolder', context.state.folders[i].id));
        }
      }

      for (var i = 0; i < context.state.sources.length; i++) {
        if (context.state.sources[i].selected) {
          promises.push(context.dispatch('deleteSource', context.state.sources[i].id));
        }
      }

      Promise.all(promises).then(function () {
        // Reload current directory.
        context.dispatch('listDirectory', context.state.breadcrumbs[context.state.breadcrumbs.length - 1].id);
      });
    },

    deleteFolder: function (context, id) {
      return resources.folder.delete({ entryId: id });
    },

    deleteSource: function (context, id) {
      return resources.source.delete({ entryId: id });
    },

    ////////////////////////////////////////////////////////
    ///                    NAVIGATION                    ///

    // Loads folders contained in the id entry. Does not update
    // the breadcrumbs.
    loadFolders: function (context, id) {
      return resources.folder.get({ parent_id: id }).then(function (response) {
        context.state.folders = response.body;
      });
    },

    // Loads sources contained in the id entry. Does not update
    // the breadcrumbs.
    loadSources: function (context, id) {
      return resources.source.get({ parent_id: id }).then(function (response) {
        context.state.sources = response.body;
      });
    },

    loadSource: function (context, id) {
      return resources.source.get({ entryId: id });
    },

    // Loads folders and sources. Doesn't modifies the breadcrumbs. Use
    // enterDirectory and leaveDirectory.
    listDirectory: function (context, id) {
      context.state.loading = true;
      Promise.all([
        context.dispatch('loadFolders', id),
        context.dispatch('loadSources', id)]).then(function () {
        context.state.loading = false;
        context.dispatch('clearSelection');
      });
    },

    enterDirectory: function (context, entry) {
      context.state.folders = [];
      context.state.sources = [];

      context.state.breadcrumbs.push(entry);
      context.dispatch('listDirectory', entry.id);

    },

    leaveDirectory: function (context, breadcrumbIndex) {
      if (breadcrumbIndex == -1) { breadcrumbIndex = context.state.breadcrumbs.length - 2; }
      context.state.folders = [];
      context.state.sources = [];

      context.state.breadcrumbs.splice(breadcrumbIndex + 1, context.state.breadcrumbs.length - breadcrumbIndex);
      context.dispatch('listDirectory', context.state.breadcrumbs[breadcrumbIndex].id);
    },

    select: function (context, entry) {
      if (entry.selected) {
        entry.selected = false;
        context.commit('decrementSelectionCount');
      }
      else {
        Vue.set(entry, 'selected', true);
        context.commit('incrementSelectionCount');
      }

      if (context.state.selectionCount == 1) {
        for (var i = 0; i < context.state.folders.length; i++) {
          if (context.state.folders[i].selected) {
            context.state.uniqueSelectedEntry = context.state.folders[i];
            break;
          }
        }

        for (var i = 0; i < context.state.sources.length; i++) {
          if (context.state.sources[i].selected) {
            context.state.uniqueSelectedEntry = context.state.sources[i];
            break;
          }
        }
      }
      else {
        context.state.uniqueSelectedEntry = null;
      }
    },

    editSelectedEntry: function (context) {
      context.state.editingEntry = Entry.clone(context.state.uniqueSelectedEntry);
    },

    clearSelection: function (context) {
      context.commit('setSelectionCount', 0);
      context.state.uniqueSelectedEntry = null;
    },

    logout: function (context) {
      // Es importante limpiar el directorio cuando se hace logout
      // porque si no, si otro usuario iniciara sesión, tendría problemas
      // porque su sistema de ficheros tendría cosas de otro usuario.
      context.state.folders.splice(0, context.state.folders.length);
      context.state.sources.splice(0, context.state.sources.length);
      context.state.breadcrumbs.splice(0, context.state.breadcrumbs.length);
    }
  }
}