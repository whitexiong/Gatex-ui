<template>
  <div>
    <div style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">

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
          新增用户
        </el-button>
        <ADialog
            v-model="dialogVisible"
            :title="dialogTitle"
            @confirm="saveData"
            @reset="resetData"
        >
          <el-form ref="UserForm" :model="User" label-width="80px" style="width: 100%;">

            <el-form-item label="头像">
              <div>
                <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                  <img v-if="User.AvatarUrl" :src="User.AvatarUrl" class="avatar"  alt=""/>
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </div>
            </el-form-item>

            <el-form-item label="用户名">
              <el-input v-model="User.Username" placeholder="请输入用户名"></el-input>
            </el-form-item>

            <el-form-item label="密码">
              <el-input
                  v-model="User.Password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入密码"
                  suffix-icon="el-icon-view"
                  @click:append="togglePasswordVisibility">
              </el-input>
            </el-form-item>

            <el-form-item label="邮箱">
              <el-input v-model="User.Email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-switch v-model="User.Status" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="是否为AI">
              <el-checkbox v-model="User.IsAI" label="AI用户"></el-checkbox>
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="User.Roles" multiple placeholder="请选择角色">
                <el-option
                    v-for="role in allRoles"
                    :key="role.ID"
                    :label="role.Name"
                    :value="role.ID">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </ADialog>
      </div>
    </div>

    <GridTable
        v-if="Users"
        :tableData="Users"
        @search="handleSearch"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        @reset-filters="resetFilters"
        @edit="getDetail"
        @delete="deleteUser"
    />

  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import {getList as getRoleList} from '@/services/roleService';
import {getList as getUserList, add, update, detail, deletedById} from '@/services/userService';
import {Plus, Refresh, RefreshRight, Search} from "@element-plus/icons-vue";
import ADialog from '@/components/ADialog.vue';
import {useCRUD} from '@/composables/useCRUD';
import {uploadFile} from "@/services/uploadService";
import edit from "@element-plus/icons/lib/Edit";
import GridTable from "@/components/table/GridTable.vue";


export default {
  computed: {
    edit() {
      return edit
    }
  },
  components: {GridTable, Plus, RefreshRight, ADialog},
  setup() {
    const initialUser = {
      ID: null,
      Username: '',
      Email: '',
      Password: '',
      Status: null,
      AvatarUrl: '',
      IsAI: false,
      Roles: [],
    };

    const apiMethods = {
      getList: getUserList,
      add: add,
      update: update,
      detail: detail,
      deletedById: deletedById,
    };

    const handleAvatarSuccess = (response) => {
      User.AvatarUrl = response.avatar_url;
    };

    const beforeAvatarUpload = async (rawFile) => {
      if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('头像图片必须为JPG格式!');
        return false;
      } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像图片大小不能超过2MB!');
        return false;
      }

      try {
        const response = await uploadFile(rawFile);
        console.log(response.data.avatar_url)
        if (response && response.data && response.data.avatar_url) {
          User.value.AvatarUrl = "http://127.0.0.1:8051/" + response.data.avatar_url;
        }
      } catch (error) {
        ElMessage.error('上传失败!');
      }
      return false;
    };

    const {
      data: Users,
      selected: User,
      dialogVisible,
      searchText,
      listData,
      saveData,
      refresh,
      addNew,
      getDetail,
      deleted: deleteUser,
      resetData,
      dialogTitle,
      handleSearch,
      handleSizeChange,
      handlePageChange,
      resetFilters,
    } = useCRUD(apiMethods, initialUser);

    const allRoles = ref([]);

    onMounted(async () => {
      await listData();
      const rolesResponse = await getRoleList();
      if (rolesResponse.data) {
        allRoles.value = rolesResponse.data;
      }
    });

    return {
      Users,
      User,
      allRoles,
      dialogVisible,
      searchText,
      listData,
      saveData,
      refresh,
      addNew,
      getDetail,
      deleteUser,
      resetData,
      dialogTitle,
      handleAvatarSuccess,
      beforeAvatarUpload,
      handleSearch,
      handleSizeChange,
      handlePageChange,
      resetFilters,
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

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}


</style>
