<template>
  <el-dialog
      v-model="isVisible"
      width="50%"
      title="项目设置"
      @close="handleClose">

      <el-form :model="projectSetting">
        <el-form-item
            v-for="item in formItems"
            :key="item.prop"
            :label="item.label"
            :rules="item.rules"
        >
          <component
              :is="item.component"
              v-model="projectSetting[item.prop]"
              v-bind="item.attrs"
          >
            <el-option
                :v-if="item.component === 'el-select'"
                v-for="option in item.options"
                :key="option"
                :label="option"
                :value="option"
            >
            </el-option>
          </component>
        </el-form-item>
      </el-form>

    <template v-slot:footer>
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleSubmit">{{ mode === 'create' ? '创建' : '更新' }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { projectSettingsModalState } from "@/composables/useState";

export default {
  name: 'ProjectSettingsModal',
  setup() {
    const { isVisible, projectSetting, mode, close } = projectSettingsModalState;

    const environments = ['Development', 'Test', 'Production'];

    const handleClose = () => {
      close();
    };

    const formItems = [
      {
        prop: 'IP',
        label: 'IP',
        component: 'el-input',
        attrs: {}
      },
      {
        prop: 'Port',
        label: 'Port',
        component: 'el-input',
        attrs: {
          type: 'number'
        }
      },
      {
        prop: 'Environment',
        label: '环境',
        component: 'el-select',
        options: environments
      },
      {
        prop: 'Description',
        label: '描述',
        component: 'el-input',
        attrs: {
          type: 'textarea'
        }
      }
      // 如果需要添加更多的表单项，只需扩展这个数组
    ];

    const handleSubmit = () => {
      if (mode.value === 'create') {
        // 创建逻辑
        // 您可能会调用API来创建新的项目设置
        console.log("创建项目设置:", projectSetting.value);
      } else {
        // 更新逻辑
        // 您可能会调用API来更新现有的项目设置
        console.log("更新项目设置:", projectSetting.value);
      }
      close();
    };

    return {
      isVisible,
      projectSetting,
      mode,
      handleClose,
      handleSubmit,
      environments,
      formItems
    };
  }
};
</script>

<style scoped>
/* 你可以在这里添加任何必要的CSS样式 */
</style>
