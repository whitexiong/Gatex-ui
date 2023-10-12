<template>
  <div :class="{ 'dark-mode': isDarkMode }" class="common-layout">
    <el-container>
      <SideBarMenu class="sidebar" :isCollapse="isCollapse" />
      <el-container>
        <el-header>
          <NavBar @toggle-sidebar="toggleSidebar" :isCollapse="isCollapse" :isDarkMode="isDarkMode" class="navbar" />
        </el-header>
        <BreadcrumbNav />
        <el-main>
          <el-scrollbar>
            <router-view />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {onMounted, onUnmounted, ref} from 'vue';
import SideBarMenu from "@/components/SideBarMenu.vue";
import NavBar from "@/components/NavBar.vue";
import BreadcrumbNav from '@/components/BreadcrumbNav.vue';

export default {
  name: 'Layout',
  components: {
    NavBar,
    SideBarMenu,
    BreadcrumbNav
  },
  setup() {
    const isCollapse = ref(true);
    const isDarkMode = ref(false);  // 初始化暗黑模式为false

    const toggleSidebar = () => {
      isCollapse.value = !isCollapse.value;
    };

    const updateSidebar = () => {
      isCollapse.value = window.innerWidth <= 768;
    };

    onMounted(() => {
      window.addEventListener('resize', updateSidebar);
      updateSidebar();
    });

    onUnmounted(() => {
      window.removeEventListener('resize', updateSidebar);
    });


    return {
      isCollapse,
      isDarkMode,
      toggleSidebar
    };
  }
}
</script>

<style scoped>
.dark-mode {
  background-color: #333;
  color: white;
}

.sidebar {
  background-color: #E1E8EE;
}

/* 为导航栏设置背景颜色 */
.navbar {
  background-color: #E1E8EE;
}

@media (max-width: 768px) {
  .navbar {
    display: block;  /* 显示顶部导航 */
  }
}


</style>
