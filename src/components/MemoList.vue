 <template>
  <div class="memo-list">
    <div class="memo-header">
      <h3>📝 待办事项</h3>
      <div class="memo-actions">
        <el-button type="primary" size="small" @click="addMemo">
          <el-icon><Plus /></el-icon>
          新建备忘录
        </el-button>
        <el-button 
          type="danger" 
          size="small" 
          @click="clearAllMemos"
          :disabled="memos.length === 0"
        >
          <el-icon><Delete /></el-icon>
          清空全部
        </el-button>
      </div>
    </div>
    
    <el-scrollbar class="memos-scrollbar">
      <div 
        v-for="memo in memos" 
        :key="memo.id"
        :class="['memo-item', { active: memo.id === selectedMemoId }]"
        @click="selectMemo(memo.id)"
      >
        <div class="memo-checkbox">
          <el-checkbox 
            v-model="memo.completed"
            @change="updateMemoStatus(memo.id, memo.completed)"
          />
        </div>
        <div class="memo-content">
          <div class="memo-title">
            <span :class="{ completed: memo.completed }">{{ memo.title }}</span>
          </div>
          <div class="memo-preview" v-if="memo.content">
            {{ memo.content.substring(0, 50) }}{{ memo.content.length > 50 ? '...' : '' }}
          </div>
        </div>
        <div class="memo-actions">
          <el-button 
            type="text" 
            size="small" 
            @click.stop="deleteMemo(memo.id)"
            title="删除"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </div>
      
      <div v-if="memos.length === 0" class="empty-state">
        <el-empty description="暂无待办事项" />
      </div>
    </el-scrollbar>
    
    <!-- 添加备忘录对话框 -->
    <el-dialog 
      v-model="showAddMemoDialog" 
      title="新建备忘录"
      width="400px"
    >
      <el-form :model="memoForm" label-width="80px">
        <el-form-item label="标题">
          <el-input 
            v-model="memoForm.title" 
            placeholder="请输入备忘录标题"
            @keyup.enter="saveMemo"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddMemoDialog = false">取消</el-button>
        <el-button type="primary" @click="saveMemo">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../store'
import { ElMessageBox, ElMessage } from 'element-plus'

const store = useStore()
const memos = computed(() => store.currentFolderMemos)
const selectedMemoId = computed(() => store.selectedMemoId)

const showAddMemoDialog = ref(false)
const memoForm = ref({ title: '' })

function addMemo() {
  memoForm.value = { title: '' }
  showAddMemoDialog.value = true
}

function saveMemo() {
  if (!memoForm.value.title.trim()) {
    ElMessage.warning('请输入备忘录标题')
    return
  }
  
  store.addMemo(memoForm.value.title)
  showAddMemoDialog.value = false
  memoForm.value = { title: '' }
  ElMessage.success('添加成功')
}

function selectMemo(id) {
  store.selectedMemoId = id
}

function deleteMemo(id) {
  ElMessageBox.confirm('确定要删除这个备忘录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.deleteMemo(id)
    ElMessage.success('删除成功')
  })
}

function updateMemoStatus(id, completed) {
  store.updateMemo(id, { completed })
}

function clearAllMemos() {
  ElMessageBox.confirm('确定要清空所有待办事项吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.clearAllMemos()
    ElMessage.success('已清空')
  })
}
</script>

<style scoped lang="less">
.memo-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e4e7ed;
  
  .memo-header {
    padding: 16px;
    border-bottom: 1px solid #e4e7ed;
    
    h3 {
      margin: 0 0 12px 0;
      font-size: 16px;
      color: #303133;
    }
    
    .memo-actions {
      display: flex;
      gap: 8px;
    }
  }
  
  .memos-scrollbar {
    flex: 1;
    
    .memo-item {
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background-color: #f5f7fa;
        
        .memo-actions {
          display: block;
        }
      }
      
      &.active {
        background-color: #f0f7ff;
        border-left: 3px solid #409eff;
      }
      
      .memo-checkbox {
        margin-right: 12px;
      }
      
      .memo-content {
        flex: 1;
        min-width: 0;
        
        .memo-title {
          font-weight: 500;
          margin-bottom: 4px;
          
          .completed {
            text-decoration: line-through;
            color: #909399;
          }
        }
        
        .memo-preview {
          font-size: 12px;
          color: #909399;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      
      .memo-actions {
        display: none;
        
        :deep(.el-button) {
          padding: 4px;
          min-height: auto;
        }
      }
    }
    
    .empty-state {
      padding: 40px 20px;
      text-align: center;
    }
  }
}
</style>
