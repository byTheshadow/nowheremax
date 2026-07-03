/* ========== [ProfileStore] - 用户健康档案状态管理 ========== */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { saveData, loadData, STORAGE_KEYS } from '@/utils/storage'

export const useProfileStore = defineStore('profile', () => {

  /* ========== [ProfileState] - 档案数据 ========== */
  const nickname = ref('')
  const gender = ref('')
  const recentMood = ref([])
  const sleepQuality = ref(3)
  const appetite = ref('normal')
  const exerciseFreq = ref('sometimes')
  const notes = ref('')
  const healthLog = ref([])
  /* ========== [ProfileState] END ========== */

  /* ========== [Computed] - 计算属性 ========== */
  const isProfileComplete = computed(() => {
    return nickname.value.trim() !== '' && gender.value !== ''
  })

  /**
   * 生成用于 System Prompt 的档案摘要
   */
  const profileSummary = computed(() => {
    const parts = []
    if (nickname.value) parts.push(`昵称: ${nickname.value}`)
    if (gender.value) {
      const genderMap = { male: '男', female: '女', other: '其他' }
      parts.push(`性别: ${genderMap[gender.value] || gender.value}`)
    }
    if (recentMood.value.length > 0) {
      parts.push(`近期情绪: ${recentMood.value.join('、')}`)
    }
    parts.push(`睡眠质量: ${sleepQuality.value}/5`)
    const appetiteMap = { normal: '正常', poor: '偏差', bad: '很差' }
    parts.push(`食欲: ${appetiteMap[appetite.value] || appetite.value}`)
    const exerciseMap = { rarely: '几乎不运动', sometimes: '偶尔运动', often: '经常运动' }
    parts.push(`运动频率: ${exerciseMap[exerciseFreq.value] || exerciseFreq.value}`)
    if (notes.value) parts.push(`特殊备注: ${notes.value}`)
    return parts.join('\n')
  })
  /* ========== [Computed] END ========== */

  /* ========== [Methods] - 档案操作方法 ========== */
  function setProfile(profile) {
    if (profile.nickname !== undefined) nickname.value = profile.nickname
    if (profile.gender !== undefined) gender.value = profile.gender
    if (profile.recentMood !== undefined) recentMood.value = profile.recentMood
    if (profile.sleepQuality !== undefined) sleepQuality.value = profile.sleepQuality
    if (profile.appetite !== undefined) appetite.value = profile.appetite
    if (profile.exerciseFreq !== undefined) exerciseFreq.value = profile.exerciseFreq
    if (profile.notes !== undefined) notes.value = profile.notes}

  function addHealthLog(entry) {
    healthLog.value.push({entry,
      date: entry.date || new Date().toISOString().split('T')[0]
    })
  }

  function toggleMood(mood) {
    const index = recentMood.value.indexOf(mood)
    if (index === -1) {
      recentMood.value.push(mood)
    } else {
      recentMood.value.splice(index, 1)
    }
  }
  /* ========== [Methods] END ========== */

  /* ========== [Persistence] - 持久化方法 ========== */
  async function loadFromStorage() {
    const saved = await loadData(STORAGE_KEYS.PROFILE)
    if (saved) {
      nickname.value = saved.nickname || ''
      gender.value = saved.gender || ''
      recentMood.value = saved.recentMood || []
      sleepQuality.value = saved.sleepQuality ?? 3
      appetite.value = saved.appetite || 'normal'
      exerciseFreq.value = saved.exerciseFreq || 'sometimes'
      notes.value = saved.notes || ''
      healthLog.value = saved.healthLog || []
    }
  }

  async function saveToStorage() {
    await saveData(STORAGE_KEYS.PROFILE, {
      nickname: nickname.value,
      gender: gender.value,
      recentMood: recentMood.value,
      sleepQuality: sleepQuality.value,
      appetite: appetite.value,
      exerciseFreq: exerciseFreq.value,
      notes: notes.value,
      healthLog: healthLog.value
    })
  }
  /* ========== [Persistence] END ========== */

  return {
    nickname,
    gender,
    recentMood,
    sleepQuality,
    appetite,
    exerciseFreq,
    notes,
    healthLog,
    isProfileComplete,
    profileSummary,
    setProfile,
    addHealthLog,
    toggleMood,
    loadFromStorage,
    saveToStorage
  }
})
/* ========== [ProfileStore] END ========== */
