/* ========== [UseTheme] - 昼夜主题切换逻辑 ========== */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/useAppStore'

export function useTheme() {
  const appStore = useAppStore()

  /* ========== [State] - 主题状态 ========== */
  const themeMode = computed({
    get: () => appStore.settings.themeMode,
    set: (val) => {
      appStore.settings.themeMode = val
      appStore.saveToStorage()
    }
  })

  const actualTheme = computed(() => {
    if (themeMode.value !== 'auto') return themeMode.value
    const hour = new Date().getHours()
    return (hour >= 6 && hour < 18) ? 'light' : 'dark'
  })
  /* ========== [State] END ========== */

  /* ========== [AutoCheck] - 自动检测定时器 ========== */
  let autoCheckTimer = null

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', actualTheme.value)}

  function startAutoCheck() {
    stopAutoCheck()
    autoCheckTimer = setInterval(() => {
      if (themeMode.value === 'auto') {
        applyTheme()
      }
    }, 60000)
  }

  function stopAutoCheck() {
    if (autoCheckTimer) {
      clearInterval(autoCheckTimer)
      autoCheckTimer = null
    }
  }
  /* ========== [AutoCheck] END ========== */

  /* ========== [Watchers] - 监听主题变化 ========== */
  watch(actualTheme, () => {
    applyTheme()
  }, { immediate: true })
  /* ========== [Watchers] END ========== */

  /* ========== [Methods] - 主题切换方法 ========== */
  function setThemeMode(mode) {
    themeMode.value = mode}

  function cycleTheme() {
    const modes = ['auto', 'light', 'dark']
    const currentIndex = modes.indexOf(themeMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    themeMode.value = modes[nextIndex]
  }
  /* ========== [Methods] END ========== */

  /* ========== [Lifecycle] - 生命周期管理 ========== */
  onMounted(() => {
    applyTheme()
    startAutoCheck()
  })

  onUnmounted(() => {
    stopAutoCheck()
  })
  /* ========== [Lifecycle] END ========== */

  return {
    themeMode,
    actualTheme,
    setThemeMode,
    cycleTheme
  }
}
/* ========== [UseTheme] END ========== */
