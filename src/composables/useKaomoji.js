/* ========== [UseKaomoji] - 颜文字状态管理逻辑 ========== */
import { ref, computed } from 'vue'
import { FALLBACK_KAOMOJIS, HEALING_QUOTES } from '@/utils/constants'

export function useKaomoji() {

  /* ========== [State] - 颜文字状态 ========== */
  const currentKaomoji = ref(FALLBACK_KAOMOJIS.idle)
  const currentQuote = ref('')
  /* ========== [State] END ========== */

  /* ========== [Methods] - 颜文字操作 ========== */

  /**
   * 从 AI 回复中提取颜文字
   * @param {string} text - AI 回复原文
   * @returns {{ kaomoji: string|null, cleanText: string }}
   */
  function extractKaomoji(text) {
    const match = text.match(/\[\[kaomoji:(.+?)\]\]/)
    if (match) {
      return {
        kaomoji: match[1].trim(),
        cleanText: text.replace(match[0], '').trim()
      }
    }
    return { kaomoji: null, cleanText: text }
  }

  /**
   * 更新当前颜文字
   * @param {string} kaomoji - 新的颜文字
   */
  function setKaomoji(kaomoji) {
    if (kaomoji) {
      currentKaomoji.value = kaomoji
    }
  }

  /**
   * 设置为兜底颜文字
   * @param {string} mood - 情绪键名（对应 FALLBACK_KAOMOJIS 的 key）
   */
  function setFallbackKaomoji(mood) {
    currentKaomoji.value = FALLBACK_KAOMOJIS[mood] || FALLBACK_KAOMOJIS.idle
  }

  /**
   * 随机获取一条疗愈箴言
   */
  function refreshQuote() {
    const index = Math.floor(Math.random() * HEALING_QUOTES.length)
    currentQuote.value = HEALING_QUOTES[index]
  }

  /**
   * 重置为待机状态
   */
  function resetToIdle() {
    currentKaomoji.value = FALLBACK_KAOMOJIS.idle
    refreshQuote()
  }
  /* ========== [Methods] END ========== */

  // 初始化时随机一条箴言
  refreshQuote()

  return {
    currentKaomoji,
    currentQuote,
    extractKaomoji,
    setKaomoji,
    setFallbackKaomoji,
    refreshQuote,
    resetToIdle
  }
}
/* ========== [UseKaomoji] END ========== */
