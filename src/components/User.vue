<template>
  <div class="user-page">
    <h2>Профиль</h2>
    <p class="empty-state">Страница профиля пользователя</p>
  </div>
</template>

<script>
export default {
  name: 'UserPage'
}
</script>

<style scoped>
.user-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.user-page h2 {
  margin-bottom: 16px;
}

.empty-state {
  color: #888;
  text-align: center;
  padding: 40px 0;
}
</style>