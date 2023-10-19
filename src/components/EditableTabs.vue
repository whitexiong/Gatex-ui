<template>
  <div @click="hideContextMenu">
    <el-tabs
        v-model="editableTabsValue"
        type="card"
        class="tabs"
        closable
        @tab-remove="removeTab"
        @tab-click="handleTabClick"
    >
      <el-tab-pane
          v-for="item in tabs"
          :key="item.id"
          :label="item.title"
          :name="item.name"
      >
        <template #label>
          <span @contextmenu.prevent="openContextMenu($event, item.name)">
            {{ item.title }}
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div v-if="showMenu" class="context-menu" :style="{ top: menuPosition.y + 'px', left: menuPosition.x + 'px' }">
      <div @click="closeCurrent">关闭当前</div>
      <div @click="closeAll">关闭全部</div>
    </div>
  </div>
</template>

<script>
import {onBeforeUnmount, onMounted, ref, toRefs, watch} from 'vue';
import router from "@/router";

export default {
  name: 'EditableTabs',
  props: {
    tabs: {
      type: Array,
      required: true
    },
  },
  setup(props, { emit }) {
    const { tabs } = toRefs(props);
    const editableTabsValue = ref(tabs.value.length > 0 ? tabs.value[0].name : '');

    const currentRightClickedTab = ref(null);

    const removeTab = (targetName) => {
      let activeName = editableTabsValue.value;
      if (activeName === targetName) {
        const tabs = props.tabs;
        let newActiveTab = null;

        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            newActiveTab = tabs[index + 1] || tabs[index - 1];
          }
        });

        if (newActiveTab) {
          activeName = newActiveTab.name;
          router.push(activeName);
        } else {
          activeName = null;
          router.push('/');
        }

        editableTabsValue.value = activeName;
      }

      emit('remove-tab', targetName);
    };

    const handleTabClick = (pane, ev) => {
      const tabName = pane.paneName;
      router.push(tabName);
    };


    const showMenu = ref(false);
    const menuPosition = ref({ x: 0, y: 0 });

    const openContextMenu = (event, tabName) => {
      currentRightClickedTab.value = tabName;
      menuPosition.value = { x: event.clientX - 150, y: event.clientY - 150 };
      showMenu.value = true;
    };

    const closeCurrent = () => {
      if (currentRightClickedTab.value) {
        removeTab(currentRightClickedTab.value);
        showMenu.value = false;
      }
    };

    const closeAll = () => {
      props.tabs.forEach(tab => removeTab(tab.name));
      showMenu.value = false;
    };

    watch(tabs, (newTabs) => {
      if (!newTabs.find(tab => tab.name === editableTabsValue.value)) {
        editableTabsValue.value = newTabs.length > 0 ? newTabs[0].name : '';
      }
    });

    onMounted(() => {
      window.addEventListener('mousedown', handleOutsideClick, false);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('mousedown', handleOutsideClick, false);
    });

    const handleOutsideClick = (event) => {
      const menuEl = document.querySelector('.context-menu');
      if (menuEl && !menuEl.contains(event.target) && showMenu.value) {
        showMenu.value = false;
      }
    };

    const hideContextMenu = () => {
      showMenu.value = false;
    };

    return {
      editableTabsValue,
      removeTab,
      handleTabClick,
      showMenu,
      menuPosition,
      openContextMenu,
      closeCurrent,
      closeAll,
      hideContextMenu
    };
  }
}
</script>

<style scoped>
.context-menu {
  position: absolute;
  border-radius: 5px;
  background-color: #fff;
  z-index: 1000;
  width: 120px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  transition: opacity 0.2s, transform 0.2s;
}
.context-menu > div {
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid #e4e7ed;
  font-size: 14px;
}

.context-menu > div:last-child {
  border-bottom: none;
}

.context-menu > div:hover {
  background-color: #ecf5ff;
  color: #409eff;
}
</style>
