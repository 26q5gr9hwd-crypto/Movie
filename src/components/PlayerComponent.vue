<template>
  <div class="players-list">
    <span>Плеер:</span>
    <select v-model="selectedPlayerInternal" class="custom-select">
      <option v-for="(player, index) in playersInternal" :key="index" :value="player">
        {{ player.translate.toUpperCase() }}
      </option>
    </select>
  </div>

  <!-- Единый контейнер плеера -->
  <div :class="['player-container', { 'theater-mode': theaterMode }]">
    <div class="iframe-wrapper">
      <iframe
        ref="playerIframe"
        :src="selectedPlayerInternal?.iframe"
        frameborder="0"
        @load="onIframeLoad"
        allowfullscreen
        class="responsive-iframe"
      ></iframe>
      <SpinnerLoading v-if="iframeLoading" />
    </div>

    <!-- Кнопка закрытия в театральном режиме -->
    <button
      v-if="theaterMode"
      @click="toggleTheaterMode"
      class="close-theater-btn"
      :class="{'visible': closeButtonVisible}"
    >
      ✖
    </button>
  </div>

  <!-- Кнопка управления -->
  <div v-if="!isMobile" class="controls">
    <button @click="toggleTheaterMode" class="theater-mode-btn">
      {{ theaterMode ? 'Выйти из театрального режима' : 'Включить театральный режим' }}
    </button>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import SpinnerLoading from '@/components/SpinnerLoading.vue';

const props = defineProps({
  movieId: String,
  selectedPlayer: Object
});

const emit = defineEmits(['update:selectedPlayer']);

const playersInternal = ref([]);
const selectedPlayerInternal = ref(props.selectedPlayer);
const iframeLoading = ref(true);
const theaterMode = ref(false);
const closeButtonVisible = ref(false);
const playerIframe = ref(null);
const apiUrl = import.meta.env.VITE_APP_API_URL;

const isMobile = computed(() => window.innerWidth < 600);

const fetchPlayers = async () => {
  try {
    const response = await axios.post(
      `${apiUrl}/cache`,
      new URLSearchParams({
        kinopoisk: props.movieId,
        type: 'movie'
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    playersInternal.value = Object.values(response.data);
    if (playersInternal.value.length > 0) {
      selectedPlayerInternal.value = playersInternal.value[0];
      emit('update:selectedPlayer', selectedPlayerInternal.value);
    }
  } catch (error) {
    console.error('Ошибка при загрузке плееров:', error);
  }
};

const onIframeLoad = () => {
  iframeLoading.value = false;
};

const toggleTheaterMode = () => {
  theaterMode.value = !theaterMode.value;
  
  if (theaterMode.value) {
    document.addEventListener('mousemove', showCloseButton);
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('no-scroll');
  } else {
    document.removeEventListener('mousemove', showCloseButton);
    document.removeEventListener('keydown', onKeyDown);
    document.body.classList.remove('no-scroll');
  }
  
  closeButtonVisible.value = theaterMode.value;
};

const showCloseButton = (event) => {
  closeButtonVisible.value = event.clientY < 50;
};

const onKeyDown = (event) => {
  if (event.key === 'Escape' && theaterMode.value) {
    toggleTheaterMode();
  }
};

watch(selectedPlayerInternal, (newVal) => {
  iframeLoading.value = true;
  emit('update:selectedPlayer', newVal);
});

onMounted(() => {
  fetchPlayers();
});

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', showCloseButton);
  document.removeEventListener('keydown', onKeyDown);
  document.body.classList.remove('no-scroll');
});
</script>

<style scoped>
.players-list {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.custom-select {
  padding: 8px 16px;
  border: 1px solid #444;
  background-color: #1e1e1e;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  width: 100%;
}

.custom-select:hover {
  border-color: #666;
}

.custom-select:focus {
  border-color: #558839;
}

.player-container {
  position: relative;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.player-container.theater-mode {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: #000;
  margin: 0;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.player-container.theater-mode .iframe-wrapper {
  position: static;
  width: 100%;
  height: 100%;
  padding-top: 0;
  flex-grow: 1;
}

.iframe-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 56.25%; /* Сохраняем соотношение 16:9 */
}

.responsive-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.player-container.theater-mode .responsive-iframe {
  position: relative;
  height: 100%;
}

.close-theater-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 50%;
  cursor: pointer;
  transition: opacity 0.3s;
  z-index: 1001;
  opacity: 0;
}

.close-theater-btn.visible {
  opacity: 1;
}

.close-theater-btn:hover {
  background: rgba(255, 0, 0, 1);
}

.controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.theater-mode-btn {
  background-color: #444;
  color: #fff;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
  z-index: 10;
}

.theater-mode-btn:hover {
  background-color: #666;
}

@media (max-width: 599px) {
  .theater-mode-btn {
    display: none;
  }
}

.no-scroll {
  overflow: hidden;
}
</style>