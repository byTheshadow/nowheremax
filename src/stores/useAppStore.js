/* ========== [AppStore] - 全局应用状态管理 ========== */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { saveData, loadData, STORAGE_KEYS } from '@/utils/storage'

export const useAppStore = defineStore('app', () => {

  /* ========== [ViewState] - 当前视图状态 ========== */
  /**
   * 可选值: 'gate' | 'onboarding' | 'main' | 'zen'
   */
  const currentView = ref('gate')
  /* ========== [ViewState] END ========== */

  /* ========== [LoadingState] - 全局加载状态 ========== */
  const isInitialized = ref(false)
  /* ========== [LoadingState] END ========== */

  /* ========== [OnboardingState] - 引导完成标志 ========== */
  /**
   * 独立于 configStore.isConfigured 的标志位
   * 只有走完 Onboarding 最后一步才会置 true
   * 用于避免"配置有残留 → 直接跳过引导"的 Bug
   */
  const onboardingCompleted = ref(false)
  /* ========== [OnboardingState] END ========== */

  /* ========== [UIState] - UI 控制状态 ========== */
  const showSettings = ref(false)
  const showKnowledgePanel = ref(false)
  const showCBTModal = ref(false)
  const showSessionDropdown = ref(false)
  /* ========== [UIState] END ========== */

  /* ========== [SettingsState] - 应用设置 ========== */
  const settings = ref({
    themeMode: 'auto',
    musicVolume: 0.3,
    woodenFishText: '功德+1'
  })
  /* ========== [SettingsState] END ========== */

  /* ========== [Methods] - 视图切换方法 ========== */
  function navigateTo(view) {
    currentView.value = view
  }

  function toggleSettings() {
    showSettings.value = !showSettings.value
  }

  function toggleKnowledgePanel() {
    showKnowledgePanel.value = !showKnowledgePanel.value
  }

  function toggleCBTModal() {
    showCBTModal.value = !showCBTModal.value
  }

  function toggleSessionDropdown() {
    showSessionDropdown.value = !showSessionDropdown.value
  }

  function closeAllPanels() {
    showSettings.value = false
    showKnowledgePanel.value = false
    showCBTModal.value = false
    showSessionDropdown.value = false
  }
  /* ========== [Methods] END ========== */

  /* ========== [OnboardingMethods] - 引导状态操作 ========== */
  async function markOnboardingCompleted() {
    onboardingCompleted.value = true
    await saveToStorage()
  }

  async function resetOnboarding() {
    onboardingCompleted.value = false
    await saveToStorage()
  }
  /* ========== [OnboardingMethods] END ========== */

  /* ========== [Persistence] - 持久化方法 ========== */
  async function loadFromStorage() {
    const saved = await loadData(STORAGE_KEYS.SETTINGS)
    if (saved) {
      // 兼容旧数据：优先取 saved.settings，回退到 saved 本身
      const savedSettings = saved.settings || saved
      settings.value = {
        ...settings.value,
        themeMode: savedSettings.themeMode ?? settings.value.themeMode,
        musicVolume: savedSettings.musicVolume ?? settings.value.musicVolume,
        woodenFishText: savedSettings.woodenFishText ?? settings.value.woodenFishText
      }
      onboardingCompleted.value = saved.onboardingCompleted === true
    }
  }

  async function saveToStorage() {
    await saveData(STORAGE_KEYS.SETTINGS, {
      settings: settings.value,
      onboardingCompleted: onboardingCompleted.value
    })
  }
  /* ========== [Persistence] END ========== */

  return {
    currentView,
    isInitialized,
    onboardingCompleted,
    showSettings,
    showKnowledgePanel,
    showCBTModal,
    showSessionDropdown,
    settings,
    navigateTo,
    toggleSettings,
    toggleKnowledgePanel,
    toggleCBTModal,
    toggleSessionDropdown,
    closeAllPanels,
    markOnboardingCompleted,
    resetOnboarding,
    loadFromStorage,
    saveToStorage
  }
})
/* ========== [AppStore] END ========== */

