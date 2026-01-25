<template>
  <div class="settings-page">
    <h1>Настройки</h1>
    <div class="settings-container">
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
import { useMainStore } from '@/store/main'
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'

const mainStore = useMainStore()
const showModal = ref(false)

const clearAllHistory = () => {
  mainStore.clearAllHistory()
  showModal.value = false
}

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
