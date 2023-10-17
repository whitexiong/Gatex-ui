<template>
  <div :class="{ 'dark-mode': isDarkMode }" class="common-layout">
    <el-container>
      <SideBarMenu  @menu-clicked="handleMenuClick"  class="sidebar" :isCollapse="isCollapse" />
      <el-container>
        <el-header>
          <NavBar @toggle-sidebar="toggleSidebar" :isCollapse="isCollapse" :isDarkMode="isDarkMode" class="navbar" />
        </el-header>
        <BreadcrumbNav />
        <el-main>
          <el-scrollbar>
            <EditableTabs :tabs="editableTabs" v-model="activeTab" @remove-tab="handleTabRemoval" @tab-click="handleTabClicked" />
            <router-view />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch, provide } from 'vue';
import SideBarMenu from "@/components/SideBarMenu.vue";
import NavBar from "@/components/NavBar.vue";
import BreadcrumbNav from '@/components/BreadcrumbNav.vue';
import EditableTabs from '@/components/EditableTabs.vue';

export default {
  name: 'Layout',
  components: {
    NavBar,
    SideBarMenu,
    BreadcrumbNav,
    EditableTabs,
  },
  setup() {
    const isCollapse = ref(true);
    const isDarkMode = ref(false); // 初始化暗黑模式为false
    const storedTabs = localStorage.getItem('editableTabs');
    const editableTabs = ref(storedTabs ? JSON.parse(storedTabs) : []);
    const activeTab = ref(null);

    //提供选中机制
    provide('editableTabs', editableTabs);
    provide('activeTab', activeTab);

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

    const handleTabRemoval = (tabName) => {
      const index = editableTabs.value.findIndex(tab => tab.name === tabName);
      if (index !== -1) {
        editableTabs.value = [
          ...editableTabs.value.slice(0, index),
          ...editableTabs.value.slice(index + 1)
        ];
      }
    }

    const handleTabClicked = (item) => {
      console.log('handleTabClicked triggered with item:', item);
    };

    const handleMenuClick = (menu) => {
      if (!editableTabs.value.find(tab => tab.name === menu.id)) {
        editableTabs.value = [...editableTabs.value, {
          title: menu.name,
          name: menu.path,
          content: menu.name,
          path: menu.path,
          id: menu.id
        }];
      }
    };

    watch(editableTabs, (newTabs) => {
      console.log("Tabs changed: ", newTabs);
      localStorage.setItem('editableTabs', JSON.stringify(newTabs));
    });

    return {
      isCollapse,
      isDarkMode,
      toggleSidebar,
      handleMenuClick,
      editableTabs,
      activeTab,
      handleTabRemoval,
      handleTabClicked
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
