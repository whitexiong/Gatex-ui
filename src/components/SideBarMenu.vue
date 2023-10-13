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
    <!-- 注意这里我们增加了一个 @menu-clicked 事件监听器 -->
    <MenuRenderer :menus="menuData" :isCollapse="isCollapse" @menu-clicked="bubbleUpMenuClicked"/>

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

  setup(_, { emit }) {  // 注意这里我们又一次使用了 { emit }
    const menuData = ref([]);
    const router = useRouter();

    onMounted(() => {
      const storedMenus = localStorage.getItem('userMenus');
      if (storedMenus) {
        menuData.value = JSON.parse(storedMenus);
      }
    });

    const goToHome = () => {
      router.push('/');
    };

    // 这个方法会在MenuRenderer触发menu-clicked事件时调用
    const bubbleUpMenuClicked = (menu) => {
      // 我们再次触发这个事件，以便它可以在上一层的Layout组件中被捕获
      emit('menu-clicked', menu);
    };

    return { menuData, goToHome, bubbleUpMenuClicked };
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
