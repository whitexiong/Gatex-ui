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
import { onMounted, onUnmounted, ref, watch, toRaw } from 'vue';
import SideBarMenu from "@/components/SideBarMenu.vue";
import NavBar from "@/components/NavBar.vue";
import BreadcrumbNav from '@/components/BreadcrumbNav.vue';
import EditableTabs from '@/components/EditableTabs.vue';
import router from "@/router";

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

    const storedTabs = localStorage.getItem('editableTabs');
    const editableTabs = ref(storedTabs ? JSON.parse(storedTabs) : []);

    const activeTab = ref(null);  // add this line to track the active tab

    const handleTabRemoval = (tabName) => {
      const index = editableTabs.value.findIndex(tab => tab.name === tabName);
      if (index !== -1) {
        // 使用spread操作符来创建一个新的数组，然后删除特定索引的元素
        editableTabs.value = [
          ...editableTabs.value.slice(0, index),
          ...editableTabs.value.slice(index + 1)
        ];
      }
    }

    const handleTabClicked = (item) => {
      console.log('handleTabClicked triggered with item:', item);
    };

    watch(editableTabs, (newTabs) => {
      console.log("Tabs changed: ", newTabs);
      localStorage.setItem('editableTabs', JSON.stringify(newTabs));
    });


    const handleMenuClick = (menu) => {
      console.log("Handling menu click in parent component with menu:", menu);
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
