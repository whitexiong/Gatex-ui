<template>
  <div class="grid-container">
    <el-row :gutter="20">
      <el-col v-for="project in paginatedProjects" :key="project.ID" :span="8">
        <div class="project-card" @mouseover="hover = project.ID" @mouseout="hover = null">
          <el-card :body-style="{ padding: '0px' }" :class="{ 'hovered': hover === project.ID }">

            <div class="project-header">
              <el-dropdown trigger="click">
                <el-icon class="el-dropdown-link more-options"><More /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="editProject(project.ID)">编辑</el-dropdown-item>
                    <el-dropdown-item @click="deleteProject(project.ID)">删除</el-dropdown-item>
                    <el-dropdown-item @click="viewDetails(project.ID)">查看详情</el-dropdown-item>
                    <el-dropdown-item @click="manageMembers(project.ID)">成员管理</el-dropdown-item>
                    <el-dropdown-item @click="manageTasks(project.ID)">任务管理</el-dropdown-item>
                    <el-dropdown-item @click="viewMilestones(project.ID)">时间线/里程碑</el-dropdown-item>
                    <el-dropdown-item @click="manageFiles(project.ID)">文件和文档</el-dropdown-item>
                    <el-dropdown-item @click="projectSettings(project.ID)">项目设置</el-dropdown-item>
                    <el-dropdown-item @click="viewStats(project.ID)">项目统计</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <div class="project-card-content">
              <div class="thumbnail-wrapper">
                <img :src="project.CoverImage" class="thumbnail" alt="project image">
              </div>

              <div class="info-wrapper">
                <div class="project-details">
                  <el-scrollbar>
                    <span class="project-name" @click="manageProject(project.ID)">{{ project.Name }}</span>
                    <div class="project-category">分类: {{ project.Category }}</div>
                    <div class="project-tags">
                      <span v-for="tag in project.Tags.split(',')" :key="tag" class="tag">{{ tag }}</span>
                    </div>
                    <div class="project-description" >{{ project.Description }}</div>
                  </el-scrollbar>
                </div>
              </div>
            </div>

          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-pagination
        v-if="tableData.pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.pagination.currentPage"
        :page-sizes="[1, 10, 50, 100]"
        :page-size="tableData.pagination.pageSize"
        layout="sizes, total, prev, pager, next, jumper"
        :total="tableData.pagination.totalItems"
        :page-size-options="['10 条/页', '20 条/页', '50 条/页', '100 条/页']"
        :prev-text="上一页"
        :next-text="下一页">
    </el-pagination>

  </div>
</template>

<script>
import {More} from "@element-plus/icons-vue";

export default {
  props: {
    tableData: {
      type: Object,
      default: () => ({
        columnsConfig: [],
        items: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalItems: 0
        }
      })
    }
  },
  components: {More},
  data() {
    return {
      hover: null
    };
  },

  computed: {
    paginatedProjects() {
      if (!this.tableData || !this.tableData.pagination) {
        return [];
      }

      const { currentPage, pageSize } = this.tableData.pagination;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;

      return this.tableData.items.slice(start, end);
    }
  },

  methods: {
    handleSizeChange(size) {
      this.$emit('size-change', size);
    },
    handleCurrentChange(page) {
      this.$emit('current-change', page);
    },
    editProject(projectId) {
      this.$emit('edit', projectId);
    },
    deleteProject(projectId) {
      this.$emit('delete', projectId);
    },
    viewDetails(projectId) {
      this.$emit('details', projectId);
    },
    manageMembers(projectId) {
      this.$emit('members', projectId);
    },
    manageTasks(projectId) {
      this.$emit('tasks', projectId);
    },
    viewMilestones(projectId) {
      this.$emit('milestones', projectId);
    },
    manageFiles(projectId) {
      this.$emit('files', projectId);
    },
    projectSettings(projectId) {
      this.$emit('settings', projectId);
    },
    viewStats(projectId) {
      this.$emit('stats', projectId);
    },
    handlePageChange(newPage) {
      this.$emit('current-change', newPage);
    }
  }

};
</script>

<style scoped>

.grid-container {
  padding: 40px 20px;
}

.project-card-content {
  position: relative;
  height: 200px;
  display: flex;
}

.thumbnail-wrapper {
  flex: 1;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-wrapper {
  flex: 2;
  padding: 15px 0;
  position: relative;
}


.project-details {
  background: linear-gradient(135deg, #E7ECF2, #E1E8EE);
  padding: 15px;
  border-radius: 5px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 实现完全居中 */
  height: 200px;
  width: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}


.project-name {
  font-size: 1.5em;
  font-weight: 700;
  margin-bottom: 15px;
  color: #000000;
}

.project-card {
  transition: transform 0.3s;
  margin: 20px 0;
  cursor: pointer;

}

.project-card:hover {
  transform: translateY(-10px);
}

.project-header {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
}

.more-options {
  cursor: pointer;
  font-size: 1.5em;
  transition: color 0.3s;
}

.more-options:hover {
  color: #5c6bc0;
}

.el-card {
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.project-category {
  font-size: 1.2em;
  color: #000000;
  margin: 10px 0;

}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
}

.tag {
  background-color: #ebebeb;
  padding: 5px 10px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  color: #333;
  transition: background-color 0.2s;
}

.tag:hover {
  background-color: #d1d1d1;
}

.project-description {
  font-size: 1em;
  margin-top: 10px;
  flex: 1;
  overflow: auto;
  line-height: 20px;
}

 @media (max-width: 600px) {
  .project-card {
    width: 100%;
    margin: 10px 0;
  }
}

@media (min-width: 601px) and (max-width: 900px) {
  .project-card {
    width: calc(50% - 20px);
  }
}
</style>
