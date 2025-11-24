<template>
  <section class="about-section">
    <div class="about-header">
      <h2>О приложении</h2>
      <p class="about-subtitle">
        Небольшое To‑Do приложение на Vue 3 с Pinia, роутингом и работой с состоянием.
      </p>
    </div>

    <div class="about-grid">
      <!-- Основная информация про приложение -->
      <div class="about-card">
        <h3>Идея</h3>
        <p>
          Это To‑Do создано как учебный проект: цель — собрать вместе
          компоненты, маршрутизацию, глобальное состояние и хранение данных
          в localStorage, но при этом оставить интерфейс простым и понятным.
        </p>
      </div>

      <!-- Технологии -->
      <div class="about-card">
        <h3>Технологии</h3>
        <ul>
          <li>Vue 3 (Composition API)</li>
          <li>Vite</li>
          <li>Pinia + Pinia Persist</li>
          <li>vue-router</li>
          <li>SCSS</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.about-section {
  max-width: 920px;
  margin: 0 auto 3em;
}

.about-header {
  margin-bottom: 2em;
}

.about-subtitle {
  margin-top: 0.4em;
  opacity: 0.9;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.4em;
}

.about-card {
  padding: 1.3em 1.5em 1.2em;
  border-radius: 12px;
  box-shadow: 0 2px 10px -4px rgba(0, 0, 0, 0.4);
}

body.dark-theme .about-card {
  background: #181818;
  color: #fff;
}

body.light-theme .about-card {
  background: #f7f7f7;
  color: #111;
}

.about-card h3 {
  margin-top: 0;
  margin-bottom: 0.7em;
}
</style>