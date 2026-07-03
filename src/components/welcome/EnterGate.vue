<script setup>
/* ========== [Imports] - 依赖导入 ========== */
import { ref } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
/* ========== [Imports] END ========== */

/* ========== [StoreRefs] - Store 引用 ========== */
const appStore = useAppStore()
/* ========== [StoreRefs] END ========== */

/* ========== [State] - 组件状态 ========== */
const isEntering = ref(false)
/* ========== [State] END ========== */

/* ========== [Methods] - 进入空间逻辑 ========== */
function enterSpace() {
  if (isEntering.value) return
  isEntering.value = true

  // 注意：如果未来有音频播放，必须在此同步上下文中调用 audio.play()
  // audioElement.play()

  // 延迟一下让动画播放
  setTimeout(() => {
    // 用 onboardingCompleted 判断而不是 isConfigured
    // 这样即使 IndexedDB 里有残留的 baseURL/apiKey，也不会跳过引导
    if (appStore.onboardingCompleted) {
      appStore.navigateTo('main')
    } else {
      appStore.navigateTo('onboarding')
    }
  }, 600)
}
/* ========== [Methods] END ========== */
</script>

<template>
  <!-- ========== [GateContainer] - 欢迎页容器 ========== -->
  <div
    class="gate-container"
    :class="{ 'gate-leaving': isEntering }"
  >
    <!-- ========== [Logo] - Logo 与颜文字 ========== -->
    <div class="gate-content">
      <div class="gate-kaomoji">(●—●)</div>
      <h1 class="gate-title">NOwhereMAX</h1>
      <p class="gate-subtitle">你的 AI 陪伴空间</p>
    </div>
    <!-- ========== [Logo] END ========== -->

    <!-- ========== [EnterButton] - 进入按钮 ========== -->
    <button
      class="gate-button"
      :disabled="isEntering"
      @click="enterSpace"
    >
      进入空间
    </button>
    <!-- ========== [EnterButton] END ========== -->

    <!-- ========== [Footer] - 底部水印 ========== -->
    <div class="gate-footer">
      NOwhereMAX v1.0 · by Shadow
    </div>
    <!-- ========== [Footer] END ========== -->
  </div>
  <!-- ========== [GateContainer] END ========== -->
</template>

<style scoped>
/* ========== [Container] - 容器样式 ========== */
.gate-container {
  width: 100%;
  height: 100dvh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #0D1117;
  color: #E6EDF3;
  position: relative;
  transition: opacity 0.6s ease;
}

.gate-leaving {
  opacity: 0;
}
/* ========== [Container] END ========== */

/* ========== [Content] - 内容区域 ========== */
.gate-content {
  text-align: center;
  margin-bottom: 3rem;
}

.gate-kaomoji {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: breathe 3s ease-in-out infinite;
}

.gate-title {
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 0.3em;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.gate-subtitle {
  font-size: 0.875rem;
  opacity: 0.5;
  letter-spacing: 0.1em;
}
/* ========== [Content] END ========== */

/* ========== [Button] - 进入按钮 ========== */
.gate-button {
  padding: 0.75rem 2.5rem;
  border-radius: var(--radius-full);
  background: rgba(124, 158, 181, 0.15);
  border: 1px solid rgba(124, 158, 181, 0.3);
  color: #7C9EB5;
  font-size: 0.9rem;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: breathe 3s ease-in-out infinite;
  animation-delay: 1.5s;
}

.gate-button:hover {
  background: rgba(124, 158, 181, 0.25);
  border-color: rgba(124, 158, 181, 0.5);
  transform: scale(1.02);
}

.gate-button:active {
  transform: scale(0.98);
}

.gate-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
/* ========== [Button] END ========== */

/* ========== [Footer] - 底部水印 ========== */
.gate-footer {
  position: absolute;
  bottom: 2rem;
  font-size: 0.75rem;
  opacity: 0.3;
}
/* ========== [Footer] END ========== */
</style>
