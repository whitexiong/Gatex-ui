<template>
  <div class="grid-container">
    <el-row :gutter="20">
      <el-col v-for="project in paginatedProjects" :key="project.id" :span="8">
        <div class="project-card" @mouseover="hover = project.id" @mouseout="hover = null">
          <el-card :body-style="{ padding: '0px' }" :class="{ 'hovered': hover === project.id }">

            <div class="project-header">
              <el-dropdown trigger="click">
                <el-icon class="el-dropdown-link more-options"><More /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="editProject(project.id)">编辑</el-dropdown-item>
                    <el-dropdown-item @click="deleteProject(project.id)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>


            <div class="project-card-content">
              <div class="thumbnail-wrapper">
                <img :src="project.thumbnail" class="thumbnail" alt="project image">
              </div>


              <div class="info-wrapper">

                <div class="project-details">
                  <el-scrollbar>

                  <span class="project-name" @click="manageProject(project.id)">{{ project.name }}</span>
                  <div class="project-category">分类: {{ project.category }}</div>
                  <div class="project-tags">
                    <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                    <div class="project-description" >{{ project.description }}</div>
                  </el-scrollbar>

                </div>
              </div>
            </div>

          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-pagination
        layout="prev, pager, next"
        :total="projects.length"
        :page-size="pageSize"
        @current-change="handlePageChange"
    ></el-pagination>
  </div>
</template>

<script>

import {More} from "@element-plus/icons-vue";

export default {
  components: {More},

  data() {
    return {
      hover: null,
      projects: [
        {
          id: 1,
          name: '项目1',
          thumbnail: 'http://fire.kwqskj.com/static/images/logo.png',
          category: 'Web 开发',
          tags: ['Vue.js', 'Node.js', 'MongoDB'],
          description: '这是一个基于 Vue.js、Node.js 和 MongoDB 的 Web 开发项目一个基于 Vue.js'
        },
        {
          id: 2,
          name: '项目2',
          thumbnail: 'http://192.168.0.210:8080/img/logo.efe14ba4.png',
          category: '移动应用',
          tags: ['React Native', 'Firebase'],
          description: '这是一个基于 React Native 和 Firebase 的移动应用开发项目...'
        },
        {
          id: 2,
          name: '项目2',
          thumbnail: 'http://192.168.0.210:8080/img/logo.efe14ba4.png',
          category: '移动应用',
          tags: ['React Native', 'Firebase'],
          description: '这是一个基于 React Native 和 Firebase 的移动应用开发项目...'
        },
        {
          id: 2,
          name: '项目2',
          thumbnail: 'http://192.168.0.210:8080/img/logo.efe14ba4.png',
          category: '移动应用',
          tags: ['React Native', 'Firebase'],
          description: '这是一个基于 React Native 和 Firebase 的移动应用开发项目...'
        },
        // ...可能的其他项目数据
      ],
      pageSize: 9,
      currentPage: 1
    };
  },
  computed: {
    paginatedProjects() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.projects.slice(start, end);
    }
  },
  methods: {
    toggleMenu(projectId) {
      this.hover = projectId;
    },
    editProject(projectId) {
      console.log("Edit project:", projectId);
      // 这里你可以添加编辑项目的逻辑
    },
    deleteProject(projectId) {
      console.log("Delete project:", projectId);
      // 这里你可以添加删除项目的逻辑
    },
    manageProject(projectId) {
      console.log("Manage project:", projectId);
      // 这里你可以添加管理项目的逻辑
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
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
