<template>
  <div class="wrapper">
    <div class="mainpage">
      <!-- Hero Section -->
      <section v-if="featuredMovie" class="hero-section">
        <div
          class="hero-backdrop"
          :style="{ backgroundImage: `url(${featuredMovie.poster})` }"
        ></div>
        <div class="hero-gradient"></div>

        <div class="hero-content">
          <h1 class="hero-title">{{ featuredMovie.title }}</h1>

          <div class="hero-meta">
            <span v-if="featuredMovie.rating_kp" class="hero-rating">
              <i class="fas fa-star"></i>
              {{ featuredMovie.rating_kp }}
            </span>
            <span v-if="featuredMovie.year" class="hero-year">
              {{ featuredMovie.year }}
            </span>
            <span v-if="featuredMovie.type" class="hero-type">
              {{ featuredMovie.type }}
            </span>
          </div>

          <p v-if="featuredMovie.description" class="hero-description">
            {{ truncateText(featuredMovie.description, 200) }}
          </p>

          <div class="hero-actions">
            <button class="btn-primary" @click="goToMovie(featuredMovie.kp_id)">
              <i class="fas fa-play"></i> Смотреть
            </button>
            <button class="btn-secondary" @click="openRandomMovie">
              <i class="fas fa-dice"></i> Случайный фильм
            </button>
          </div>
        </div>
      </section>

      <!-- Fallback hero -->
      <section v-else class="hero-section hero-minimal">
        <div class="hero-gradient"></div>
        <div class="hero-content">
          <h1 class="hero-title">Откройте мир кино</h1>
          <p class="hero-description">
            Тысячи фильмов и сериалов в одном месте
          </p>
          <div class="hero-actions">
            <button class="btn-primary" @click="focusSearch">
              <i class="fas fa-search"></i> Найти фильм
            </button>
            <button class="btn-secondary" @click="openRandomMovie">
              <i class="fas fa-dice"></i> Мне повезёт
            </button>
          </div>
        </div>
      </section>

      <!-- Search -->
      <div class="search-section">
        <div class="search-container">
          <div class="input-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input
              ref="searchInput"
              v-model="searchTerm"
              class="search-input"
              :class="{ 'wrong-layout': showLayoutWarning }"
              placeholder="Поиск фильмов и сериалов..."
              @keydown.enter.prevent="search"
              @keydown.tab.prevent="handleTabKey"
              @keydown.down.prevent="focusFirstMovieCard"
              @input="handleInput"
            />
            <button
              v-if="searchTerm"
              class="clear-button"
              @click="resetSearch"
            >
              <i class="fas fa-times"></i>
            </button>

            <div
              v-if="showLayoutWarning"
              class="layout-warning show"
            >
              <i class="fas fa-keyboard"></i>
              Возможно, неправильная раскладка. Tab — переключить на
              {{ suggestedLayout }}
            </div>
          </div>

          <button
            class="advanced-toggle"
            :class="{ active: showAdvanced }"
            @click="showAdvanced = !showAdvanced"
          >
            <i class="fas fa-sliders-h"></i>
          </button>
        </div>

        <transition name="slide">
          <div v-if="showAdvanced" class="advanced-search">
            <button
              v-for="type in searchTypes"
              :key="type.value"
              class="search-type-btn"
              :class="{ active: searchType === type.value }"
              @click="setSearchType(type.value)"
            >
              {{ type.label }}
            </button>
          </div>
        </transition>
      </div>

      <!-- Results -->
      <div class="content-container">
        <section v-if="searchPerformed" class="content-section">
          <h2 class="section-title">Результаты поиска</h2>

          <MovieList
            :movies-list="movies"
            :is-history="false"
            :loading="loading"
          />

          <div
            v-if="movies.length === 0 && !loading && !errorMessage"
            class="empty-state"
          >
            <i class="fas fa-film"></i>
            <p>Ничего не найдено</p>
          </div>

          <ErrorMessage
            v-if="errorMessage"
            :message="errorMessage"
            :code="errorCode"
          />
        </section>

        <!-- History -->
        <section v-if="!searchTerm" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-history"></i> Продолжить просмотр
            </h2>

            <button
              v-if="history.length"
              class="clear-history-btn"
              @click="showModal = true"
            >
              <i class="fas fa-trash-alt"></i> Очистить
            </button>
          </div>

          <SpinnerLoading v-if="loading" />

          <div v-else-if="!history.length" class="empty-state">
            <i class="fas fa-film"></i>
            <p>История пуста</p>
            <span class="empty-hint">
              Ваши просмотренные фильмы появятся здесь
            </span>
          </div>

          <MovieList
            v-else
            :movies-list="history"
            :is-history="true"
            @item-deleted="handleItemDeleted"
          />

          <BaseModal
            :is-open="showModal"
            message="Очистить историю просмотра?"
            @confirm="clearAllHistory"
            @close="showModal = false"
          />
        </section>
      </div>
    </div>

    <FooterDonaters />

    <RandomMovieModal
      :is-open="showRandomModal"
      :movie="randomMovie"
      :loading="randomLoading"
      :error="randomError"
      @close="closeRandomModal"
      @get-new-movie="fetchRandomMovie"
    />
  </div>
</template>
