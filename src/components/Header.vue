 <template>
  <header class="header">
    <div class="logo">
      <h1>📝 智能备忘录</h1>
    </div>
    <div class="user-info" v-if="user">
      <el-avatar :size="32" :src="user.avatar || ''">
        {{ user.username?.charAt(0) }}
      </el-avatar>
      <span class="username">{{ user.username }}</span>
      <el-button type="text" @click="handleLogout">
        <el-icon><SwitchButton /></el-icon>
        退出登录
      </el-button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../store'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const store = useStore()
const router = useRouter()
const user = computed(() => store.user)

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.logout()
    router.push('/login')
  })
}
</script>

<style scoped lang="less">
.header {
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  
  .logo h1 {
    margin: 0;
    font-size: 20px;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .username {
      font-weight: 500;
    }
    
    :deep(.el-button) {
      color: white;
      
      &:hover {
        color: #ffd04b;
      }
    }
  }
}
</style>
