<template>
  <el-dialog
      v-model="isVisible"
      width="50%"
      title="项目设置"
      @close="handleClose">

    <el-form :model="state" label-width="80px">
      <el-form-item
          v-for="item in formItems"
          :key="item.prop"
          :label="item.label"
          :rules="item.rules"
      >
        <component
            :is="item.component"
            v-model="state[item.prop]"
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
      <el-button @click="handleSubmit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script>
import {projectSettingsModalState} from "@/composables/useState";
import {saveSetting} from "@/services/projectService";

export default {
  name: 'ProjectSettingsModal',
  setup() {
    const {isVisible, state, close} = projectSettingsModalState;

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
    ];

    const handleSubmit = () => {
      saveSetting(state.value.ID, state.value)
          .then(response => {
            console.log("项目设置已保存");
            close();
          })
          .catch(error => {
            console.error("保存项目设置出错:", error);
          });
    };

    return {
      isVisible,
      state,
      handleClose,
      handleSubmit,
      environments,
      formItems
    };
  }
};
</script>

<style scoped>
.el-form-item__label {
  font-size: 14px;
}

.el-input,
.el-select {
  width: 100%;
}

.el-form-item {
  display: flex;
  align-items: center;
}

</style>
