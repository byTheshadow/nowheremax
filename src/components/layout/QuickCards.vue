<script setup>
/* ========== [Imports] - 依赖导入 ========== */
import { ref } from 'vue'
import { DEFAULT_QUICK_CARDS } from '@/utils/constants'
/* ========== [Imports] END ========== */

/* ========== [Props/Emits] - 组件接口 ========== */
const emit = defineEmits(['select-card'])
/* ========== [Props/Emits] END ========== */

/* ========== [State] - 组件状态 ========== */
const cards = ref([...DEFAULT_QUICK_CARDS])
/* ========== [State] END ========== */

/* ========== [Methods] - 操作方法 ========== */
function handleCardClick(card) {
  emit('select-card', card)
}
/* ========== [Methods] END ========== */
</script>

<template>
  <!-- ========== [QuickCardsContainer] - 快捷卡片容器 ========== -->
  <div class="quick-cards-wrapper">
    <div class="quick-cards-scroll">
      <button
        v-for="card in cards"
        :key="card.id"
        class="quick-card glass"
        @click="handleCardClick(card)"
      >
        <span class="card-emoji">{{ card.emoji }}</span>
        <span class="card-label">{{ card.label }}</span>
      </button>
    </div>
  </div>
  <!-- ========== [QuickCardsContainer] END ========== -->
</template>

<style scoped>
/* ========== [QuickCardsLayout] - 快捷卡片布局 ========== */
.quick-cards-wrapper {
  flex-shrink: 0;
  padding: 01rem;
  margin-bottom: 0.5rem;
}

.quick-cards-scroll {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.quick-cards-scroll::-webkit-scrollbar {
  display: none;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-full);
  white-space: nowrap;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.quick-card:hover {
  border-color: var(--accent);transform: translateY(-1px);
}

.quick-card:active {
  transform: translateY(0) scale(0.98);
}

.card-emoji {
  font-size: 0.9rem;
}

.card-label {
  color: var(--text-primary);
}
/* ========== [QuickCardsLayout] END ========== */
</style>
