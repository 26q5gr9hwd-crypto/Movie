<template>
  <div class="auth-success-page">
    <h2>Вход выполнен отлично!</h2>
    <p>Вы будете перенаправлены на главную страницу...</p>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AuthSuccess',
  setup() {
    const router = useRouter()
    onMounted(() => {
      setTimeout(() => {
        router.push('/')
      }, 2000)
    })
  }
}
</script>