/* ========== [ConfigStore] - API 配置与人设状态管理 ========== */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { saveData, loadData, STORAGE_KEYS } from '@/utils/storage'

export const useConfigStore = defineStore('config', () => {

  /* ========== [APIConfig] - API 配置状态 ========== */
  const baseURL = ref('https://api.openai.com/v1')
  const apiKey = ref('')
  const model = ref('')
  const availableModels = ref([])
  /* ========== [APIConfig] END ========== */

  /* ========== [GitHubConfig] - GitHub 配置 ========== */
  const githubToken = ref('')
  /* ========== [GitHubConfig] END ========== */

  /* ========== [PersonaConfig] - 人设配置 ========== */
  const currentPersonaId = ref('baymax')
  const customPersonas = ref([])
  /* ========== [PersonaConfig] END ========== */

  /* ========== [Computed] - 计算属性 ========== */
  const isConfigured = computed(() => {
    return baseURL.value.trim() !== '' &&
           apiKey.value.trim() !== '' &&
           model.value.trim() !== ''
  })

  const apiConfig = computed(() => ({
    baseURL: baseURL.value,
    apiKey: apiKey.value,
    model: model.value
  }))
  /* ========== [Computed] END ========== */

  /* ========== [Methods] - 配置方法 ========== */
  function setAPIConfig(config) {
    if (config.baseURL !== undefined) baseURL.value = config.baseURL
    if (config.apiKey !== undefined) apiKey.value = config.apiKey
    if (config.model !== undefined) model.value = config.model
  }

  function setGitHubToken(token) {
    githubToken.value = token
  }

  function setCurrentPersona(personaId) {
    currentPersonaId.value = personaId
  }

  function addCustomPersona(persona) {
    customPersonas.value.push(persona)
  }

  function removeCustomPersona(personaId) {
    customPersonas.value = customPersonas.value.filter(p => p.id !== personaId)
  }

  function updateCustomPersona(personaId, updates) {
    const index = customPersonas.value.findIndex(p => p.id === personaId)
    if (index !== -1) {
      customPersonas.value[index] = { ...customPersonas.value[index], ...updates }
    }
  }

  /**
   * 获取可用模型列表
   */
  async function fetchModels() {
    if (!baseURL.value || !apiKey.value) return []
    try {
      const res = await fetch(`${baseURL.value}/models`, {
        headers: { 'Authorization': `Bearer ${apiKey.value}` }
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const models = json.data || json.models || json
      if (Array.isArray(models)) {
        availableModels.value = models.map(m => m.id || m.name || m).filter(Boolean).sort()
        return availableModels.value
      }
      return []
    } catch (error) {
      console.error('[ConfigStore] 获取模型列表失败:', error)
      availableModels.value = []
      return []
    }
  }
  /* ========== [Methods] END ========== */

  /* ========== [Persistence] - 持久化方法 ========== */
  async function loadFromStorage() {
    const savedConfig = await loadData(STORAGE_KEYS.CONFIG)
    if (savedConfig) {
      baseURL.value = savedConfig.baseURL || 'https://api.openai.com/v1'
      apiKey.value = savedConfig.apiKey || ''
      model.value = savedConfig.model || ''
      githubToken.value = savedConfig.githubToken || ''
    }

    const savedPersonas = await loadData(STORAGE_KEYS.PERSONAS)
    if (savedPersonas && Array.isArray(savedPersonas)) {
      customPersonas.value = savedPersonas
    }
  }

  async function saveToStorage() {
    await saveData(STORAGE_KEYS.CONFIG, {
      baseURL: baseURL.value,
      apiKey: apiKey.value,
      model: model.value,
      githubToken: githubToken.value
    })
    await saveData(STORAGE_KEYS.PERSONAS, customPersonas.value)
  }
  /* ========== [Persistence] END ========== */

  return {
    baseURL,
    apiKey,
    model,
    availableModels,
    githubToken,
    currentPersonaId,
    customPersonas,
    isConfigured,
    apiConfig,
    setAPIConfig,
    setGitHubToken,
    setCurrentPersona,
    addCustomPersona,
    removeCustomPersona,
    updateCustomPersona,
    fetchModels,
    loadFromStorage,
    saveToStorage
  }
})
/* ========== [ConfigStore] END ========== */
