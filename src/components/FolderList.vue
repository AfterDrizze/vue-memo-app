 <template>
  <div class="folder-list">
    <div class="folder-header">
      <h3>📁 文件夹</h3>
      <el-button type="primary" size="small" @click="showAddFolderDialog = true">
        <el-icon><FolderAdd /></el-icon>
        新建文件夹
      </el-button>
    </div>
    
    <el-scrollbar class="folders-scrollbar">
      <div 
        v-for="folder in folders" 
        :key="folder.id"
        :class="['folder-item', { active: folder.id === selectedFolderId }]"
        @click="selectFolder(folder.id)"
      >
        <el-icon><Folder /></el-icon>
        <span class="folder-name">{{ folder.name }}</span>
        <div class="folder-actions">
          <el-button 
            type="text" 
            size="small" 
            @click.stop="editFolder(folder)"
            title="编辑"
          >
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button 
            type="text" 
            size="small" 
            @click.stop="deleteFolder(folder.id)"
            title="删除"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </div>
    </el-scrollbar>
    
    <!-- 添加/编辑文件夹对话框 -->
    <el-dialog 
      v-model="showAddFolderDialog" 
      :title="editingFolder ? '编辑文件夹' : '新建文件夹'"
      width="400px"
    >
      <el-form :model="folderForm" label-width="80px">
        <el-form-item label="文件夹名">
          <el-input 
            v-model="folderForm.name" 
            placeholder="请输入文件夹名"
            @keyup.enter="saveFolder"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddFolderDialog = false">取消</el-button>
        <el-button type="primary" @click="saveFolder">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../store'
import { ElMessageBox, ElMessage } from 'element-plus'

const store = useStore()
const folders = computed(() => store.folders)
const selectedFolderId = computed(() => store.selectedFolderId)

const showAddFolderDialog = ref(false)
const editingFolder = ref(null)
const folderForm = ref({ name: '' })

function selectFolder(id) {
  store.selectedFolderId = id
  store.selectedMemoId = null
}

function editFolder(folder) {
  editingFolder.value = folder
  folderForm.value = { ...folder }
  showAddFolderDialog.value = true
}

function saveFolder() {
  if (!folderForm.value.name.trim()) {
    ElMessage.warning('请输入文件夹名')
    return
  }
  
  if (editingFolder.value) {
    // 更新现有文件夹
    const index = store.folders.findIndex(f => f.id === editingFolder.value.id)
    if (index !== -1) {
      store.folders[index].name = folderForm.value.name
      localStorage.setItem('folders', JSON.stringify(store.folders))
    }
  } else {
    // 添加新文件夹
    store.addFolder(folderForm.value.name)
  }
  
  showAddFolderDialog.value = false
  folderForm.value = { name: '' }
  editingFolder.value = null
  ElMessage.success(editingFolder.value ? '更新成功' : '添加成功')
}

function deleteFolder(id) {
  ElMessageBox.confirm('删除文件夹将同时删除其中的所有备忘录，确定删除吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.deleteFolder(id)
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped lang="less">
.folder-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e4e7ed;
  
  .folder-header {
    padding: 16px;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
      font-size: 16px;
      color: #303133;
    }
  }
  
  .folders-scrollbar {
    flex: 1;
    padding: 8px;
    
    .folder-item {
      padding: 12px;
      margin: 4px 0;
      border-radius: 6px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background-color: #f5f7fa;
        
        .folder-actions {
          display: flex;
        }
      }
      
      &.active {
        background-color: #ecf5ff;
        color: #409eff;
        font-weight: 500;
      }
      
      .folder-name {
        flex: 1;
        margin-left: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .folder-actions {
        display: none;
        gap: 4px;
        
        :deep(.el-button) {
          padding: 4px;
          min-height: auto;
        }
      }
    }
  }
}
</style>
