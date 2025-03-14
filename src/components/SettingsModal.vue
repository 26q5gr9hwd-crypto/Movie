<template>
  <div class="settings-page">
    <header class="settings-header">
      <button @click="goBack" class="back-button">← Назад</button>
      <h1>Настройки фона и плеера</h1>
    </header>

    <div class="settings-container">
      <div class="waaarn">Все настройки тестовые, если видите проблему, то сообщите, пожалуйста в телеграмм</div>

      <!-- Настройки фона -->
      <div class="setting-group">
        <h2>Тип фона</h2>
        <label class="radio">
          <input type="radio" value="dynamic" v-model="backgroundType" />
          <span class="radio-label">Динамический фон</span>
        </label>
        <label class="radio">
          <input type="radio" value="stars" v-model="backgroundType" />
          <span class="radio-label">Звездный фон</span>
        </label>
        <label class="radio">
          <input type="radio" value="none" v-model="backgroundType" />
          <span class="radio-label">Отключить фон</span>
        </label>
      </div>

      <!-- Включение/выключение размытия -->
      <div class="setting-item">
        <div class="toggle">
            <label class="switch">
              <input 
                type="checkbox" 
                v-model="isBlurEnabled"
              />
              <span class="slider round"></span>
            </label>
            <span class="label-text">Включить размытие</span>
          </div>
        </div>

      <!-- Автоцентрирование плеера -->
      <div class="setting-item">
        <div class="toggle">
            <label class="switch">
              <input 
                type="checkbox" 
                v-model="isCentered"
              />
              <span class="slider round"></span>
            </label>
            <span class="label-text">Автоцентрирование</span>
          </div>
        </div>

      <!-- Кнопка сброса фона -->
      <div class="settings-actions">
        <button @click="resetBackground" class="reset-button">Сбросить фон</button>
      </div>

      <!-- Раздел для выбранных плееров -->
      <div class="setting-group players-group" v-if="preferredPlayers.length">
        <h2>Выбранные плееры (перетащите, чтобы изменять порядок приоритета)</h2>
        <div class="players-grid">
          <div
            v-for="(player, index) in preferredPlayers"
            :key="player"
            class="player-tile selected"
            draggable="true"
            @dragstart="dragStart(player, index)"
            @dragover.prevent
            @drop="dropPlayer(index)"
          >
            <span>{{ player }}</span>
            <button class="remove-btn" @click.stop="removePlayer(player)">✖</button>
          </div>
        </div>
      </div>

      <!-- Раздел для всех плееров -->
      <div class="setting-group players-group" v-if="allPlayers.length">
        <h2>Все плееры (выберите для добавления в избранное)</h2>
        <div class="players-grid">
          <div
            v-for="(player, index) in allPlayers"
            :key="player"
            :class="['player-tile', { selected: isPlayerPreferred(player) }]"
            @click="togglePlayer(player)"
          >
            <span>{{ player }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

// Настройки фона (модуль background)
const backgroundType = computed({
  get: () => store.state.background.backgroundType,
  set: (value) => store.dispatch('background/setBackgroundType', value)
})
const isBlurEnabled = computed({
  get: () => store.state.background.isBlurEnabled,
  set: (value) => store.dispatch('background/toggleBlur', value)
})
const resetBackground = () => {
  store.dispatch('background/resetBackground')
}

// Автоцентрирование плеера (из модуля player)
const isCentered = computed({
  get: () => store.getters['player/isCentered'],
  set: (value) => store.dispatch('player/updateCentering', value)
});

// Список всех плееров (загружаем с API)
const allPlayers = ref([])
const fetchAllPlayers = async () => {
  try {
    const response = await fetch('https://rh.aukus.su/get_pl_list_1')
    const data = await response.text() // получаем строку
    allPlayers.value = data
      .split(',')
      .map(player => player.trim().toUpperCase())
  } catch (err) {
    console.error('Ошибка загрузки плееров:', err)
  }
}
onMounted(() => {
  fetchAllPlayers()
})

// Предпочтительные плееры (из модуля player)
// Если хранилище не определено, используем пустой массив.
const preferredPlayers = computed(() => store.state.player.preferredPlayers || [])

// Проверка, выбран ли плеер
const isPlayerPreferred = (player) => {
  return preferredPlayers.value.includes(player)
}

// Добавление/удаление плеера в/из избранного
const togglePlayer = (player) => {
  if (isPlayerPreferred(player)) {
    store.dispatch('player/removePreferredPlayer', player)
  } else {
    store.dispatch('player/addPreferredPlayer', player)
  }
}

// Удаление плеера (вызывается кнопкой удаления)
const removePlayer = (player) => {
  store.dispatch('player/removePreferredPlayer', player)
}

// Drag & drop для переупорядочивания выбранных плееров
let draggedIndex = null
const dragStart = (player, index) => {
  draggedIndex = index
}
const dropPlayer = (targetIndex) => {
  if (draggedIndex === null || draggedIndex === targetIndex) return
  const newPreferred = [...preferredPlayers.value]
  const movedPlayer = newPreferred.splice(draggedIndex, 1)[0]
  newPreferred.splice(targetIndex, 0, movedPlayer)
  store.dispatch('player/updatePreferredPlayers', newPreferred)
  draggedIndex = null
}

// Навигация
const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
@import '@/assets/slider.css';

.waaarn {
  color: #df0e0e;
}

.settings-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: #fff;
  height: 100vh;
}
.settings-header {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
  justify-content: space-between;
  margin-bottom: 20px;
}
.back-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}
.settings-container {
  background: #2a2a2a;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.setting-group, .setting-item {
  margin-bottom: 20px;
}
.setting-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
}
h2 {
  font-size: 16px;
  margin-bottom: 10px;
}
.radio {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.radio input {
  margin-right: 10px;
}
.radio-label {
  cursor: pointer;
}
.settings-actions {
  text-align: center;
  margin-top: 20px;
}
.reset-button {
  background: #d32f2f;
  border: none;
  padding: 10px 20px;
  color: #fff;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}
.reset-button:hover {
  background: #b71c1c;
}
.players-group {
  margin-top: 30px;
}
.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}
.player-tile {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #555;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  user-select: none;
  position: relative;
}
.player-tile.selected {
  background-color: #4caf50;
}
.player-tile:hover {
  background-color: #777;
}
.remove-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
}
</style>
