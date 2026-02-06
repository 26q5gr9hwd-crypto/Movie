<template>
  <div class="notifications-page">
    <h2>Уведомления</h2>
    <p class="empty-state">Нет новых уведомлений</p>
  </div>
</template>

<script>
export default {
  name: 'NotificationsPage'
}
</script>

<style scoped>
.notifications-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.notifications-page h2 {
  margin-bottom: 16px;
}

.empty-state {
  color: #888;
  text-align: center;
  padding: 40px 0;
}
</style>