import starsBackground from '@/assets/image-back-stars.png'
import { defineStore } from 'pinia'
import { BACKGROUND_STORE_NAME } from '../constants'
import { beforeHydrateLegacyVuex } from '../utils'

export const useBackgroundStore = defineStore(BACKGROUND_STORE_NAME, {
  state: () => ({
    backgroundUrl: '',
    moviePoster: '',
    isBlurActive: true,
    backgroundType: 'dynamic',
    defaultBackground: starsBackground,
    isCardBorder: false,
    isCardHoverDisabled: false,
    mainPagePoster: ''
  }),

  getters: {
    currentBackground: (state) => {
      if (state.backgroundType === 'dynamic') {
        return state.moviePoster || state.mainPagePoster || ''
      }
      return state.backgroundUrl
    }
  },

  actions: {
    updateMoviePoster(poster) {
      if (this.backgroundType === 'dynamic') {
        const url = poster || ''
        this.moviePoster = url
        if (url && this.backgroundUrl !== url) {
          this.backgroundUrl = url
        }
      }
    },

    updateMainPagePoster(poster) {
      if (this.backgroundType === 'dynamic') {
        this.mainPagePoster = poster || ''
        if (!this.moviePoster && poster) {
          this.backgroundUrl = poster
        }
      }
    },

    clearMoviePoster() {
      this.moviePoster = ''
      if (this.mainPagePoster) {
        this.backgroundUrl = this.mainPagePoster
      } else {
        this.backgroundUrl = ''
      }
    },

    toggleBlur(isActive) {
      if (this.backgroundType === 'dynamic') {
        this.isBlurActive = isActive
      }
    },

    updateBackgroundType(type) {
      this.SET_BACKGROUND_TYPE(type)
    },

    toggleCardBorder(isBorder) {
      this.isCardBorder = isBorder
    },

    toggleCardHover(isDisabled) {
      this.isCardHoverDisabled = isDisabled
    },

    resetBackground() {
      this.isBlurActive = true
      this.SET_BACKGROUND_TYPE('dynamic')
    },

    SET_BACKGROUND_TYPE(type) {
      this.backgroundType = type

      if (type === 'dynamic') {
        this.isBlurActive = true
      } else if (type === 'disabled') {
        this.isBlurActive = false
        this.backgroundUrl = ''
      } else if (type === 'stars') {
        this.isBlurActive = false
        this.backgroundUrl = this.defaultBackground
      } else if (type === 'lava-lamp') {
        this.isBlurActive = false
        this.backgroundUrl = ''
      }
    }
  },

  persist: {
    key: BACKGROUND_STORE_NAME,
    beforeHydrate: beforeHydrateLegacyVuex
  }
})
