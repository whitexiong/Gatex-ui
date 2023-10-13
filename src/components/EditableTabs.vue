<template>
  <el-tabs
      v-model="editableTabsValue"
      type="card"
      class="demo-tabs"
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
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { ref } from 'vue'
import {useRoute} from "vue-router";
import router from "@/router";

export default {
  name: 'EditableTabs',
  props: {
    tabs: {
      type: Array,
      required: true
    }
  },
  setup(props, { emit }) {
    const editableTabsValue = ref(props.tabs.length > 0 ? props.tabs[0].name : '');

    const removeTab = (targetName) => {
      let activeName = editableTabsValue.value;
      if (activeName === targetName) {
        const tabs = props.tabs;
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
        editableTabsValue.value = activeName;
      }

      emit('remove-tab', targetName);
      emit('update:modelValue', activeName); // to keep parent's activeTab in sync
    }

    const handleTabClick = (pane, ev) => {
      const tabName = pane.paneName;
      router.push(tabName)
    };

    return {
      editableTabsValue,
      removeTab,
      handleTabClick
    }
  }
}
</script>



<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
