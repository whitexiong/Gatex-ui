<template>
  <div>
    <div style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">

      <div style="display: flex; align-items: center;">
        <el-input
            v-model="searchText"
            placeholder="请输入证书名"
            style="width: 200px;"
            @keyup.enter="listData">
          <template #append>
            <el-button @click="listData" style="margin-right: 5px;">
              <el-icon>
                <Search/>
              </el-icon>
            </el-button>
            <el-button @click="resetSearch">
              <el-icon>
                <Refresh/>
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </div>

      <div style="display: flex; align-items: center;">
        <el-button @click="refresh">
          <el-icon>
            <RefreshRight/>
          </el-icon>
        </el-button>

        <el-button @click="addNew" style="margin-left: 10px;">
          <el-icon>
            <Plus/>
          </el-icon>
          新增证书
        </el-button>
        <ADialog
            v-model="dialogVisible"
            :title="dialogTitle"
            @confirm="saveData"
            @reset="resetData"
        >
          <el-form ref="CertificateForm" :model="Certificate" label-width="80px" style="width: 100%;">
            <el-form-item label="证书名">
              <el-input v-model="Certificate.ClientName" placeholder="请输入证书名"></el-input>
            </el-form-item>

            <el-form-item label="密码">
              <el-input
                  v-model="Certificate.Password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入密码"
                  suffix-icon="el-icon-view"
                  @click:append="togglePasswordVisibility">
              </el-input>
            </el-form-item>
          </el-form>
        </ADialog>
      </div>
    </div>

    <!-- 证书表格区域 -->
    <el-table :data="Certificates" row-key="id" style="width: 1980px; height: 1000px" border>
      <el-table-column label="文件名" prop="filename"></el-table-column>
      <el-table-column label="通用名称" prop="common_name"></el-table-column>
      <el-table-column label="颁发者" prop="issuer"></el-table-column>
      <el-table-column label="有效开始日期" prop="valid_from"></el-table-column>
      <el-table-column label="有效结束日期" prop="valid_to"></el-table-column>
      <el-table-column label="序列号" prop="serial_number"></el-table-column>
      <el-table-column label="操作" width="260">
        <template #default="{ row }">
          <div style="display: flex; align-items: center;">
            <el-button type="primary" size="small" @click="editClient(row.id)" style="color: black; margin-left: 5px;">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteClient(row.id)" style="color: black; margin-left: 10px;">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import {getList as getRoleList} from '@/services/roleService';
import {getList as getCertificateList, add, update, detail, deletedById} from '@/services/openvpnCertificateService';
import {Plus, Refresh, RefreshRight, Search} from "@element-plus/icons-vue";
import ADialog from '@/components/ADialog.vue';
import {useCRUD} from '@/composables/useCRUD';

export default {
  components: {Refresh, Search, Plus, RefreshRight, ADialog},
  setup() {
    const initialCertificate = {
      ID: null,
      ClientName: '',
      Password: '',
    };

    const apiMethods = {
      getList: getCertificateList,
      add: add,
      update: update,
      detail: detail,
      deletedById: deletedById
    };
    const {
      data: Certificates,
      selected: Certificate,
      dialogVisible,
      searchText,
      listData,
      saveData,
      refresh,
      addNew,
      getDetail,
      deleted: deleteCertificate,
      resetData,
      dialogTitle
    } = useCRUD(apiMethods, initialCertificate);

    const allRoles = ref([]);

    onMounted(async () => {
      await listData();
      const rolesResponse = await getRoleList();
      if (rolesResponse.data) {
        allRoles.value = rolesResponse.data;
      }
    });

    return {
      Certificates,
      Certificate,
      allRoles,
      dialogVisible,
      searchText,
      listData,
      saveData,
      refresh,
      addNew,
      getDetail,
      deleteCertificate,
      resetData,
      dialogTitle,
    };
  }
};
</script>


<style scoped>

.icon-item > div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-item span {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.7);
}

.wide-cascader .el-input__inner {
  width: 300px !important;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

</style>
