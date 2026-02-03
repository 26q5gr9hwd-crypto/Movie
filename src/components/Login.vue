<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Вход</h1>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Имя пользователя</label>
          <input 
            id="username"
            v-model="username"
            type="text"
            placeholder="Введите имя пользователя"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Пароль</label>
          <input 
            id="password"
            v-model="password"
            type="password"
            placeholder="Введите пароль"
            required
          />
        </div>
        
        <div v-if="error" class="error-message">
           error 
        </div>
        
        <button type="submit" class="submit-btn" :disabled="loading">
           loading ? 'Загрузка...' : 'Войти' 
        </button>
      </form>
      
      <p class="switch-link">
        Нет аккаунта? 
        <router-link to="/signup">Зарегистрироваться</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const username = ref('')
    const password = ref('')
    const error = ref('')
    const loading = ref(false)
    
    const handleLogin = async () => {
      error.value = ''
      loading.value = true
      
      try {
        authStore.login(username.value, password.value)
        router.push('/')
      } catch (e) {
        if (e.message === 'User not found') {
          error.value = 'Пользователь не найден'
        } else if (e.message === 'Invalid password') {
          error.value = 'Неверный пароль'
        } else {
          error.value = 'Ошибка входа'
        }
      } finally {
        loading.value = false
      }
    }
    
    return {
      username,
      password,
      error,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-card {
  background: #1a1a2e;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.auth-card h1 {
  color: #fff;
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #a0a0a0;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  background: #16213e;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #e94560;
}

.form-group input::placeholder {
  color: #666;
}

.error-message {
  background: rgba(233, 69, 96, 0.1);
  border: 1px solid #e94560;
  color: #e94560;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #e94560;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #d63851;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-link {
  text-align: center;
  margin-top: 24px;
  color: #a0a0a0;
  font-size: 14px;
}

.switch-link a {
  color: #e94560;
  text-decoration: none;
}

.switch-link a:hover {
  text-decoration: underline;
}
</style>
