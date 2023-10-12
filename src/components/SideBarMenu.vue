<template>
  <el-menu
      default-active="1"
      class="el-menu-vertical"
      :collapse="isCollapse"
      :class="{ 'slide-in': !isCollapse, 'slide-out': isCollapse }">

    <div class="logo-container" @click="goToHome">
      <img src="@/assets/logo.png" alt="Logo" class="nav-logo"/>
      <span class="logo-text" v-if="!isCollapse">GateX</span>
    </div>
    <MenuRenderer :menus="menuData" :isCollapse="isCollapse"/>

  </el-menu>
</template>

<script>
import { ref, onMounted } from 'vue';
import MenuRenderer from '@/components/MenuRenderer.vue';
import { useRouter } from 'vue-router';

export default {
  props: {
    isCollapse: {
      type: Boolean,
      required: true
    }
  },
  components: {
    MenuRenderer
  },

  setup() {
    const menuData = ref([]);
    const router = useRouter();

    onMounted(() => {
      const storedMenus = localStorage.getItem('userMenus');
      if (storedMenus) {
        menuData.value = JSON.parse(storedMenus);
      }
    });

    // 跳转到根目录页面
    const goToHome = () => {
      router.push('/');
    };

    return { menuData, goToHome };
  }
}
</script>

<style scoped>
.el-menu-vertical {
  width: 200px;
  height: 100vh;
  transition: width 0.2s ease-in-out;
}

.el-menu-vertical.el-menu--collapse {
  width: 80px;
}

.logo-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nav-logo {
  margin-right: 10px;
}

/* Animation classes */
.slide-in {
  animation: slideIn 0.2s forwards;
}

.slide-out {
  animation: slideOut 0.2s forwards;
}

@keyframes slideIn {
  from {
    width: 80px;
  }
  to {
    width: 200px;
  }
}

@keyframes slideOut {
  from {
    width: 200px;
  }
  to {
    width: 80px;
  }
}
</style>
