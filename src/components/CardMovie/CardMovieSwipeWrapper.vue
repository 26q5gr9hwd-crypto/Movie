<template>
  <div
    class="swipe-wrapper"
    :class="{ swiping }"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <slot ></slot>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { threshold = -100, disableDesktop = true } = defineProps({
  threshold: Number,
  disableDesktop: Boolean
})
const emit = defineEmits(['delete'])

const startX = ref(0)
const currentX = ref(0)
const swiping = ref(false)
const swipeElement = ref(null)

function onTouchStart(e) {
  if (disableDesktop) return
  startX.value = e.touches[0].clientX
  swiping.value = true
  swipeElement.value = e.target.closest('.swipe-wrapper')
}

function onTouchMove(e) {
  if (disableDesktop) return
  currentX.value = e.touches[0].clientX
  const deltaX = currentX.value - startX.value
  if (deltaX < 0) {
    swipeElement.value.style.transform = `translateX(${deltaX}px)`
  }
}

function onTouchEnd() {
  if (disableDesktop) return
  const deltaX = currentX.value - startX.value
  if (deltaX < threshold) {
    swipeElement.value.style.transform = 'translateX(-100%)'
    swipeElement.value.style.opacity = '0'
    emit('delete')

    setTimeout(() => {
      swiping.value = false
    }, 300)
  } else {
    swipeElement.value.style.transform = ''
    swiping.value = false
  }

  startX.value = 0
  currentX.value = 0
}
</script>

<style scoped>
.swipe-wrapper {
  display: block;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  touch-action: pan-y;
}

.swipe-wrapper.swiping {
  transition: none;
}
</style>
