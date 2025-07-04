<template>
  <div class="download-container">
    <h1>Скачать приложение</h1>

    <!-- Android TV/Android/iOS/WebOS/Tizen Section -->
    <div class="platform-section">
      <div class="platform-header">
        <div class="warning-icon">⚠️</div>
        <h2>Android TV/Android/iOS/WebOS/Tizen</h2>
      </div>

      <div class="platform-content">
        <p>
          VIP просмотр доступен в приложении Lampa через подписку на бусти
          <a
            href="https://boosty.to/sentryward/purchase/2652835?ssource=DIRECT&share=subscription_link"
            class="original-link"
            >Boosty</a
          >
          или
          <a href="https://t.me/send?start=SBFupLnwla4ZhiYWVi" class="original-link">Crypto Bot</a>
          на наши торрсервера
        </p>
        <p>
          Так же есть приложение
          <a href="https://t.me/ReYohoho/176" class="original-link">приложение</a> под
          Android/Android TV (VIP там нет, это клиент сайта без рекламы)
        </p>
      </div>
    </div>

    <!-- PC Section -->
    <div class="platform-section">
      <div class="platform-header">
        <div class="warning-icon">⚠️</div>
        <h2>ПК (Windows/Linux/MacOS)</h2>
      </div>

      <div class="platform-content">
        <p>
          В десктоп приложении есть возможность смотреть торренты без скачки, пример работы на видео
          ниже, оформить подписку можно на
          <a
            href="https://boosty.to/sentryward/purchase/2652835?ssource=DIRECT&share=subscription_link"
            class="original-link"
            >Boosty</a
          >
          или
          <a href="https://t.me/send?start=SBFupLnwla4ZhiYWVi" class="original-link">Crypto Bot</a>
        </p>
      </div>
    </div>

    <div class="os-cards">
      <!-- Windows -->
      <div class="link-card">
        <div class="os-header">
          <img src="https://img.icons8.com/color/48/windows-10.png" alt="Windows" />
          <h3>Windows</h3>
        </div>
        <a
          href="https://github.com/reyohoho/reyohoho-desktop/releases/latest/download/ReYohoho.Setup.1.1.14_x64.exe"
          class="download-btn"
        >
          Скачать для Windows
        </a>
        <p class="description">Требуется Windows 10/11</p>
      </div>

      <!-- Linux -->
      <div class="link-card">
        <div class="os-header">
          <img src="https://img.icons8.com/color/48/linux.png" alt="Linux" />
          <h3>Linux</h3>
        </div>
        <a
          href="https://github.com/reyohoho/reyohoho-desktop/releases/latest/download/ReYohoho.Setup.1.1.14_x64.dmg"
          class="download-btn"
        >
          Скачать для Linux
        </a>
        <p class="description">
          AppImage файл, сделайте исполняемым: <code>chmod +x *.AppImage</code>
        </p>
      </div>

      <!-- macOS -->
      <div class="link-card">
        <div class="os-header">
          <img src="https://img.icons8.com/ios-filled/50/mac-os.png" alt="macOS" />
          <h3>macOS</h3>
        </div>
        <a
          href="https://github.com/reyohoho/reyohoho-desktop/releases/latest/download/ReYohoho.Setup.1.1.14_arm64.dmg"
          class="download-btn"
        >
          Скачать для macOS
        </a>
        <p class="description">.dmg образ, требуется macOS 10.15+</p>
      </div>

      <!-- Android -->
      <div class="link-card">
        <div class="os-header">
          <img src="https://img.icons8.com/color/48/android-os.png" alt="Android" />
          <h3>Android</h3>
        </div>
        <a
          href="https://github.com/Wkeynhk/ReYohoho-Mobile/releases/latest/download/ReYohoho.apk"
          class="download-btn"
        >
          Скачать APK
        </a>
        <p class="description">Разрешите установку из неизвестных источников</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppDownloader'
}
</script>

<style scoped>
.download-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2.5rem;
  color: #ffffff;
  font-size: 2rem;
  font-weight: 500;
}

.platform-section {
  background: rgba(255, 204, 0, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 4px solid #ffcc00;
}

.platform-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.warning-icon {
  font-size: 2rem;
  color: #ffcc00;
}

.platform-header h2 {
  margin: 0;
  color: #ffffff;
  font-size: 1.5rem;
}

.platform-content {
  padding-left: 1rem;
}

.platform-content p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

.original-link {
  color: #4fc3f7;
  text-decoration: none;
  word-break: break-all;
}

.original-link:hover {
  text-decoration: underline;
}

.os-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.link-card {
  background: #2d2d2d;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #3d3d3d;
  padding: 1.5rem;
}

.link-card:hover {
  transform: translateY(-5px);
}

.os-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.os-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #ffffff;
}

.download-btn {
  display: block;
  background: #42b883;
  color: white;
  text-decoration: none;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  margin: 1.2rem 0;
  transition: background 0.3s ease;
}

.download-btn:hover {
  background: #359469;
}

.description {
  font-size: 0.9rem;
  color: #ffffff;
  margin: 0;
  padding: 0.5rem;
  background: #f8f9fa70;
  border-radius: 6px;
  font-family: monospace;
}

@media (max-width: 768px) {
  .platform-content {
    padding-left: 0;
  }
}
</style>
