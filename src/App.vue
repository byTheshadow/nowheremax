<script setup>
/* ========== [Imports] - 依赖导入 ========== */
import { ref, onMounted, provide } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useConfigStore } from '@/stores/useConfigStore'
import { useProfileStore } from '@/stores/useProfileStore'
import { useTheme } from '@/composables/useTheme'
import { useKaomoji } from '@/composables/useKaomoji'
import EnterGate from '@/components/welcome/EnterGate.vue'
import Onboarding from '@/components/welcome/Onboarding.vue'
import TopBar from '@/components/layout/TopBar.vue'
import KaomojiDisplay from '@/components/layout/KaomojiDisplay.vue'
import QuickCards from '@/components/layout/QuickCards.vue'
import InputConsole from '@/components/layout/InputConsole.vue'
/* ========== [Imports] END ========== */

/* ========== [StoreInit] - Store 初始化 ========== */
const appStore = useAppStore()
const configStore = useConfigStore()
const profileStore = useProfileStore()
/* ========== [StoreInit] END ========== */

/* ========== [Composables] - Composable 初始化 ========== */
const { actualTheme } = useTheme()
const kaomoji = useKaomoji()
provide('kaomoji', kaomoji)
/* ========== [Composables] END ========== */

/* ========== [State] - 本地状态 ========== */
const isLoading = ref(true)
/* ========== [State] END ========== */

/* ========== [Lifecycle] - 应用初始化 ========== */
onMounted(async () => {
  try {
    await appStore.loadFromStorage()
    await configStore.loadFromStorage()
    await profileStore.loadFromStorage()
  } catch (error) {
    console.error('[App] 初始化加载失败:', error)
  } finally {
    isLoading.value = false
    appStore.isInitialized = true
  }
})
/* ========== [Lifecycle] END ========== */
</script>

<template>
  <!--========== [LoadingScreen] - 加载屏幕 ========== -->
  <div
    v-if="isLoading"
    class="fixed inset-0 flex items-center justify-center"
    style="background-color: var(--bg-primary)"
  >
    <div class="text-4xl" style="animation: breathe 2s ease-in-out infinite">
      (●—●)
    </div>
  </div>
  <!-- ========== [LoadingScreen] END ========== -->

  <!-- ========== [ViewRouter] - 视图调度器 ========== -->
  <template v-else>
    <!-- 进入空间 -->
    <Transition name="fade">
      <EnterGate v-if="appStore.currentView === 'gate'" />
    </Transition>

    <!-- 引导流程 -->
    <Transition name="fade">
      <Onboarding v-if="appStore.currentView === 'onboarding'" />
    </Transition>

    <!-- 主界面 -->
    <Transition name="fade">
      <div
        v-if="appStore.currentView === 'main'"
        class="main-view"
      >
        <TopBar />
        <KaomojiDisplay />
        <QuickCards />

        <!-- ChatFlow 占位 - Phase 2 实现 -->
        <div class="chat-placeholder">
          <p style="color: var(--text-secondary)">对话区域 · Phase 2</p>
        </div><InputConsole />
      </div>
    </Transition>
  </template>
  <!-- ========== [ViewRouter] END ========== -->
</template>

<style scoped>
/* ========== [ViewLayout] - 视图布局 ========== */
.main-view {
  width: 100%;
  height: 100dvh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background-color: var(--bg-primary);
}

.chat-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.4;
  font-size: 0.875rem;
}
/* ========== [ViewLayout] END ========== */

/* ========== [Transitions] - 视图过渡动画 ========== */
.fade-enter-active {
  animation: fadeIn 0.5s ease;
}

.fade-leave-active {
  animation: fadeOut 0.3s ease;position: absolute;
  inset: 0;
}
/* ========== [Transitions] END ========== */
</style>
