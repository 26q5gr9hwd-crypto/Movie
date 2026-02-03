export const routes = [
  {
    path: '/',
    component: () => import('@/components/MovieSearch.vue'),
    name: 'home',
    meta: {
      title: 'DanFlix - Поиск фильмов'
    }
  },
  {
    path: '/top',
    component: () => import('@/components/TopMovies.vue'),
    name: 'top-movies',
    meta: {
      title: 'DanFlix - Популярное'
    }
  },
  {
    path: '/movie/:kp_id',
    component: () => import('@/components/MovieInfo.vue'),
    name: 'movie-info',
    meta: {
      title: 'DanFlix - Просмотр фильма'
    }
  },
  {
    path: '/shiki/:shiki_id',
    component: () => import('@/components/MovieInfoShiki.vue'),
    name: 'movie-info-shiki',
    meta: {
      title: 'DanFlix - Просмотр аниме'
    }
  },
  {
    path: '/contact',
    name: 'ContactsPage',
    component: () => import('@/components/ContactsPage.vue'),
    meta: {
      title: 'DanFlix - Контакты'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/components/Settings.vue'),
    meta: {
      title: 'DanFlix - Настройки'
    }
  },
  {
    path: '/:pathMatch(.)',
    component: () => import('@/components/NotFound.vue'),
    name: 'NotFound',
    meta: {
      title: '404 - Страница не найдена'
    }
  }
]
