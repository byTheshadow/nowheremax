/* ========== [StorageWrapper] - localForage 持久化封装 ========== */
import localforage from 'localforage'

/**
 * 初始化 localForage 实例
 */
const store = localforage.createInstance({
  name: 'nowheremax',
  storeName: 'app_data',
  description: 'NOwhereMAX 本地数据存储'
})

/**
 * 存储键常量
 */
export const STORAGE_KEYS = {
  CONFIG: 'nowheremax_config',
  PROFILE: 'nowheremax_profile',SESSIONS: 'nowheremax_sessions',
  PERSONAS: 'nowheremax_personas',
  SETTINGS: 'nowheremax_settings',
  GIST_ID: 'nowheremax_gist_id'
}

/**
 * 保存数据
 * @param {string} key - 存储键
 * @param {*} value - 要存储的值
 * @returns {Promise<*>}
 */
export async function saveData(key, value) {
  try {
    return await store.setItem(key, value)
  } catch (error) {
    console.error(`[Storage] 保存失败(${key}):`, error)
    throw error
  }
}

/**
 * 读取数据
 * @param {string} key - 存储键
 * @param {*} defaultValue - 默认值（key 不存在时返回）
 * @returns {Promise<*>}
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
 * @param {string} key - 存储键
 * @returns {Promise<void>}
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
 * @returns {Promise<void>}
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
 * 检查某个 key 是否存在数据
 * @param {string} key - 存储键
 * @returns {Promise<boolean>}
 */
export async function hasData(key) {
  const value = await store.getItem(key)
  return value !== null
}
/* ========== [StorageWrapper] END ========== */
