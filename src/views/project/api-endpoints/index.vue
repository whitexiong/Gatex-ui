<template>

  <div>
    <el-button @click="fetchEndpoint" >初始化接口数据</el-button> <!-- 新添加的按钮 -->
    <SearchTreeTable :apiMethods="apiMethods" :initialRoute="initialRoute">

      <!-- 节点列 -->
      <el-table-column label="节点">
        <template #default="scope">
          <span :style="{ paddingLeft: (scope.row._indent || 0) * 20 + 'px' }">{{ scope.row.path }}</span>
        </template>
      </el-table-column>

      <!-- 路由名称列 -->
      <el-table-column label="路由名称">
        <template #default="scope">
          <span :style="{ paddingLeft: (scope.row._indent || 0) * 20 + 'px' }">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
    </SearchTreeTable>

  </div>
</template>

<script>
import {getList, add, deletedById, update, detail, initApi} from '@/services/projectAPIEndpointService';
import { useCRUD } from '@/composables/useCRUD';
import SearchTreeTable from "@/components/table/SearchTreeTable.vue";
import {onMounted} from "vue";

export default {
  components: { SearchTreeTable },
  setup() {
    const initialRoute = {
      ID: null,
      Name: '',
      Status: null,
      ParentID: null,
      Path: null,
    };

    const apiMethods = {
      getList,
      add,
      update,
      detail,
      deletedById
    };

    const fetchEndpointData = async () => {
      try {
        const response = await initApi();
        console.log("获取到的数据:", response);
        // 你可以在这里处理响应数据，例如更新状态或显示通知
      } catch (error) {
        console.error("获取数据出错:", error);
        // 可以选择性地显示错误消息或处理错误
      }
    };

    const {
      selected: Route,
      dialogVisible,
      currentPage,
      pageSize,
      saveData,
      addNew,
      getDetail,
      deleted,
      resetData,
      dialogTitle,
      toggleStatus
    } = useCRUD(apiMethods, initialRoute);


    onMounted(async () => {

    });

    return {
      Route,
      dialogVisible,
      currentPage,
      pageSize,
      saveData,
      addNew,
      getDetail,
      deleted,
      resetData,
      dialogTitle,
      toggleStatus,
      apiMethods,
      initialRoute,
      fetchEndpointData,
    };
  }
};
</script>


<style scoped>


</style>
