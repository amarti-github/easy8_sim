import resources from '../resources';

export default {
  state: {
    entry: null,
    content: '',
    view: 'editor',

    assembler: null,
  },

  getters: {
    currentView(state) {
      return state.view;
    }
  },

  mutations: {
    setView(state, view) {
      state.view = view;
    }
  },

  actions: {
    setView(context, view) {
      context.commit('setView', view);
    },
    goToSimulator(context) {
      context.dispatch('setView', 'simulator');
    },
    goToEditor(context) {
      context.dispatch('setView', 'editor');
    },
    switchView(context) {
      context.commit('setView', context.state.view == 'simulator' ? 'editor' : 'simulator');
    },
    updateSource: function (context) {
      console.log('hola');
      console.log(context);
      return resources.source.save({ entryId: context.state.entry.id }, {
          content: context.state.content
        }).then(function (response) {
      });
    },
  }
}