<template>
  <div>
    <!-- Search & Filter Section -->
    <div class="filter-section">
      <el-input
          v-for="column in searchableColumns"
          :key="column.key"
          v-model="searchQueries[column.key]"
          :placeholder="column.label"
          @input="onSearch(column.key)"
      ></el-input>

      <!-- 假设所有字段都可以筛选，可根据实际情况调整 -->
      <el-select v-for="column in filterableColumns" :key="column.key" v-model="filters[column.key]" @change="onFilterChange">
        <el-option label="全部" value=""></el-option>
        <!-- Add more options here based on your requirements -->
      </el-select>

      <el-button @click="resetFilters">重置</el-button>
    </div>

    <!-- Table Section -->
    <el-table v-if="tableData && tableData.items" :data="computedTableData"  style="width: 1980px; height: 1000px" border>
      <el-table-column
          v-for="column in tableData.columnsConfig"
          :key="column.key"
          :label="column.label"
          :prop="column.key">
      </el-table-column>

      <el-table-column label="操作" row-key="ID">
        <template #default="{ row }">
          <el-button style="color: black;" type="primary" @click="editRow(row.ID)">编辑</el-button>
          <el-button style="color: black;" type="danger"  @click="deleteRow(row.ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination Section -->
    <el-pagination
        v-if="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.totalItems">
    </el-pagination>

  </div>
</template>

<script>
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
  data() {
    let searchQueries = {};
    let filters = {};

    if (this.tableData && Array.isArray(this.tableData.columnsConfig)) {
      searchQueries = this.tableData.columnsConfig.reduce((acc, column) => {
        if (column.searchable) acc[column.key] = '';
        return acc;
      }, {});

      filters = this.tableData.columnsConfig.reduce((acc, column) => {
        if (column.filterable) acc[column.key] = '';
        return acc;
      }, {});
    }

    return {
      searchQueries,
      filters
    };
  },
  computed: {
    pagination() {
      return this.tableData.pagination;
    },
    searchableColumns() {
      if (!this.tableData || !this.tableData.columnsConfig) return [];
      return this.tableData.columnsConfig.filter(column => column.searchable);
    },
    filterableColumns() {
      // Check if tableData and columnsConfig are defined before calling filter
      if (!this.tableData || !this.tableData.columnsConfig) return [];

      // Now you can safely use filter
      return this.tableData.columnsConfig.filter(column => column.filterable);
    },
    computedTableData() {
      return this.tableData.items;
    }
  },
  methods: {
    onSearch(key) {
      this.$emit('search', { [key]: this.searchQueries[key] });
    },
    onFilterChange() {
      this.$emit('filter-change', this.filters);
    },
    resetFilters() {
      for (const key in this.searchQueries) {
        this.searchQueries[key] = '';
      }
      for (const key in this.filters) {
        this.filters[key] = '';
      }
      this.$emit('reset-filters');
    },
    handleSizeChange(size) {
      this.$emit('size-change', size);
    },
    handleCurrentChange(page) {
      this.$emit('current-change', page);
    },
    editRow(row) {
      this.$emit('edit', row);
    },
    deleteRow(row) {
      this.$emit('delete', row);
    }
  }
}
</script>

<style scoped>
.filter-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
