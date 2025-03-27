<template>
  <transition name="fade">
    <div v-if="visible" class="notification">
      <span>{{ message }}</span>
      <button class="close-btn" @click="hideNotification">✕</button>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')

const showNotification = (msg, duration = 3000) => {
  message.value = msg
  visible.value = true
  
  setTimeout(() => {
    visible.value = false
  }, duration)
}

const hideNotification = () => {
  visible.value = false
}

// Экспортируем функцию для вызова уведомления
defineExpose({ showNotification })
</script>

<style scoped>
.notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #444;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 8;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
