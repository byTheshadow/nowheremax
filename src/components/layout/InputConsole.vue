<script setup>
/* ========== [Imports] - 依赖导入 ========== */
import { ref } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
/* ========== [Imports] END ========== */

/* ========== [Props/Emits] - 组件接口 ========== */
const emit = defineEmits(['send-message', 'trigger-cbt'])
/* ========== [Props/Emits] END ========== */

/* ========== [StoreRefs] - Store 引用 ========== */
const appStore = useAppStore()
/* ========== [StoreRefs] END ========== */

/* ========== [State] - 组件状态 ========== */
const inputText = ref('')
const isSending = ref(false)
/* ========== [State] END ========== */

/* ========== [Methods] - 操作方法 ========== */
function handleSend() {
  const text = inputText.value.trim()
  if (!text || isSending.value) return

  emit('send-message', text)
  inputText.value = ''
}

function handleCBT() {
  const text = inputText.value.trim()
  if (!text) return

  emit('trigger-cbt', text)
}

function handleKnowledge() {
  appStore.toggleKnowledgePanel()
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
/* ========== [Methods] END ========== */
</script>

<template>
  <!-- ========== [InputConsoleContainer] - 输入舱容器 ========== -->
  <div class="input-console-wrapper">
    <div class="input-console glass">
      <!-- 知识库按钮 -->
      <button
        class="console-btn knowledge-btn"
        title="知识库"
        @click="handleKnowledge"
      >
        📚
      </button>

      <!-- 输入框 -->
      <textarea
        v-model="inputText"
        class="console-input"
        placeholder="输入你的心情..."
        rows="1"
        @keydown="handleKeydown"
      />

      <!-- CBT 魔法棒 -->
      <button
        class="console-btn cbt-btn"
        title="认知重塑"
        :disabled="!inputText.trim()"
        @click="handleCBT"
      >
        ✨
      </button>

      <!-- 发送按钮 -->
      <button
        class="console-btn send-btn"
        title="发送"
        :disabled="!inputText.trim() || isSending"
        @click="handleSend"
      >➤
      </button>
    </div>
  </div>
  <!-- ========== [InputConsoleContainer] END ========== -->
</template>

<style scoped>
/* ========== [InputConsoleLayout] - 输入舱布局 ========== */
.input-console-wrapper {
  flex-shrink: 0;
  padding: 0.75rem 1rem;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
  position: relative;
  z-index: 20;
}

.input-console {
  display: flex;
  align-items: flex-end;
  gap: 0.375rem;
  padding: 0.5rem 0.625rem;
  border-radius: var(--radius-full);
}

.console-input {
  flex: 1;
  min-height: 1.5rem;
  max-height: 6rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-primary);
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  overflow-y: auto;
  scrollbar-width: none;
}

.console-input::-webkit-scrollbar {
  display: none;
}

.console-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.5;
}

.console-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.console-btn:hover:not(:disabled) {
  background: var(--input-bg);transform: scale(1.1);
}

.console-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.send-btn {
  color: var(--accent);
}

.cbt-btn {
  color: var(--text-secondary);
}

.knowledge-btn {
  color: var(--text-secondary);
}
/* ========== [InputConsoleLayout] END ========== */
</style>
