<template>
  <div class="settings-page">
    <h1>Настройки</h1>
    <div class="settings-container">
      <div class="settings-group">
        <h2>Фон</h2>
        <div class="radio-group">
          <label class="radio">
            <input v-model="backgroundType" type="radio" value="cinematic" />
            <span class="radio-label">
              <span class="radio-title">Кинематографичный</span>
              <span class="radio-desc">Элегантный градиент в стиле кино</span>
            </span>
          </label>
          <label class="radio">
            <input v-model="backgroundType" type="radio" value="dynamic" />
            <span class="radio-label">
              <span class="radio-title">Динамический</span>
              <span class="radio-desc">Постер текущего фильма</span>
            </span>
          </label>
          <label class="radio">
            <input v-model="backgroundType" type="radio" value="stars" />
            <span class="radio-label">
              <span class="radio-title">Звёздный</span>
              <span class="radio-desc">Классическое звёздное небо</span>
            </span>
          </label>
          <label class="radio">
            <input v-model="backgroundType" type="radio" value="lava-lamp" />
            <span class="radio-label">
              <span class="radio-title">Лава-лампа</span>
              <span class="radio-desc">Плавные цветные переливы</span>
            </span>
          </label>
          <label class="radio">
            <input v-model="backgroundType" type="radio" value="disabled" />
            <span class="radio-label">
              <span class="radio-title">Отключён</span>
              <span class="radio-desc">Простой тёмный фон</span>
            </span>
          </label>
        </div>
        <div class="settings-actions">
          <button class="reset-button" @click="resetBackground">
            <i class="fa-solid fa-arrow-rotate-left"></i> Сбросить
          </button>
        </div>
      </div>

      <div class="settings-group">
        <h2>Тема</h2>
        <ThemeSelector />
      </div>

      <div class="settings-group">
        <h2>История</h2>
        <SliderRound v-model="isHistoryAllowed"> Сохранять историю просмотра</SliderRound>
        <div class="settings-actions">
          <button class="reset-button danger" @click="showModal = true">
            <i class="fa-solid fa-trash-can"></i>
            Очистить историю
          </button>
          <BaseModal
            :is-open="showModal"
            message="Вы уверены, что хотите очистить историю?"
            @confirm="clearAllHistory"
            @close="showModal = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SliderRound from '@/components/slider/SliderRound.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'
import { useBackgroundStore } from '@/store/background'
import { useMainStore } from '@/store/main'
import { computed, ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'

const mainStore = useMainStore()
const backgroundStore = useBackgroundStore()
const showModal = ref(false)

const clearAllHistory = () => {
  mainStore.clearAllHistory()
  showModal.value = false
}

const backgroundType = computed({
  get: () => backgroundStore.backgroundType,
  set: (value) => backgroundStore.updateBackgroundType(value)
})

const isBlurDisabled = computed(
  () => backgroundType.value === 'stars' || backgroundType.value === 'disable' || backgroundType.value === 'cinematic'
)
watch(isBlurDisabled, (newValue) => {
  if (newValue) {
    backgroundStore.toggleBlur(false)
  }
})

const isHistoryAllowed = computed({
  get: () => mainStore.isHistoryAllowed,
  set: (value) => mainStore.setHistoryAllowed(value)
})


</script>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  color: #fff;
  min-height: 100vh;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #ffffff;
  font-size: 1.75rem;
  font-weight: 600;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-tertiary);
}

.settings-container {
  background: var(--bg-secondary);
  padding: 24px;
  border-radius: 16px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
}

h2 {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.radio {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.radio:hover {
  background: rgba(255, 255, 255, 0.05);
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.radio input {
  margin-top: 4px;
  accent-color: var(--accent-color);
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.radio-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
}

.radio-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-color);
}

.radio-desc {
  font-size: 13px;
  color: var(--text-muted);
}

.settings-actions {
  margin-top: 8px;
}

.reset-button {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 10px 18px;
  color: var(--text-color);
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.reset-button:hover {
  background: var(--bg-tertiary);
  border-color: var(--accent-color);
}

.reset-button.danger:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}
</style>
