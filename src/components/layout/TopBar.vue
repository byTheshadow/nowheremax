<script setup>
/* ========== [Imports] - 依赖导入 ========== */
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useConfigStore } from '@/stores/useConfigStore'
import { WEATHER_FALLBACK_MESSAGES } from '@/utils/constants'
/* ========== [Imports] END ========== */

/* ========== [StoreRefs] - Store 引用 ========== */
const appStore = useAppStore()
const configStore = useConfigStore()
/* ========== [StoreRefs] END ========== */

/* ========== [State] - 组件状态 ========== */
const weatherText = ref(
  WEATHER_FALLBACK_MESSAGES[Math.floor(Math.random() * WEATHER_FALLBACK_MESSAGES.length)]
)
const sessionTitle = ref('新对话')
/* ========== [State] END ========== */

/* ========== [Computed] - 计算属性 ========== */
const syncStatus = computed(() => {
  return configStore.githubToken ? '🟢' : '⚪'
})
/* ========== [Computed] END ========== */

/* ========== [Methods] - 操作方法 ========== */
function handleSessionClick() {
  appStore.toggleSessionDropdown()
}

function handleSettingsClick() {
  appStore.toggleSettings()
}
/* ========== [Methods] END ========== */
</script>

<template>
  <!-- ========== [TopBarContainer] - 顶部栏 ========== -->
  <div class="topbar glass">
    <!--左侧：天气 -->
    <div class="topbar-left">
      <span class="weather-text">{{ weatherText }}</span></div>

    <!-- 中间：会话名-->
    <button class="session-title" @click="handleSessionClick">
      {{ sessionTitle }}<span class="dropdown-arrow">▼</span>
    </button>

    <!-- 右侧：同步状态 + 设置 -->
    <div class="topbar-right">
      <span class="sync-dot">{{ syncStatus }}</span>
      <button class="settings-btn" @click="handleSettingsClick">⚙️</button>
    </div>
  </div>
  <!-- ========== [TopBarContainer] END ========== -->
</template>

<style scoped>
/* ========== [TopBarLayout] - 顶部栏布局 ========== */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 1rem;
  position: relative;
  z-index: 10;
  flex-shrink: 0;border-bottom: 1px solid var(--border);
  border-radius: 0;backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.topbar-left {
  flex: 1;
  min-width: 0;
}

.weather-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.session-title {
  font-size: 0.85rem;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.session-title:hover {
  background: var(--input-bg);
}

.dropdown-arrow {
  font-size: 0.6rem;
  margin-left: 0.25rem;
  opacity: 0.5;
}

.topbar-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.sync-dot {
  font-size: 0.6rem;
}

.settings-btn {
  font-size: 1rem;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  transition: background-color 0.3s ease;
}

.settings-btn:hover {
  background: var(--input-bg);
}
/* ========== [TopBarLayout] END ========== */
</style>
