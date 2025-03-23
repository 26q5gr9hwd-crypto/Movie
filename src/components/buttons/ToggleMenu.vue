<template>
  <button class="toggle" @click="toggle">
    <i :class="['fas', navbarStore.isNavbarVisible ? 'fa-times' : 'fa-bars', { 'animate': animate }]" ></i>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useNavbarStore } from '@/store/navbar'

const navbarStore = useNavbarStore()  // Используем store для состояния навбара
const animate = ref(false)

function toggle() {
  // Запускаем анимацию перед переключением иконки
  animate.value = true
  // Используем небольшой timeout для анимации (например, 150 мс)
  setTimeout(() => {
    navbarStore.toggleNavbar()  // Переключаем состояние навбара через store
    // Сбрасываем флаг анимации
    animate.value = false
  }, 150)
}
</script>

<style scoped>
.toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 30px;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  transition: transform 0.3s ease;
  z-index: 6;
  color: #fff;
}

/* Базовая анимация для иконки */
.toggle i {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* При добавлении класса .animate можно задать эффект, например, увеличение или небольшое вращение */
.animate {
  transform: scale(1.2);
  opacity: 0.7;
}
</style>
