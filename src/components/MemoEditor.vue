 <template>
  <div class="memo-editor">
    <div class="editor-header" v-if="currentMemo">
      <el-input
        v-model="currentMemo.title"
        placeholder="请输入标题"
        class="memo-title-input"
        @input="updateMemoTitle"
      />
      <div class="editor-actions">
        <el-button type="primary" @click="saveContent" :loading="saving">
          <el-icon><Check /></el-icon>
          保存
        </el-button>
      </div>
    </div>
    
    <div class="editor-content" v-if="currentMemo">
      <el-input
        v-model="currentMemo.content"
        type="textarea"
        placeholder="开始编辑你的备忘录内容..."
        :autosize="{ minRows: 15, maxRows: 30 }"
        class="memo-content-input"
        @input="handleContentChange"
      />
    </div>
    
    <div v-else class="editor-empty">
      <el-empty description="请选择一个备忘录开始编辑" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../store'
import { ElMessage } from 'element-plus'

const store = useStore()
const currentMemo = computed(() => store.currentMemo)
const saving = ref(false)

const debounceTimeout = ref(null)

function updateMemoTitle() {
  if (!currentMemo.value) return
  
  clearTimeout(debounceTimeout.value)
  debounceTimeout.value = setTimeout(() => {
    store.updateMemo(currentMemo.value.id, { title: currentMemo.value.title })
  }, 500)
}

function handleContentChange() {
  if (!currentMemo.value) return
  
  clearTimeout(debounceTimeout.value)
  debounceTimeout.value = setTimeout(() => {
    saveContent()
  }, 1000)
}

function saveContent() {
  if (!currentMemo.value) return
  
  saving.value = true
  store.updateMemo(currentMemo.value.id, {
    content: currentMemo.value.content
  })
  
  setTimeout(() => {
    saving.value = false
    ElMessage.success('保存成功')
  }, 300)
}
</script>

<style scoped lang="less">
.memo-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .editor-header {
    padding: 16px 24px;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    align-items: center;
    gap: 16px;
    
    .memo-title-input {
      flex: 1;
      
      :deep(.el-input__wrapper) {
        box-shadow: none;
        border: none;
        font-size: 20px;
        font-weight: bold;
        
        &:focus {
          box-shadow: none;
        }
      }
    }
  }
  
  .editor-content {
    flex: 1;
    padding: 24px;
    
    .memo-content-input {
      height: 100%;
      
      :deep(.el-textarea__inner) {
        border: none;
        resize: none;
        font-size: 16px;
        line-height: 1.6;
        
        &:focus {
          box-shadow: none;
        }
      }
    }
  }
  
  .editor-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
