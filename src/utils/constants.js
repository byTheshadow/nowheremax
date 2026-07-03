/* ========== [KaomojiFallbacks] - 兜底颜文字集========== */
export const FALLBACK_KAOMOJIS = {
  idle: '(●—●)',
  thinking: '(⌐■_■)',
  suggest: '(˘▽˘)っ♨',
  happy: '(◕‿◕✿)',
  empathy: '(´;ω;`)',
  greeting: '(｡◕‿◕｡)ﾉ',
  sleepy: '(￣o￣) . z Z',
  excited: '٩(◕‿◕｡)۶',
  confused: '(◎_◎;)',
  love: '(♥ω♥*)',
  cool: '(⌐■_■)👍',
  worried: '(；′⌒`)'
}
/* ========== [KaomojiFallbacks] END ========== */

/* ========== [HealingQuotes] - 疗愈箴言池 ========== */
export const HEALING_QUOTES = [
  '今天也要好好吃饭哦',
  '你已经做得很好了',
  '深呼吸，一切都会好的',
  '此刻的你，值得被温柔以待',
  '慢慢来，不着急',
  '你不需要完美，你只需要是你',
  '累了就休息，没关系的',
  '每一天都是新的开始',
  '你的感受很重要',
  '在这里，你可以做自己',
  '今天的月亮也很温柔呢',
  '喝杯温水吧，暖暖的',
  '你值得所有美好的事物',
  '没有过不去的坎，只有过不完的夜',
  '此刻安好，便是晴天'
]
/* ========== [HealingQuotes] END ========== */

/* ========== [WeatherFallbacks] - 天气获取失败时的兜底文案 ========== */
export const WEATHER_FALLBACK_MESSAGES = [
  '🌙 今夜有你',
  '🌸 此刻安好',
  '✨ 你在就好',
  '🍃 深呼吸',
  '🌊 一切都会好的'
]
/* ========== [WeatherFallbacks] END ========== */

/* ========== [ErrorMessages] - API 错误信息映射 ========== */
export const ERROR_MESSAGES = {
  401: '🔑 API Key 无效，请在设置中检查',
  403: '🚫 没有权限访问该模型',
  429: '⏳ 请求太频繁，请稍后再试',
  500: '💥 服务器内部错误，请稍后再试',
  502: '🌐 网关错误，API 服务可能暂时不可用',
  network: '📡 网络连接失败，请检查网络',
  timeout: '⏰ 请求超时，请重试'
}
/* ========== [ErrorMessages] END ========== */

/* ========== [DefaultQuickCards] - 默认快捷情绪卡片 ========== */
export const DEFAULT_QUICK_CARDS = [
  {
    id: 'card_battery',
    label: '电量1%',
    emoji: '🪫',
    prompt: '我感觉自己像手机电量只剩1%一样，完全没有力气了...'
  },
  {
    id: 'card_anxious',
    label: '有点焦虑',
    emoji: '🌪️',
    prompt: '我现在感到很焦虑，心里很不安，不知道该怎么办...'
  },
  {
    id: 'card_music',
    label: '分享歌单',
    emoji: '🎵',
    prompt: '我想分享一首歌给你，帮我分析一下这首歌传达的情绪：'
  },
  {
    id: 'card_insomnia',
    label: '睡不着',
    emoji: '🌙',
    prompt: '我又失眠了，翻来覆去睡不着，脑子里一直在想事情...'
  },
  {
    id: 'card_hug',
    label: '想要抱抱',
    emoji: '🫂',
    prompt: '我现在很需要一个拥抱，感觉很孤独...'
  }
]
/* ========== [DefaultQuickCards] END ========== */
