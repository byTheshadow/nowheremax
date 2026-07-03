<script setup>
/* ========== [Imports] - 依赖导入 ========== */
import { inject } from 'vue'
/* ========== [Imports] END ========== */

/* ========== [Composables] - 注入颜文字状态 ========== */
const kaomoji = inject('kaomoji')
/* ========== [Composables] END ========== */
</script>

<template>
  <!-- ========== [KaomojiContainer] - 颜文字展示区 ========== -->
  <div class="kaomoji-container">
    <div class="kaomoji-face">{{ kaomoji.currentKaomoji.value }}</div>
    <div class="kaomoji-quote">{{ kaomoji.currentQuote.value }}</div>
  </div>
  <!-- ========== [KaomojiContainer] END ========== -->
</template>

<style scoped>
/* ========== [KaomojiLayout] - 颜文字区域布局 ========== */
.kaomoji-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  flex-shrink: 0;
}

.kaomoji-face {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  transition: all 0.5s ease;
  user-select: none;
}

.kaomoji-quote {
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-align: center;
  opacity: 0.7;
  max-width: 280px;
  line-height: 1.5;
}
/* ========== [KaomojiLayout] END ========== */
</style>
