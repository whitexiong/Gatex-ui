<template>
  <div>
    <div style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">

      <div style="display: flex; align-items: center;">
      </div>

      <div style="display: flex; align-items: center;">
        <el-button @click="refresh">
          <el-icon>
            <RefreshRight/>
          </el-icon>
        </el-button>
      </div>
    </div>

    <div class="table-wrapper">
      <el-table :fit="true" :data="Trees" row-key="id" lazy :load="loadTree" border default-expand-all
                style="width: 2560px; height: 800px">
        <slot></slot>
      </el-table>
    </div>
  </div>
</template>

<script>
import {onMounted, ref} from 'vue';
import {RefreshRight} from "@element-plus/icons-vue";
import {useCRUD} from '@/composables/useCRUD';

export default {
  props: {
    apiMethods: Object,
    initialRoute: Object
  },
  components: {RefreshRight},
  setup(props) {
    const searchText = ref('');

    const {
      data: Trees,
      listData,
      refresh
    } = useCRUD(props.apiMethods, props.initialRoute);

    onMounted(() => {
      listData();
    });

    return {
      Trees,
      searchText,
      listData,
      refresh
    };
  }
};
</script>

<style scoped>
.table-wrapper {
  overflow-y: auto;
  max-height: 800px;
}

/* 平板端适配 */
@media (max-width: 1024px) and (min-width: 768px) {
  .table-wrapper {
    max-height: 600px;
  }
}

/* 大型手机适配 */
@media (max-width: 767px) and (min-width: 481px) {
  .table-wrapper {
    max-height: 400px;
  }
}

/* 小型手机适配 */
@media (max-width: 480px) {
  .table-wrapper {
    max-height: 300px;
  }
}
</style>
