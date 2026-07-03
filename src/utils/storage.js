/* ========== [StorageWrapper] - localForage 持久化封装 ========== */
import localforage from 'localforage'

const store = localforage.createInstance({
  name: 'nowheremax',
  storeName: 'app_data',
  description: 'NOwhereMAX 本地数据存储'
})

export const STORAGE_KEYS = {
  CONFIG: 'nowheremax_config',
  PROFILE: 'nowheremax_profile',
  SESSIONS: 'nowheremax_sessions',
  PERSONAS: 'nowheremax_personas',
  SETTINGS: 'nowheremax_settings',
  GIST_ID: 'nowheremax_gist_id'
}

/**
 * 深拷贝，剥离 Vue 响应式Proxy
 * IndexedDB 使用结构化克隆算法，无法克隆 Proxy 对象
 */
function toPlain(value) {
  if (value === null || value === undefined) return value
  if (typeof value !== 'object') return value
  try {
    return JSON.parse(JSON.stringify(value))
  } catch (e) {
    console.warn('[Storage] 深拷贝失败，返回原值:', e)
    return value
  }
}

/**
 * 保存数据
 */
export async function saveData(key, value) {
  try {
    const plainValue = toPlain(value)
    return await store.setItem(key, plainValue)
  } catch (error) {
    console.error(`[Storage] 保存失败 (${key}):`, error)
    throw error
  }
}

/**
 * 读取数据
 */
export async function loadData(key, defaultValue = null) {
  try {
    const value = await store.getItem(key)
    return value !== null ? value : defaultValue
  } catch (error) {
    console.error(`[Storage] 读取失败 (${key}):`, error)
    return defaultValue
  }
}

/**
 * 删除数据
 */
export async function removeData(key) {
  try {
    return await store.removeItem(key)
  } catch (error) {
    console.error(`[Storage] 删除失败 (${key}):`, error)
    throw error
  }
}

/**
 * 清空所有数据
 */
export async function clearAll() {
  try {
    return await store.clear()
  } catch (error) {
    console.error('[Storage] 清空失败:', error)
    throw error
  }
}

/**
 * 检查某个key 是否存在数据
 */
export async function hasData(key) {
  const value = await store.getItem(key)
  return value !== null
}
/* ========== [StorageWrapper] END ========== */
