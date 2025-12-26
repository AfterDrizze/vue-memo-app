 <template>
  <div class="home">
    <Header />
    <div class="main-content">
      <div class="sidebar-left">
        <FolderList />
      </div>
      <div class="sidebar-middle">
        <MemoList />
      </div>
      <div class="content-right">
        <MemoEditor />
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import FolderList from '../components/FolderList.vue'
import MemoList from '../components/MemoList.vue'
import MemoEditor from '../components/MemoEditor.vue'
</script>

<style scoped lang="less">
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  
  .main-content {
    flex: 1;
    display: flex;
    overflow: hidden;
    
    .sidebar-left {
      width: 250px;
      height: 100%;
    }
    
    .sidebar-middle {
      width: 320px;
      height: 100%;
    }
    
    .content-right {
      flex: 1;
      height: 100%;
    }
  }
}
</style>
