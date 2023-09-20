<template>
  <div class="breadcrumb-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
          v-for="(item, index) in breadcrumbs"
          :key="item.path"
          :to="index !== 0 && index !== breadcrumbs.length - 1 ? { path: item.path } : undefined">
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "BreadcrumbNav",

  computed: {
    breadcrumbs() {
      const routePath = this.$route.path;
      const allData = JSON.parse(localStorage.getItem('userMenus') || '[]');
      const breadcrumbs = [];

      this.findBreadcrumbPath(routePath, allData, breadcrumbs);

      return breadcrumbs.reverse();
    }
  },

  methods: {
    findBreadcrumbPath(targetPath, data, result, level = 1) {
      for (let i = 0; i < data.length; i++) {
        if (targetPath === data[i].path) {
          result.push({ name: data[i].name, path: data[i].path, level });
          return true;
        }
        if (data[i].children && data[i].children.length && this.findBreadcrumbPath(targetPath, data[i].children, result, level + 1)) {
          result.push({ name: data[i].name, path: data[i].path, level }); // 添加当前层级到面包屑
          return true;
        }
      }
      return false;
    }

  }
};
</script>

<style scoped>
.breadcrumb-container {
  padding: 20px 30px;
  border-bottom: 1px solid #eaeaea;
}
</style>
