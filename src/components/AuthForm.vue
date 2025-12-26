 <template>
  <div class="auth-form">
    <div class="form-container">
      <h2>{{ isRegister ? '注册账号' : '欢迎回来' }}</h2>
      
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="formRef"
        label-width="80px"
        size="large"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input 
            v-model="form.phone" 
            placeholder="请输入手机号"
            :prefix-icon="Phone"
          />
        </el-form-item>
        
        <template v-if="isRegister">
          <el-form-item label="用户名" prop="username">
            <el-input 
              v-model="form.username" 
              placeholder="请输入用户名"
              :prefix-icon="User"
            />
          </el-form-item>
        </template>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="form.password" 
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <template v-if="isRegister">
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input 
              v-model="form.confirmPassword" 
              type="password"
              placeholder="请再次输入密码"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
        </template>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="submitForm"
            :loading="loading"
            class="submit-btn"
          >
            {{ isRegister ? '注册' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="form-footer">
        <el-button type="text" @click="toggleMode">
          {{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useStore } from '../store'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Phone, User, Lock } from '@element-plus/icons-vue'

const store = useStore()
const router = useRouter()
const formRef = ref()
const loading = ref(false)
const isRegister = ref(false)

const form = reactive({
  phone: '',
  username: '',
  password: '',
  confirmPassword: ''
})

const validatePhone = (rule, value, callback) => {
  const phoneReg = /^1[3-9]\d{9}$/
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!phoneReg.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度不能少于6位'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = computed(() => ({
  phone: [
    { validator: validatePhone, trigger: 'blur' }
  ],
  username: isRegister.value ? [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 10, message: '用户名长度为2-10个字符', trigger: 'blur' }
  ] : [],
  password: [
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: isRegister.value ? [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ] : []
}))

function toggleMode() {
  isRegister.value = !isRegister.value
  formRef.value?.resetFields()
}

async function submitForm() {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isRegister.value) {
      // 注册逻辑
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // 检查手机号是否已注册
      if (users.some(user => user.phone === form.phone)) {
        throw new Error('该手机号已注册')
      }
      
      const newUser = {
        id: Date.now(),
        phone: form.phone,
        username: form.username,
        password: form.password, // 实际项目中应该加密
        createdAt: new Date().toISOString()
      }
      
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      
      // 自动登录
      store.setUser({
        id: newUser.id,
        phone: newUser.phone,
        username: newUser.username
      })
      
      ElMessage.success('注册成功')
    } else {
      // 登录逻辑
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => 
        u.phone === form.phone && u.password === form.password
      )
      
      if (!user) {
        throw new Error('手机号或密码错误')
      }
      
      store.setUser({
        id: user.id,
        phone: user.phone,
        username: user.username
      })
      
      ElMessage.success('登录成功')
    }
    
    router.push('/')
  } catch (error) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="less">
.auth-form {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .form-container {
    width: 400px;
    padding: 40px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    
    h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #303133;
    }
    
    .submit-btn {
      width: 100%;
      margin-top: 10px;
    }
    
    .form-footer {
      text-align: center;
      margin-top: 20px;
      
      :deep(.el-button) {
        color: #409eff;
        
        &:hover {
          color: #66b1ff;
        }
      }
    }
  }
}
</style>
