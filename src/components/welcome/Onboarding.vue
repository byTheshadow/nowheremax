<script setup>
/*========== [Imports] - 依赖导入 ========== */
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useConfigStore } from '@/stores/useConfigStore'
import { useProfileStore } from '@/stores/useProfileStore'
/* ========== [Imports] END ========== */

/* ========== [StoreRefs] - Store 引用 ========== */
const appStore = useAppStore()
const configStore = useConfigStore()
const profileStore = useProfileStore()
/* ========== [StoreRefs] END ========== */

/* ========== [State] - 组件状态 ========== */
const currentStep = ref(1)
const totalSteps = 3

// Step 1: API 配置
const localBaseURL = ref(configStore.baseURL || 'https://api.openai.com/v1')
const localApiKey = ref(configStore.apiKey || '')
const localModel = ref(configStore.model || '')
const localModelInput = ref(configStore.model || '')
const modelList = ref([])
const isFetchingModels = ref(false)
const modelFetchError = ref('')
const useManualModel = ref(true)

// Step 2: 健康档案
const localNickname = ref(profileStore.nickname || '')
const localGender = ref(profileStore.gender || '')
const localMoods = ref([...(profileStore.recentMood || [])])
const localSleep = ref(profileStore.sleepQuality || 3)
const localAppetite = ref(profileStore.appetite || 'normal')
const localExercise = ref(profileStore.exerciseFreq || 'sometimes')
const localNotes = ref(profileStore.notes || '')

// Step 3: GitHub
const localGithubToken = ref(configStore.githubToken || '')

// 情绪选项
const moodOptions = ['焦虑', '低落', '平静', '亢奋', '疲惫', '开心', '迷茫', '愤怒']
/* ========== [State] END ========== */

/* ========== [Computed] - 步骤验证 ========== */
const effectiveModel = computed(() => {
  if (useManualModel.value) {
    return localModelInput.value.trim()
  }
  return localModel.value.trim()
})

const isBaseURLValid = computed(() => {
  if (!localBaseURL.value || typeof localBaseURL.value !== 'string') return false
  try {
    const parsed = new URL(localBaseURL.value)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
})

const isApiKeyValid = computed(() => {
  return typeof localApiKey.value === 'string' && localApiKey.value.trim().length > 0
})

const isModelValid = computed(() => {
  return effectiveModel.value.length > 0
})

const canProceedStep1 = computed(() => {
  return isBaseURLValid.value && isApiKeyValid.value && isModelValid.value
})

const canProceedStep2 = computed(() => {
  return localNickname.value.trim() !== '' &&
    ['male', 'female', 'other'].includes(localGender.value)
})
/* ========== [Computed] END ========== */

/* ========== [Methods] - 操作方法 ========== */
async function handleFetchModels() {
  if (!isBaseURLValid.value || !isApiKeyValid.value) {
    modelFetchError.value = '请先填写有效的 Base URL 和 API Key'
    return
  }

  isFetchingModels.value = true
  modelFetchError.value = ''

  try {
    const res = await fetch(`${localBaseURL.value}/models`, {
      headers: { 'Authorization': `Bearer ${localApiKey.value}` }
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }

    const json = await res.json()
    const models = json.data || json.models || json

    if (Array.isArray(models)) {
      modelList.value = models.map(m => m.id || m.name || m).filter(Boolean).sort()
      if (modelList.value.length > 0) {
        useManualModel.value = falsemodelFetchError.value = ''
      } else {
        modelFetchError.value = '未找到模型，请手动输入'
        useManualModel.value = true
      }
    } else {
      modelFetchError.value = '返回格式异常，请手动输入'
      useManualModel.value = true
    }
  } catch (error) {
    modelFetchError.value = `获取失败: ${error.message}`
    useManualModel.value = true
  } finally {
    isFetchingModels.value = false
  }
}

function toggleManualMode() {
  useManualModel.value = !useManualModel.value
  if (useManualModel.value) {
    localModelInput.value = localModel.value || ''
  }
}

function toggleMood(mood) {
  const index = localMoods.value.indexOf(mood)
  if (index === -1) {
    localMoods.value.push(mood)
  } else {
    localMoods.value.splice(index, 1)
  }
}

function nextStep() {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

async function finishOnboarding() {
  configStore.setAPIConfig({
    baseURL: localBaseURL.value,
    apiKey: localApiKey.value,
    model: effectiveModel.value
  })
  configStore.setGitHubToken(localGithubToken.value)
  await configStore.saveToStorage()

  profileStore.setProfile({
    nickname: localNickname.value,
    gender: localGender.value,
    recentMood: localMoods.value,
    sleepQuality: localSleep.value,
    appetite: localAppetite.value,
    exerciseFreq: localExercise.value,
    notes: localNotes.value
  })
  await profileStore.saveToStorage()

  appStore.navigateTo('main')
}

function skipAndFinish() {
  localGithubToken.value = ''
  finishOnboarding()
}
/* ========== [Methods] END ========== */
</script>

<template>
  <!--========== [OnboardingContainer] - 引导容器 ========== -->
  <div class="onboarding-container">
    <div class="onboarding-card glass">

      <!-- ========== [ProgressBar] - 进度指示 ========== -->
      <div class="progress-bar">
        <div
          v-for="step in totalSteps"
          :key="step"
          class="progress-dot"
          :class="{ active: step <= currentStep }"
        />
      </div>
      <!-- ========== [ProgressBar] END ========== -->

      <!-- ========== [Step1] - API 配置 ========== -->
      <div v-if="currentStep === 1" class="step-content">
        <h2 class="step-title">"请赋予我灵魂"</h2>
        <p class="step-desc">配置 AI 引擎，让我能够思考</p>

        <div class="form-group">
          <label class="form-label">Base URL</label>
          <input
            v-model="localBaseURL"
            type="url"
            class="form-input"
            placeholder="https://api.openai.com/v1"
          />
        </div>

        <div class="form-group">
          <label class="form-label">API Key</label>
          <input
            v-model="localApiKey"
            type="password"
            class="form-input"
            placeholder="sk-..."
          />
        </div>

        <div class="form-group">
          <label class="form-label"><span>Model</span>
            <button class="toggle-mode-btn" @click="toggleManualMode">
              {{ useManualModel ? '尝试自动获取' : '手动输入' }}
            </button>
          </label>

          <div v-if="!useManualModel" class="model-row">
            <select v-model="localModel" class="form-select">
              <option value="" disabled>请选择模型</option>
              <option v-for="m in modelList" :key="m" :value="m">{{ m }}</option>
            </select>
            <button
              class="refresh-btn"
              :disabled="isFetchingModels"
              @click="handleFetchModels"
            >
              {{ isFetchingModels ? '...' : '🔄' }}
            </button>
          </div>

          <div v-else>
            <input
              v-model="localModelInput"
              type="text"
              class="form-input"
              placeholder="如deepseek-chat、gpt-4o"
            /></div>

          <p v-if="modelFetchError" class="form-error">{{ modelFetchError }}</p>
        </div>

        <div class="validation-status">
          <span :class="isBaseURLValid ? 'check-ok' : 'check-no'">
            {{ isBaseURLValid ? '✓' : '○' }} Base URL
          </span>
          <span :class="isApiKeyValid ? 'check-ok' : 'check-no'">
            {{ isApiKeyValid ? '✓' : '○' }} API Key
          </span>
          <span :class="isModelValid ? 'check-ok' : 'check-no'">
            {{ isModelValid ? '✓' : '○' }} Model
          </span>
        </div>

        <div class="step-actions">
          <div></div>
          <button
            class="btn-primary"
            :disabled="!canProceedStep1"
            @click="nextStep"
          >
            下一步 →
          </button>
        </div>
      </div>
      <!-- ========== [Step1] END ========== -->

      <!-- ========== [Step2] - 健康档案 ========== -->
      <div v-if="currentStep === 2" class="step-content">
        <h2 class="step-title">"让我了解你"</h2>
        <p class="step-desc">这些信息会帮助我更好地陪伴你</p>

        <div class="form-group">
          <label class="form-label">昵称 <span class="required">*</span></label>
          <input
            v-model="localNickname"
            type="text"
            class="form-input"
            placeholder="你希望我怎么称呼你？"
            maxlength="20"
          />
        </div>

        <div class="form-group">
          <label class="form-label">性别 <span class="required">*</span></label>
          <div class="radio-group">
            <label class="radio-item" :class="{ selected: localGender === 'male' }">
              <input type="radio" v-model="localGender" value="male" class="sr-only" />
              <span>男</span>
            </label>
            <label class="radio-item" :class="{ selected: localGender === 'female' }">
              <input type="radio" v-model="localGender" value="female" class="sr-only" />
              <span>女</span>
            </label>
            <label class="radio-item" :class="{ selected: localGender === 'other' }">
              <input type="radio" v-model="localGender" value="other" class="sr-only" />
              <span>其他</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">近期情绪</label>
          <div class="mood-tags">
            <button
              v-for="mood in moodOptions"
              :key="mood"
              class="mood-tag"
              :class="{ selected: localMoods.includes(mood) }"
              @click="toggleMood(mood)"
            >
              {{ mood }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">睡眠质量</label>
          <div class="star-rating">
            <button
              v-for="star in 5"
              :key="star"
              class="star-btn"
              :class="{ active: star <= localSleep }"
              @click="localSleep = star"
            >
              {{ star <= localSleep ? '★' : '☆' }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">食欲</label>
          <div class="radio-group">
            <label class="radio-item" :class="{ selected: localAppetite === 'normal' }">
              <input type="radio" v-model="localAppetite" value="normal" class="sr-only" />
              <span>正常</span>
            </label>
            <label class="radio-item" :class="{ selected: localAppetite === 'poor' }">
              <input type="radio" v-model="localAppetite" value="poor" class="sr-only" />
              <span>偏差</span>
            </label>
            <label class="radio-item" :class="{ selected: localAppetite === 'bad' }">
              <input type="radio" v-model="localAppetite" value="bad" class="sr-only" />
              <span>很差</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">运动频率</label>
          <div class="radio-group">
            <label class="radio-item" :class="{ selected: localExercise === 'rarely' }">
              <input type="radio" v-model="localExercise" value="rarely" class="sr-only" />
              <span>几乎不</span>
            </label>
            <label class="radio-item" :class="{ selected: localExercise === 'sometimes' }">
              <input type="radio" v-model="localExercise" value="sometimes" class="sr-only" />
              <span>偶尔</span>
            </label>
            <label class="radio-item" :class="{ selected: localExercise === 'often' }">
              <input type="radio" v-model="localExercise" value="often" class="sr-only" />
              <span>经常</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">特殊备注</label>
          <textarea
            v-model="localNotes"
            class="form-textarea"
            placeholder="如过敏、用药、慢性病等（可选）"
            rows="2"
          />
        </div>

        <div class="step-actions">
          <button class="btn-secondary" @click="prevStep">← 上一步</button>
          <button
            class="btn-primary"
            :disabled="!canProceedStep2"
            @click="nextStep"
          >
            下一步 →
          </button>
        </div>
      </div>
      <!-- ========== [Step2] END ========== -->

      <!-- ========== [Step3] - 云端备份 ========== -->
      <div v-if="currentStep === 3" class="step-content">
        <h2 class="step-title">"要我帮你记住一切吗？"</h2>
        <p class="step-desc">通过 GitHub Gist 备份你的记忆（可选）</p>

        <div class="form-group">
          <label class="form-label">GitHub Personal Access Token</label>
          <input
            v-model="localGithubToken"
            type="password"
            class="form-input"
            placeholder="ghp_..."
          />
          <p class="form-hint">
            用于将对话和配置备份到你的 GitHub Gist，完全私密。
          </p>
        </div>

        <div class="step-actions">
          <button class="btn-secondary" @click="prevStep">← 上一步</button>
          <div class="action-group">
            <button class="btn-secondary" @click="skipAndFinish">跳过</button>
            <button class="btn-primary" @click="finishOnboarding">完成 ✓</button>
          </div>
        </div>
      </div>
      <!-- ========== [Step3] END ========== -->

    </div>
  </div><!-- ========== [OnboardingContainer] END ========== -->
</template>

<style scoped>
/* ========== [Container] - 容器布局 ========== */
.onboarding-container {
  width: 100%;
  height: 100dvh;
  height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1rem;
  background-color: var(--bg-primary);
  overflow-y: auto;
}

.onboarding-card {
  width: 100%;
  max-width: 480px;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  animation: fadeInUp 0.5s ease;
}
/* ========== [Container] END ========== */

/* ========== [Progress] - 进度指示器 ========== */
.progress-bar {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-secondary);
  opacity: 0.3;
  transition: all 0.3s ease;
}

.progress-dot.active {
  opacity: 1;
  background: var(--accent);width: 24px;
  border-radius: var(--radius-full);
}
/* ========== [Progress] END ========== */

/* ========== [StepContent] - 步骤内容 ========== */
.step-content {
  animation: fadeIn 0.3s ease;
}

.step-title {
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 0.375rem;
  color: var(--text-primary);
}

.step-desc {
  font-size: 0.8rem;
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 1.25rem;
}
/* ========== [StepContent] END ========== */

/* ========== [FormElements] - 表单元素 ========== */
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.375rem;
}

.required {
  color: #e57373;
}

.toggle-mode-btn {
  font-size: 0.7rem;
  color: var(--accent);
  cursor: pointer;
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
  transition: all 0.3s ease;
}

.toggle-mode-btn:hover {
  background: rgba(124, 158, 181, 0.1);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  background: var(--input-bg);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 0.85rem;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--accent);
}

.form-select {
  appearance: none;
  cursor: pointer;
}

.form-textarea {
  resize: vertical;
  min-height: 50px;
}

.form-error {
  font-size: 0.7rem;
  color: #e5a373;
  margin-top: 0.25rem;
}

.form-hint {
  font-size: 0.7rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  opacity: 0.7;
}

.model-row {
  display: flex;
  gap: 0.5rem;
}

.model-row .form-select {
  flex: 1;
}

.refresh-btn {
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  background: var(--input-bg);
  border: 1px solid var(--border);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  border-color: var(--accent);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
/* ========== [FormElements] END ========== */

/* ========== [ValidationStatus] - 验证状态 ========== */
.validation-status {
  display: flex;
  gap: 1rem;
  font-size: 0.7rem;
  margin-bottom: 0.5rem;
}

.check-ok {
  color: #81c784;
}

.check-no {
  color: var(--text-secondary);
  opacity: 0.5;
}
/* ========== [ValidationStatus] END ========== */

/* ========== [RadioGroup] - 单选按钮组 ========== */
.radio-group {
  display: flex;
  gap: 0.5rem;flex-wrap: wrap;
}

.radio-item {
  padding: 0.4rem 0.875rem;
  border-radius: var(--radius-sm);
  background: var(--input-bg);
  border: 1px solid var(--border);
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.radio-item:hover {
  border-color: var(--accent);
}

.radio-item.selected {
  background: rgba(124, 158, 181, 0.15);
  border-color: var(--accent);
  color: var(--accent);
}
/* ========== [RadioGroup] END ========== */

/* ========== [MoodTags] - 情绪标签 ========== */
.mood-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.mood-tag {
  padding: 0.3rem 0.625rem;
  border-radius: var(--radius-full);
  background: var(--input-bg);
  border: 1px solid var(--border);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mood-tag:hover {
  border-color: var(--accent);
}

.mood-tag.selected {
  background: rgba(124, 158, 181, 0.2);
  border-color: var(--accent);
  color: var(--accent);
}
/* ========== [MoodTags] END ========== */

/* ========== [StarRating] - 星级评分 ========== */
.star-rating {
  display: flex;
  gap: 0.25rem;
}

.star-btn {
  font-size: 1.25rem;
  cursor: pointer;
  transition: transform 0.2s ease;color: var(--text-secondary);
}

.star-btn.active {
  color: #F5C842;
}

.star-btn:hover {
  transform: scale(1.2);
}
/* ========== [StarRating] END ========== */

/* ========== [Actions] - 操作按钮 ========== */
.step-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
}

.action-group {
  display: flex;
  gap: 0.5rem;
}

.btn-primary {
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-full);
  background: var(--accent);
  color: #FFFFFF;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover);
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-full);
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}
/* ========== [Actions] END ========== */
</style>
