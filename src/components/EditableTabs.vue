<template>
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
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {ref, toRefs, watch} from 'vue'
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


    const removeTab = (targetName) => {
      let activeName = editableTabsValue.value;

      if (activeName === targetName) {
        const tabs = props.tabs;
        let newActiveTab = null;

        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            // 尝试获取下一个标签，如果不存在，就获取前一个标签
            newActiveTab = tabs[index + 1] || tabs[index - 1];
          }
        });

        if (newActiveTab) {
          activeName = newActiveTab.name;
          router.push(activeName); // 跳转到新的激活的标签页对应的路由
        } else {
          activeName = null; // 如果没有其他标签页，设为null
          router.push('/'); // 跳转到首页
        }

        editableTabsValue.value = activeName;
      }

      emit('remove-tab', targetName);
      emit('update:modelValue', activeName);
    }

    const handleTabClick = (pane, ev) => {
      const tabName = pane.paneName;
      router.push(tabName)
    };

    watch(tabs, (newTabs) => {
      if (!newTabs.find(tab => tab.name === editableTabsValue.value)) {
        editableTabsValue.value = newTabs.length > 0 ? newTabs[0].name : '';
      }
    });

    return {
      editableTabsValue,
      removeTab,
      handleTabClick,
    }
  }
}
</script>


<style scoped>
</style>
