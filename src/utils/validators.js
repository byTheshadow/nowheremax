/* ========== [InputValidators] - 输入验证工具 ========== */

/**
 * 验证 Base URL格式
 * @param {string} url
 * @returns {boolean}
 */
export function isValidBaseURL(url) {
  if (!url || typeof url !== 'string') return false
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

/**
 * 验证 API Key 格式（非空即可，不做严格校验）
 * @param {string} key
 * @returns {boolean}
 */
export function isValidAPIKey(key) {
  return typeof key === 'string' && key.trim().length > 0
}

/**
 * 验证模型是否已选择
 * @param {string} model
 * @returns {boolean}
 */
export function isValidModel(model) {
  return typeof model === 'string' && model.trim().length > 0
}

/**
 * 验证昵称
 * @param {string} nickname
 * @returns {boolean}
 */
export function isValidNickname(nickname) {
  return typeof nickname === 'string' && nickname.trim().length > 0&& nickname.trim().length <= 20
}

/**
 * 验证性别
 * @param {string} gender
 * @returns {boolean}
 */
export function isValidGender(gender) {
  return ['male', 'female', 'other'].includes(gender)
}

/**
 * 验证 GitHub PAT 格式
 * @param {string} token
 * @returns {boolean}
 */
export function isValidGitHubToken(token) {
  if (!token || typeof token !== 'string') return false
  return token.startsWith('ghp_') || token.startsWith('github_pat_')
}
/* ========== [InputValidators] END ========== */
