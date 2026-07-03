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

  /* ========== [Persistence] - 持久化方法 ========== */
  async function loadFromStorage() {
    const saved = await loadData(STORAGE_KEYS.SETTINGS)
    if (saved) {
      settings.value = { ...settings.value, ...saved }
    }
  }

  async function saveToStorage() {
    await saveData(STORAGE_KEYS.SETTINGS, settings.value)
  }
  /* ========== [Persistence] END ========== */

  return {
    currentView,
    isInitialized,
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
    loadFromStorage,
    saveToStorage
  }
})
/* ========== [AppStore] END ========== */
