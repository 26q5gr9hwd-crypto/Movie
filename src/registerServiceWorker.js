import { register } from 'register-service-worker'

const SW_CONFIG = {
  scope: process.env.BASE_URL,
  updateViaCache: 'none',
  reloadInterval: 3600000
}

function notifyUpdateAvailable(registration) {
  const shouldReload = confirm('Доступно новое обновление! Нажмите OK для обновления.')
  if (shouldReload) {
    registration.waiting?.postMessage({ type: 'SKIP_WAITING' })
  }
}

function trackError(error) {
  if (navigator.onLine) {
    navigator.sendBeacon('/api/sw-errors', JSON.stringify({
      error: error.message,
      stack: error.stack,
      timestamp: Date.now()
    }))
  }
}

if ('serviceWorker' in navigator) {
  if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
      ...SW_CONFIG,
      ready() {
        console.log('App is served from cache by service worker')
      },
      registered(registration) {
        console.log('Service worker registered')
        setInterval(() => registration.update(), SW_CONFIG.reloadInterval)
        
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload()
        })
      },
      cached() {
        console.log('Content cached for offline')
      },
      updatefound() {
        console.log('Downloading new content')
      },
      updated(registration) {
        console.log('New content available')
        notifyUpdateAvailable(registration)
      },
      offline() {
        console.log('App running in offline mode')
      },
      error(error) {
        console.error('SW error:', error)
        trackError(error)
      }
    })
  } else {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => {
        registrations.forEach(registration => registration.unregister())
      })
  }
}