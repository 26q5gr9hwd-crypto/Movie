import { defineStore } from 'pinia'
import { PLAYER_STORE_NAME } from '../constants'
import { beforeHydrateLegacyVuex } from '../utils'

export const usePlayerStore = defineStore(PLAYER_STORE_NAME, {
  state: () => ({
    preferredPlayer: null,
    aspectRatio: '16:9',
    isCentered: false,
    showFavoriteTooltip: true,
    compressorEnabled: false,
    mirrorEnabled: false
  }),

  actions: {
    updatePreferredPlayer(player) {
      this.preferredPlayer = player
    },
    updateAspectRatio(ratio) {
      this.aspectRatio = ratio
    },
    updateCentering(value) {
      this.isCentered = value
    },
    setFavoriteTooltip(value) {
      this.showFavoriteTooltip = value
    },
    updateCompressor(value) {
      this.compressorEnabled = value
    },
    updateMirror(value) {
      this.mirrorEnabled = value
    }
  },

  persist: {
    key: PLAYER_STORE_NAME,
    beforeHydrate: beforeHydrateLegacyVuex
  }
})
