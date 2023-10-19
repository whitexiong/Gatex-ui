<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-gatex"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
  >
    <el-menu-item index="0" @click="toggleSidebar">
      <el-icon class="toggle-sidebar-icon nav-logo" :name="isCollapse ? 'ArrowRight' : 'ArrowLeft'" ><Fold /></el-icon>
    </el-menu-item>

    <div class="flex-grow" />

    <el-sub-menu index="2">
      <template #title>
        <div class="user-info">
          <div>
            <!-- 当 avatar_url 存在并且不为空时，显示图片 -->
            <el-avatar
                v-if="avatar_url"
                class="user-avatar"
                :src="avatar_url"
            />
            <!-- 当 avatar_url 不存在或为空时，显示图标 -->
            <el-avatar
                v-else
                :icon="UserFilled"
            />
          </div>
          <div class="username">
            {{ username }}
          </div>

        </div>
      </template>
      <el-menu-item index="2-1">
        <el-icon><Postcard /></el-icon> 个人信息
      </el-menu-item>
      <el-menu-item index="2-2" @click="logout">
        <el-icon><SwitchButton /></el-icon> 退出登录
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import { Fold,Postcard,SwitchButton,UserFilled } from "@element-plus/icons-vue";

const activeIndex = ref('1')
const userData = ref(JSON.parse(localStorage.getItem('userData')))
const username = userData.value ? userData.value.username : '未登录'
const avatar_url = userData.value ? userData.value.avatar_url : ''

const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}

</script>

<script>
import { UserLogout } from '@/services/userService';
import router from "@/router";
import { ElMessageBox } from 'element-plus';

export default {
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    }
  },
  props: {
    isCollapse: {
      type: Boolean,
      required: true
    }
  },
}

const logout = () => {
  ElMessageBox.confirm('确定要退出吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await UserLogout();
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('userMenus');
      localStorage.removeItem('editableTabs');
      await router.push('/login');
    } catch (error) {
      console.error("退出登录失败：", error);
    }
  }).catch(() => {
    // 这里处理用户点击“取消”按钮的情况，如果你不需要特殊处理，可以留空。
  });
};

</script>

<style>
.flex-grow {
  flex-grow: 1;
}

.nav-logo {
  height: 60px;  /* 调整为合适的大小 */
  vertical-align: middle;  /* 使图片在导航栏中垂直居中 */
}

.user-info:hover .user-avatar {
  transform: scale(1.1);
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info .username {
  line-height: 1;
  margin-top: 10px;
}

.user-info .user-avatar {
  margin-right: 5px; /* 为头像元素添加右边距 */
}

.username {
  margin-left: 5px;
}

.user-info > div:not(:last-child) {
  border-right: 1px solid var(--el-border-color);
}

</style>
