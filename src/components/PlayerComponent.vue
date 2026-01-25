<template>
  <ErrorMessage
    v-if="errorMessage"
    :message="errorMessage"
    :code="errorCode"
  />

  <template v-else>
    <!-- Минималистичный селектор плеера -->
    <div class="player-selector">
      <button class="player-selector-btn" @click="openPlayerModal">
        <span class="material-icons">play_circle</span>
        <span class="player-name">
          {{
            selectedPlayerInternal
              ? cleanName(selectedPlayerInternal.translate)
              : 'Выбрать плеер'
          }}
        </span>
        <span class="material-icons chevron">expand_more</span>
      </button>
    </div>

    <!-- Модальное окно выбора плеера -->
    <PlayerModal
      v-if="showPlayerModal"
      :players="playersInternal"
      :selected-player="selectedPlayerInternal"
      @close="closePlayerModal"
      @select="handlePlayerSelect"
    />

    <!-- Единый контейнер плеера -->
    <div
      ref="containerRef"
      :class="['player-container', { 'theater-mode': theaterMode }]"
      :style="!theaterMode ? containerStyle : {}"
    >
      <div
        class="iframe-wrapper"
        :style="!theaterMode ? iframeWrapperStyle : {}"
      >
        <iframe
          v-show="!iframeLoading && selectedPlayerInternal?.iframe"
          ref="playerIframe"
          :src="selectedPlayerInternal?.iframe"
          frameborder="0"
          allowfullscreen
          webkitallowfullscreen
          class="responsive-iframe"
          :class="{
            'theater-mode-unlock': closeButtonVisible,
            'theater-mode-lock': theaterMode,
            dimmed: dimmingEnabled
          }"
          @load="onIframeLoad"
        ></iframe>
        <SpinnerLoading
          v-if="iframeLoading"
          :text="`Загружается плеер: ${selectedPlayerInternal ? cleanName(selectedPlayerInternal.translate) : 'Загружается список плееров'}\nЕсли плеер не грузится, то смените плеер выше или включите VPN`"
          style="white-space: pre-line"
        />
      </div>

      <!-- Кнопка закрытия в театральном режиме -->
      <button
        v-if="theaterMode"
        class="close-theater-btn"
        :class="{ visible: closeButtonVisible }"
        @click="toggleTheaterMode"
      >
        ✖
      </button>
    </div>

    <!-- Кнопка избранного -->
    <div v-if="!theaterMode && kp_id" class="favorite-action">
      <button
        class="favorite-heart-btn"
        :class="{ active: movieInfo?.lists?.isFavorite }"
        @click="toggleList(USER_LIST_TYPES_ENUM.FAVORITE)"
      >
        <span class="material-icons">
          {{
            movieInfo?.lists?.isFavorite
              ? 'favorite'
              : 'favorite_border'
          }}
        </span>
        <span class="favorite-text">
          {{
            movieInfo?.lists?.isFavorite
              ? 'В избранном'
              : 'В избранное'
          }}
        </span>
      </button>
    </div>

    <Notification ref="notificationRef" />
  </template>
</template>

<script setup>
import { getPlayers, getShikiPlayers } from '@/api/movies'
import { handleApiError } from '@/constants'
import { addToList, delFromList } from '@/api/user'
import ErrorMessage from '@/components/ErrorMessage.vue'
import SpinnerLoading from '@/components/SpinnerLoading.vue'
import Notification from '@/components/notification/ToastMessage.vue'
import { useMainStore } from '@/store/main'
import { usePlayerStore } from '@/store/player'
import { useAuthStore } from '@/store/auth'
import { USER_LIST_TYPES_ENUM } from '@/constants'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PlayerModal from '@/components/PlayerModal.vue'

const mainStore = useMainStore()
const playerStore = usePlayerStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const kp_id = ref(route.params.kp_id)

const props = defineProps({
  kpId: String,
  movieInfo: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:selectedPlayer', 'update:movieInfo'])

const playersInternal = ref([])
const selectedPlayerInternal = ref(null)
const iframeLoading = ref(true)
const theaterMode = ref(false)
const closeButtonVisible = ref(false)
const playerIframe = ref(null)
const containerRef = ref(null)
const showPlayerModal = ref(false)

// Переменные для ошибок
const errorMessage = ref('')
const errorCode = ref(null)

const maxPlayerHeightValue = ref(window.innerHeight * 0.9)
const maxPlayerHeight = computed(
  () => `${maxPlayerHeightValue.value}px`
)
const isMobile = computed(() => mainStore.isMobile)

const notificationRef = ref(null)

const aspectRatio = computed({
  get: () => playerStore.aspectRatio,
  set: (value) => playerStore.updateAspectRatio(value)
})

const isCentered = computed({
  get: () => playerStore.isCentered,
  set: (value) => playerStore.updateCentering(value)
})

const preferredPlayer = computed(() => playerStore.preferredPlayer)
const naturalHeight = ref(0)

const normalizeKey = (key) => key.toUpperCase()

const updateScaleFactor = () => {
  if (theaterMode.value || !containerRef.value) return
  const [w, h] = aspectRatio.value.split(':').map(Number)
  maxPlayerHeightValue.value = window.innerHeight * 0.9
  naturalHeight.value = Math.min(
    (containerRef.value.clientWidth * h) / w,
    maxPlayerHeightValue.value
  )
}

const containerStyle = computed(() => {
  if (theaterMode.value) return {}
  const [w, h] = aspectRatio.value.split(':').map(Number)
  const maxWidth = maxPlayerHeightValue.value * (w / h)
  return {
    width: '100%',
    maxWidth: `${maxWidth}px`,
    maxHeight: maxPlayerHeight.value,
    margin: '0 auto',
    overflow: 'hidden'
  }
})

const iframeWrapperStyle = computed(() => {
  const [w, h] = aspectRatio.value.split(':').map(Number)
  return {
    position: 'relative',
    width: '100%',
    paddingTop: `${(h / w) * 100}%`
  }
})

const centerPlayer = () => {
  if (containerRef.value) {
    setTimeout(() => {
      nextTick(() => {
        containerRef.value.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        })
      })
    }, 500)
  }
}

const fetchPlayers = async () => {
  try {
    errorMessage.value = ''
    errorCode.value = null

    let players
    if (props.kpId.startsWith('shiki')) {
      const cleanShikiId = props.kpId.replace('shiki', '')
      players = await getShikiPlayers(cleanShikiId)
    } else {
      players = await getPlayers(props.kpId)
    }

    playersInternal.value = Object.entries(players).map(([key, value]) => ({
      key: key.toUpperCase(),
      ...value
    }))
    if (playersInternal.value.length > 0) {
      if (preferredPlayer.value) {
        const normalizedPreferred = normalizeKey(
          preferredPlayer.value
        )
        const preferred = playersInternal.value.find(
          (player) =>
            normalizeKey(player.key) === normalizedPreferred
        )
        selectedPlayerInternal.value =
          preferred || playersInternal.value[0]
      } else {
        selectedPlayerInternal.value = playersInternal.value[0]
      }
      emit('update:selectedPlayer', selectedPlayerInternal.value)
    }
  } catch (error) {
    const { message, code } = handleApiError(error)
    errorMessage.value = message
    errorCode.value = code
    console.error('Ошибка при загрузке плееров:', error)
  }
}

const openPlayerModal = () => {
  showPlayerModal.value = true
}

const closePlayerModal = () => {
  showPlayerModal.value = false
}

const toggleTheaterMode = () => {
  theaterMode.value = !theaterMode.value
  if (theaterMode.value) {
    window.addEventListener('mousemove', showCloseButton)
    document.addEventListener('keydown', onKeyDown)
    document.body.classList.add('no-scroll')
  } else {
    window.removeEventListener('mousemove', showCloseButton)
    document.removeEventListener('keydown', onKeyDown)
    document.body.classList.remove('no-scroll')
  }
  closeButtonVisible.value = theaterMode.value
  nextTick(() => {
    centerPlayer()
    if (playerIframe.value) {
      playerIframe.value.focus()
    }
  })
}

const theaterModeCloseButtonTimeout = ref(null)
const showCloseButton = () => {
  theaterModeCloseButtonTimeout.value = setTimeout(() => {
    clearTimeout(theaterModeCloseButtonTimeout.value)
    closeButtonVisible.value = false
  }, 4000)
  closeButtonVisible.value = true
}

const dimmingEnabled = computed(() => mainStore.dimmingEnabled)

const onIframeLoad = () => {
  iframeLoading.value = false
}

const onKeyDown = (event) => {
  if (event.key === 'Escape' && theaterMode.value) {
    toggleTheaterMode()
  } else if (event.altKey && event.keyCode === 84) {
    toggleTheaterMode()
  }
}

function cleanName(name) {
  const cleanedName = name
    .replace(/KODIK>/, 'Kodik - ')
    .replace(/VEOVEO>/, 'VeoVeo - ')
    .trim()
  return cleanedName
}

const handlePlayerSelect = (player) => {
  if (selectedPlayerInternal.value?.key === player.key) {
    closePlayerModal()
    return
  }

  selectedPlayerInternal.value = player
  iframeLoading.value = true
  if (!player.key.toLowerCase().includes('torrents')) {
    playerStore.updatePreferredPlayer(normalizeKey(player.key))
  }
  emit('update:selectedPlayer', player)
}

watch(selectedPlayerInternal, (newVal) => {
  if (newVal) {
    iframeLoading.value = true
    if (!newVal.key.toLowerCase().includes('torrents')) {
      playerStore.updatePreferredPlayer(normalizeKey(newVal.key))
    }
    emit('update:selectedPlayer', newVal)
  }
})

watch(
  () => route.params.kp_id,
  async (newKpId) => {
    if (newKpId && newKpId !== kp_id.value) {
      kp_id.value = newKpId
      if (isCentered.value) centerPlayer()
    }
  },
  { immediate: true }
)

const getListStatus = (listType) => {
  const statusMap = {
    [USER_LIST_TYPES_ENUM.FAVORITE]:
      props.movieInfo?.lists?.isFavorite || false,
    [USER_LIST_TYPES_ENUM.HISTORY]:
      props.movieInfo?.lists?.isHistory || false,
    [USER_LIST_TYPES_ENUM.LATER]:
      props.movieInfo?.lists?.isLater || false,
    [USER_LIST_TYPES_ENUM.COMPLETED]:
      props.movieInfo?.lists?.isCompleted || false,
    [USER_LIST_TYPES_ENUM.ABANDONED]:
      props.movieInfo?.lists?.isAbandoned || false,
    [USER_LIST_TYPES_ENUM.WATCHING]:
      props.movieInfo?.lists?.isWatching || false
  }

  return statusMap[listType] ?? false
}

const toggleList = async (type) => {
  if (!authStore.token) {
    notificationRef.value.showNotification(
      'Необходимо <a class="auth-link">авторизоваться</a>',
      5000,
      { onClick: openLogin }
    )
    return
  }
  let hasError = false
  try {
    const listNames = {
      [USER_LIST_TYPES_ENUM.FAVORITE]: 'избранное'
    }

    if (getListStatus(type)) {
      await delFromList(kp_id.value, type)
      notificationRef.value.showNotification(
        `Удалено из ${listNames[type]}`
      )
    } else {
      await addToList(kp_id.value, type)
      notificationRef.value.showNotification(
        `Добавлено в ${listNames[type]}`
      )
    }
  } catch (error) {
    const { message, code } = handleApiError(error)
    notificationRef.value.showNotification(`${message} ${code}`)
  }
  if (!hasError) {
    emit('update:movieInfo')
  }
}

const openLogin = () => {
  router.push('/login')
}

onMounted(() => {
  iframeLoading.value = true
  fetchPlayers()
  if (isMobile.value) aspectRatio.value = '4:3'
  updateScaleFactor()
  window.addEventListener('resize', updateScaleFactor)
  if (isCentered.value) centerPlayer()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScaleFactor)
  window.removeEventListener('mousemove', showCloseButton)
  document.removeEventListener('keydown', onKeyDown)
  document.body.classList.remove('no-scroll')
})
</script>

<style scoped>
/* Минималистичный селектор плеера */
.player-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.player-selector-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.player-selector-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--accent-color);
  color: #fff;
}

.player-selector-btn .material-icons {
  font-size: 20px;
}

.player-selector-btn .chevron {
  font-size: 18px;
  opacity: 0.6;
}

.player-name {
  font-weight: 500;
}

/* Стильная кнопка избранного */
.favorite-action {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.favorite-heart-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 10px 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-heart-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.favorite-heart-btn.active {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
  color: #ef4444;
}

.favorite-heart-btn .material-icons {
  font-size: 22px;
  transition: transform 0.2s ease;
}

.favorite-heart-btn:hover .material-icons {
  transform: scale(1.1);
}

.favorite-heart-btn.active .material-icons {
  animation: heartPulse 0.3s ease;
}

@keyframes heartPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.favorite-text {
  font-weight: 500;
}

/* Player container */
.player-container {
  width: 100%;
  transition:
    max-width 0.3s ease-in-out,
    max-height 0.3s ease-in-out;
  overflow: hidden;
  padding-bottom: 10px;
}

.iframe-wrapper {
  transition:
    padding-top 0.3s ease-in-out,
    transform 0.3s ease-in-out;
  width: 100%;
}

.responsive-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  z-index: 4;
}

.responsive-iframe.dimmed {
  z-index: 7;
}

/* Стили для театрального режима */
.player-container.theater-mode {
  position: fixed;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: #000;
  margin: 0;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 7;
}

.player-container.theater-mode .iframe-wrapper {
  width: 100% !important;
  height: 100% !important;
  padding-top: 0 !important;
  flex-grow: 1;
}

.close-theater-btn {
  position: fixed;
  top: 20px;
  right: 80px;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition:
    background 0.3s,
    opacity 0.3s;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  z-index: 8;
}

.close-theater-btn.visible {
  opacity: 1;
}

.close-theater-btn:hover {
  background: var(--accent-color);
  opacity: 1;
}

html.no-scroll {
  overflow: hidden;
}

.theater-mode-lock {
  pointer-events: none;
}

.theater-mode-unlock {
  pointer-events: all;
}

.material-icons {
  font-size: 24px;
}

.auth-link {
  color: var(--accent-color);
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.auth-link:hover {
  color: var(--accent-hover);
}
</style>
