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
          创建项目
        </el-button>

        <ADialog
            v-model="dialogVisible"
            :title="dialogTitle"
            @confirm="saveData"
            @reset="resetData"
        >
          <el-form ref="ProjectForm" :model="Project" label-width="80px" style="width: 100%;">

            <el-form-item label="项目名">
              <el-input v-model="Project.Name" placeholder="请输入项目名"></el-input>
            </el-form-item>

            <el-form-item label="描述">
              <el-input type="textarea" v-model="Project.Description" placeholder="请输入项目描述"></el-input>
            </el-form-item>

            <el-form-item label="封面图片">
              <div>
                <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                >
                  <img v-if="Project.CoverImage" :src="Project.CoverImage" class="avatar" alt=""/>
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </div>
            </el-form-item>

            <el-form-item label="类别">
              <el-input v-model="Project.Category" placeholder="请输入类别"></el-input>
            </el-form-item>

            <el-form-item label="标签">
              <el-input
                  v-model="newTag"
                  placeholder="输入新标签并按Enter"
                  @keyup.enter="addTag"
              ></el-input>
              <el-tag
                  v-for="(tag, index) in tags"
                  :key="index"
                  closable
                  @close="removeTag(index)"
              >
                {{ tag }}
              </el-tag>
            </el-form-item>


            <el-form-item label="状态">
              <el-switch v-model="Project.Status" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>

            <el-form-item label="排序">
              <el-input v-model="Project.Sort" placeholder="输入排序值"></el-input>
            </el-form-item>

          </el-form>
        </ADialog>

      </div>
    </div>

    <GridTable
        v-if="Projects"
        :tableData="Projects"
        @search="handleSearch"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        @reset-filters="resetFilters"
        @edit="getDetail"
        @delete="deleteProject"
    >
      <template #default="slotProps">
        <el-dropdown-item @click="viewDetails(slotProps.project.ID)">
          <el-icon><View /></el-icon>查看详情
        </el-dropdown-item>
        <el-dropdown-item @click="manageMembers(slotProps.project.ID)">
          <el-icon><UserFilled /></el-icon>成员管理
        </el-dropdown-item>
        <el-dropdown-item @click="manageAPIEndpoints(slotProps.project.ID)">
          <el-icon><Position /></el-icon>管理API端点
        </el-dropdown-item>
        <el-dropdown-item @click="manageTasks(slotProps.project.ID)">
          <el-icon><Expand /></el-icon>任务管理
        </el-dropdown-item>
        <el-dropdown-item @click="viewMilestones(slotProps.project.ID)">
          <el-icon><Timer /></el-icon>时间线/里程碑
        </el-dropdown-item>
        <el-dropdown-item @click="manageFiles(slotProps.project.ID)">
          <el-icon><Files /></el-icon>文件和文档
        </el-dropdown-item>
        <el-dropdown-item @click="projectSettings(slotProps.project.ID)">
          <el-icon><Setting /></el-icon>项目设置
        </el-dropdown-item>
        <el-dropdown-item @click="viewStats(slotProps.project.ID)">
          <el-icon><TrendCharts /></el-icon>项目统计
        </el-dropdown-item>
      </template>
    </GridTable>

    <ProjectSettingsDialog />


  </div>
</template>

<script>
import {inject, onMounted, ref} from 'vue';
import {getList as getRoleList} from '@/services/roleService';
import {add, deletedById, detail, getList as getProjectList, getSetting, update, saveSetting} from '@/services/projectService';
import ADialog from '@/components/ADialog.vue';
import {useCRUD} from '@/composables/useCRUD';
import {uploadFile} from "@/services/uploadService";
import edit from "@element-plus/icons/lib/Edit";
import GridTable from "@/components/table/GridTable.vue";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import ProjectSettingsDialog from "@/views/project/projectSettingsDialog.vue";
import {openProjectSettingsForCreate, projectSettingsModalState} from "@/composables/useState";
import {
  Expand,
  Files,
  Plus,
  Position,
  RefreshRight,
  Setting,
  Timer,
  TrendCharts,
  UserFilled,
  View
} from "@element-plus/icons-vue";


export default {
  computed: {
    edit() {
      return edit
    }
  },
  components: {
    ProjectSettingsDialog,
    GridTable,
    Plus,
    RefreshRight,
    ADialog,
    View,
    UserFilled,
    Expand,
    Timer,
    Files,
    Setting,
    TrendCharts,
    Position
  },
  setup() {
    const initialProject = {
      ID: null,
      Name: '',
      Description: '',
      CoverImage: '',
      Category: '',
      Tags: '',
      // OwnerID: null,
      Sort: 1,
      Status: 0,
      // APIs: [],
    };

    const router = useRouter();

    const apiMethods = {
      getList: getProjectList,
      add: add,
      update: update,
      detail: detail,
      deletedById: deletedById,
    };

    const tags = ref([]);
    const newTag = ref('');
    const editableTabs = inject('editableTabs');
    const activeTab = inject('activeTab');


    const addTag = () => {
      // 检查标签是否存在且不在当前标签数组中
      if (newTag.value && !tags.value.includes(newTag.value)) {
        tags.value.push(newTag.value);
        newTag.value = '';  // 清空输入
      }
    };

    const removeTag = (index) => {
      tags.value.splice(index, 1);
    };

    const beforeAvatarUpload = async (rawFile) => {
      if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('头像图片必须为JPG或PNG格式!');
        return false;
      } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像图片大小不能超过2MB!');
        return false;
      }

      try {
        const response = await uploadFile(rawFile);
        console.log(response.data.cover_image)
        if (response && response.data && response.data.url) {
          Project.value.CoverImage = "http://10.8.0.6:8051/" + response.data.url;
        }
      } catch (error) {
        ElMessage.error('上传失败!');
      }
      return false;
    };

    const handleAvatarSuccess = (response) => {
      Project.CoverImage = response.url;
    };

    const {
      data: Projects,
      selected: Project,
      dialogVisible,
      searchText,
      listData,
      saveData,
      refresh,
      addNew,
      getDetail,
      deleted: deleteProject,
      resetData,
      dialogTitle,
      handleSearch,
      handleSizeChange,
      handlePageChange,
      resetFilters,
    } = useCRUD(apiMethods, initialProject);

    const allRoles = ref([]);

    onMounted(async () => {
      await listData();
      const rolesResponse = await getRoleList();
      if (rolesResponse.data) {
        allRoles.value = rolesResponse.data;
      }
    });

    const viewDetails = (projectId) => {
      router.push({ name: 'ProjectDetailView', params: { projectId } });
    };


    const manageMembers = (projectId) => {
      router.push({ name: 'ManageMembersView', params: { projectId } });
    };

    const manageTasks = (projectId) => {
      router.push({ name: 'ManageTasksView', params: { projectId } });
    };


    const viewMilestones = (projectId) => {
      const newTab = {
        title: '时间线/里程碑',
        name: `/projects/view-milestones`,
        content: '',
        path: `/projects/view-milestones`,
        id: projectId
      };

      editableTabs.value.push(newTab);
      activeTab.value = newTab.name;
      localStorage.setItem('editableTabs', JSON.stringify(editableTabs.value));
      router.push({ name: 'ViewMilestonesIndex', params: { projectId } });
    };


    const manageFiles = (projectId) => {
      router.push({ name: 'ManageFilesView', params: { projectId } });
    };

    async function projectSettings(projectId) {
      try {
        const response = await getSetting(projectId);
        if (response.data && response.code === 200) {
          projectSettingsModalState.projectSetting.value = response.data;
        } else {
          console.error("加载项目设置失败:", response.data.message);
        }
      } catch (error) {
        console.error("API调用失败:", error.message);
      }
      openProjectSettingsForCreate(projectId);
    }

    const viewStats = (projectId) => {
      router.push({ name: 'ProjectStatsView', params: { projectId } });
    };

    const manageAPIEndpoints = (projectId) => {
      const newTab = {
        title: 'API端点管理',
        name: `/projects/api-endpoints/list`,
        content: '',
        path: `/projects/api-endpoints/list`,
        id: projectId
      };

      editableTabs.value.push(newTab);
      activeTab.value = newTab.name;
      localStorage.setItem('editableTabs', JSON.stringify(editableTabs.value));
      router.push({ name: 'ApiEndpointsIndex', params: { projectId } });
    }

    return {
      Projects,
      Project,
      allRoles,
      dialogVisible,
      searchText,
      listData,
      saveData,
      refresh,
      addNew,
      getDetail,
      deleteProject,
      resetData,
      dialogTitle,
      handleAvatarSuccess,
      beforeAvatarUpload,
      handleSearch,
      handleSizeChange,
      handlePageChange,
      resetFilters,
      tags,
      newTag,
      addTag,
      removeTag,
      viewDetails,
      manageMembers,
      manageTasks,
      viewMilestones,
      manageFiles,
      viewStats,
      manageAPIEndpoints,
      editableTabs,
      activeTab,
      projectSettings
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
