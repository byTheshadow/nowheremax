/* ========== [TextFormatters] - 文本格式化工具 ========== */

/**
 * 生成唯一 ID
 * @param {string} prefix - ID 前缀
 * @returns {string}
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/**
 * 格式化时间戳为可读时间
 * @param {number} timestamp - 毫秒时间戳
 * @returns {string}
 */
export function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  if (isToday) {
    return `${hours}:${minutes}`
  }

  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${month}/${day} ${hours}:${minutes}`
}

/**
 * 截断文本
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string}
 */
export function truncateText(text, maxLength = 30) {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * 遮蔽敏感信息（如 API Key）
 * @param {string} text - 原始文本
 * @param {number} visibleStart - 开头可见字符数
 * @param {number} visibleEnd - 结尾可见字符数
 * @returns {string}
 */
export function maskSensitive(text, visibleStart = 4, visibleEnd = 4) {
  if (!text || text.length <= visibleStart + visibleEnd) return text
  const start = text.slice(0, visibleStart)
  const end = text.slice(-visibleEnd)
  return `${start}${'•'.repeat(8)}${end}`
}
/* ========== [TextFormatters] END ========== */
