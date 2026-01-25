<template>
  <div class="login-page">
    <h1>{{ isSignup ? 'Регистрация' : 'Вход в систему' }}</h1>

    <div class="login-container dark-theme">
      <div v-if="loading" class="loading-container">
        <div class="loader"></div>
        <p>Загрузка...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="username">Имя пользователя</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Введите имя пользователя"
            required
            autocomplete="username"
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
            :autocomplete="isSignup ? 'new-password' : 'current-password'"
          />
        </div>

        <div v-if="isSignup" class="form-group">
          <label for="confirmPassword">Подтвердите пароль</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Повторите пароль"
            required
            autocomplete="new-password"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ isSignup ? 'Зарегистрироваться' : 'Войти' }}
        </button>

        <div class="toggle-mode">
          <span v-if="isSignup">
            Уже есть аккаунт?
            <a href="#" @click.prevent="toggleMode">Войти</a>
          </span>
          <span v-else>
            Нет аккаунта?
            <a href="#" @click.prevent="toggleMode">Зарегистрироваться</a>
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { login, signup } from '@/api/user'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isSignup = ref(false)
const loading = ref(false)
const error = ref(null)

const toggleMode = () => {
  isSignup.value = !isSignup.value
  error.value = null
  confirmPassword.value = ''
}

const handleSubmit = async () => {
  error.value = null

  // Validation
  if (!username.value.trim() || !password.value) {
    error.value = 'Заполните все поля'
    return
  }

  if (isSignup.value) {
    if (password.value !== confirmPassword.value) {
      error.value = 'Пароли не совпадают'
      return
    }
    if (password.value.length < 6) {
      error.value = 'Пароль должен быть не менее 6 символов'
      return
    }
  }

  loading.value = true

  try {
    let response
    if (isSignup.value) {
      response = await signup({
        username: username.value.trim(),
        password: password.value
      })
      // Auto-login after signup if no session returned
      if (!response.session) {
        response = await login({
          username: username.value.trim(),
          password: password.value
        })
      }
    } else {
      response = await login({
        username: username.value.trim(),
        password: password.value
      })
    }

    // Supabase returns session and user
    if (response.session) {
      authStore.setSession(response.session)
      authStore.setUser(response.user)
      // Full reload to ensure initAuth() picks up the new session
      window.location.href = '/'
    }
  } catch (err) {
    if (err.message?.includes('Invalid login credentials')) {
      error.value = 'Неверное имя пользователя или пароль'
    } else if (err.message?.includes('User already registered')) {
      error.value = 'Пользователь с таким именем уже существует'
    } else {
      error.value = err.message || 'Произошла ошибка. Попробуйте позже.'
    }
    console.error('Auth error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
  color: #e0e0e0;
}

.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--accent-transparent);
}

.dark-theme {
  background: #2a2a2a;
  color: #e0e0e0;
}

h1 {
  text-align: center;
  margin-bottom: 2.5rem;
  color: #ffffff;
  font-size: 2rem;
  font-weight: 500;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: #aaa;
}

.form-group input {
  padding: 0.75rem 1rem;
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 5px;
  color: #e0e0e0;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.form-group input::placeholder {
  color: #666;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-mode {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #aaa;
}

.toggle-mode a {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
}

.toggle-mode a:hover {
  text-decoration: underline;
}

.error-message {
  color: #ff6b6b;
  font-size: 0.9rem;
  padding: 0.75rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 5px;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.loading-container {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid #444;
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-container {
  animation: fadeIn 0.5s ease-out;
}
</style>
