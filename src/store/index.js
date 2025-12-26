 import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStore = defineStore('main', () => {
  // 用户状态
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  
  // 文件夹数据
  const folders = ref(JSON.parse(localStorage.getItem('folders')) || [
    { id: 1, name: '本周待办事项' },
    { id: 2, name: '工作项目' },
    { id: 3, name: '个人备忘' }
  ])
  
  // 备忘录数据
  const memos = ref(JSON.parse(localStorage.getItem('memos')) || [
    { id: 1, folderId: 1, title: '上次预设事项', content: '', completed: false },
    { id: 2, folderId: 1, title: '会议召开会', content: '', completed: false }
  ])
  
  // 选中的文件夹和备忘录
  const selectedFolderId = ref(1)
  const selectedMemoId = ref(null)
  
  // 计算属性
  const currentFolderMemos = computed(() => {
    return memos.value.filter(memo => memo.folderId === selectedFolderId.value)
  })
  
  const currentMemo = computed(() => {
    return memos.value.find(memo => memo.id === selectedMemoId.value)
  })
  
  // Actions
  function setUser(userData) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }
  
  function logout() {
    user.value = null
    localStorage.removeItem('user')
  }
  
  function addFolder(name) {
    const newFolder = {
      id: Date.now(),
      name
    }
    folders.value.push(newFolder)
    localStorage.setItem('folders', JSON.stringify(folders.value))
  }
  
  function deleteFolder(id) {
    folders.value = folders.value.filter(folder => folder.id !== id)
    memos.value = memos.value.filter(memo => memo.folderId !== id)
    localStorage.setItem('folders', JSON.stringify(folders.value))
    localStorage.setItem('memos', JSON.stringify(memos.value))
  }
  
  function addMemo(title) {
    const newMemo = {
      id: Date.now(),
      folderId: selectedFolderId.value,
      title,
      content: '',
      completed: false
    }
    memos.value.push(newMemo)
    localStorage.setItem('memos', JSON.stringify(memos.value))
    selectedMemoId.value = newMemo.id
  }
  
  function deleteMemo(id) {
    memos.value = memos.value.filter(memo => memo.id !== id)
    localStorage.setItem('memos', JSON.stringify(memos.value))
    if (selectedMemoId.value === id) {
      selectedMemoId.value = null
    }
  }
  
  function updateMemo(id, updates) {
    const index = memos.value.findIndex(memo => memo.id === id)
    if (index !== -1) {
      memos.value[index] = { ...memos.value[index], ...updates }
      localStorage.setItem('memos', JSON.stringify(memos.value))
    }
  }
  
  function clearAllMemos() {
    memos.value = memos.value.filter(memo => memo.folderId !== selectedFolderId.value)
    localStorage.setItem('memos', JSON.stringify(memos.value))
    selectedMemoId.value = null
  }
  
  return {
    user,
    folders,
    memos,
    selectedFolderId,
    selectedMemoId,
    currentFolderMemos,
    currentMemo,
    setUser,
    logout,
    addFolder,
    deleteFolder,
    addMemo,
    deleteMemo,
    updateMemo,
    clearAllMemos
  }
})
