export default {
  namespaced: true,
  state: {
    aspectRatio: '16:9',
    isCentered: false,
    preferredPlayers: [] // Массив строк, например: ['ALLOHA', 'TORRENTS', ...]
  },
  mutations: {
    setAspectRatio(state, ratio) {
      state.aspectRatio = ratio;
    },
    setCentering(state, isCentered) {
      state.isCentered = isCentered;
    },
    setPreferredPlayers(state, players) {
      state.preferredPlayers = players;
    },
    addPreferredPlayer(state, player) {
      state.preferredPlayers.push(player);
    },
    removePreferredPlayer(state, player) {
      // Удаляем по значению, т.к. player – строка (например, 'ALLOHA')
      state.preferredPlayers = state.preferredPlayers.filter(p => p !== player);
    }
  },
  actions: {
    updateAspectRatio({ commit }, ratio) {
      commit('setAspectRatio', ratio);
    },
    updateCentering({ commit }, isCentered) {
      commit('setCentering', isCentered);
    },
    updatePreferredPlayers({ commit }, players) {
      commit('setPreferredPlayers', players);
    },
    addPreferredPlayer({ commit }, player) {
      commit('addPreferredPlayer', player);
    },
    removePreferredPlayer({ commit }, player) {
      commit('removePreferredPlayer', player);
    }
  },
  getters: {
    aspectRatio: (state) => state.aspectRatio,
    isCentered: (state) => state.isCentered,
    preferredPlayers: (state) => state.preferredPlayers
  }
};
