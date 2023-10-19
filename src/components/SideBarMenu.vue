<template>

  <transition name="slide" mode="out-in">

  <el-menu
      default-active="1"
      class="el-menu-vertical"
      :collapse="isCollapse"
      :class="{ 'slide-in': !isCollapse, 'slide-out': isCollapse }">

    <div class="logo-container" @click="goToHome">
      <img src="@/assets/logo.png" alt="Logo" class="nav-logo"/>
      <span class="logo-text" v-if="!isCollapse">GateX</span>
    </div>
    <MenuRenderer :menus="menuData" :isCollapse="isCollapse" @menu-clicked="bubbleUpMenuClicked"/>

  </el-menu>
  </transition>
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

  setup(_, { emit }) {
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

    const bubbleUpMenuClicked = (menu) => {
      emit('menu-clicked', menu);
    };

    return { menuData, goToHome, bubbleUpMenuClicked };
  }
}
</script>


<style scoped>
.el-menu-vertical {
  width: 200px;
  min-height: 100vh;
  transition: width 0.2s ease-in-out;
}

.el-menu-vertical.el-menu--collapse {
  width: 80px;
}

.slide-enter-active, .slide-leave-active {
  transition: width 0.5s;
}
.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
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
