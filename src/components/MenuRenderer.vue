<template>
  <div>
    <template v-for="menu in menus">
      <el-sub-menu v-if="menu.children && menu.children.length" :key="menu.id" :index="`${menu.id}`">
        <template #title>
          <component :is="getIconComponent(menu.icon)" class="icon-size adaptive-icon" />
          <span v-if="!isCollapse">{{ menu.name }}</span>
        </template>
        <!-- 注意这里我们增加了一个 @menu-clicked 事件监听器 -->
        <MenuRenderer :menus="menu.children" :isCollapse="isCollapse" @menu-clicked="bubbleUpMenuClicked"/>
      </el-sub-menu>
      <el-menu-item v-else :key="menu.id" :index="`${menu.id}`">
        <component :is="getIconComponent(menu.icon)" class="icon-size adaptive-icon" />
        <router-link :to="menu.path" v-slot="{ navigate }">
          <span @click="handleClick(menu, navigate)">{{ menu.name }}</span>
        </router-link>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
import * as icons from '@element-plus/icons-vue';

export default {
  name: 'MenuRenderer',
  props: {
    menus: {
      type: Array,
      default: () => []
    },
    isCollapse: {
      type: Boolean,
      default: false
    }
  },

  setup(_, { emit }) { // 注意这里我们使用了 { emit }
    const getIconComponent = (icon) => {
      return icons[icon];
    };

    const handleClick = (menu, navigate) => {
      menuClicked(menu);
      navigate();
    };

    const menuClicked = (menu) => {
      emit('menu-clicked', menu);
    };

    // 这个函数会在内部的MenuRenderer触发menu-clicked事件时调用
    const bubbleUpMenuClicked = (menu) => {
      // 我们再次触发这个事件，以便它可以在上一层的MenuRenderer或SideBarMenu中被捕获
      emit('menu-clicked', menu);
    };

    return {
      getIconComponent,
      handleClick,
      bubbleUpMenuClicked
    }
  }
}
</script>


<style scoped>
.icon-size {
  width: 1em;
  height: 1em;
  transform: translateX(-8px);
}

/* 默认图标大小 */
.adaptive-icon {
  width: 1em;
  height: 1em;
}

/* 当屏幕宽度在 480px 到 768px 之间时的图标大小 */
@media screen and (min-width: 480px) and (max-width: 768px) {
  .adaptive-icon {
    width: 1.2em;
    height: 1.2em;
  }
}

/* 当屏幕宽度在 769px 到 1024px 之间时的图标大小 */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .adaptive-icon {
    width: 1.4em;
    height: 1.4em;
  }
}

/* 当屏幕宽度超过 1024px 时的图标大小 */
@media screen and (min-width: 1025px) {
  .adaptive-icon {
    width: 1.6em;
    height: 1.6em;
  }
}


/* 更改子菜单中的菜单项背景颜色 */
.el-sub-menu .el-menu-item {
  background-color: #E1E8EE;  /* 或您想要的其他颜色 */
}


</style>
