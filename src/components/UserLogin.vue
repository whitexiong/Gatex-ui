<template>
  <div class="user-login-container">
    <div class="login-box">
      <div class="title-container">
        <h2 class="header-text">GateX</h2>
        <img src="@/assets/logo.png" alt="Logo" class="nav-logo"/>
      </div>
      <el-form :model="loginForm" @submit.prevent="handleLogin" class="space-y-4">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码&nbsp&nbsp&nbsp" prop="password">
          <el-input type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="flex justify-between">
          <el-button @click="handleLogin">登录</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
        <p v-if="errorMsg" class="text-red-600 mt-2">{{ errorMsg }}</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { UserLogin, GetUserMenus } from "@/services/userService";
import {useRouter} from "vue-router";

export default {
  name: "UserLogin",

  setup() {
    const loginForm = ref({
      username: "",
      password: ""
    });

    const errorMsg = ref("");
    const router = useRouter();

    const fetchAndStoreMenus = async () => {
      try {
        const menuResponse = await GetUserMenus();
        if (menuResponse && menuResponse.data) {
          localStorage.setItem('userMenus', JSON.stringify(menuResponse.data));
        }
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      }
    }

    const handleLogin = async () => {
      try {
        const response = await UserLogin(loginForm.value.username, loginForm.value.password);
        if (response && response.code === 200 && response.data.token) {
          // 存储token
          localStorage.setItem('token', response.data.token);

          // 存储用户数据
          localStorage.setItem('userData', JSON.stringify(response.data.user));

          // 请求并存储用户的菜单数据
          await fetchAndStoreMenus();

          // 导航到Dashboard
          await router.push({name: 'Dashboard'});
        } else {
          errorMsg.value = "登录失败: " + response.msg;
        }
      } catch (error) {
        errorMsg.value = "登录失败，请联系管理员!";
      }
    };

    const resetForm = () => {
      loginForm.value.username = '';
      loginForm.value.password = '';
      errorMsg.value = '';
    };

    return {
      loginForm,
      handleLogin,
      resetForm,
      errorMsg
    };
  }
};
</script>

<style scoped>
.user-login-container {
  background-color: #f3f4f6;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("~@/assets/img_1.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.login-box {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px 50px;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 320px;
  text-align: center; /* 保证内部元素都居中对齐 */
}

/* 标题加粗 */
h2 {
  font-weight: bold;
}

/* 输入框样式调整 */
.el-input__inner {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.el-input__inner:focus {
  border-color: #007BFF;
  box-shadow: 0 0 5px rgba(0,123,255,0.5);
}

/* 按钮样式调整 */
.el-button {
  padding: 10px 30px;
  border-radius: 4px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;
}

.el-button:hover {
  transform: scale(1.05);
}

/* 调整间距 */
.el-form-item {
  margin-bottom: 20px;
}

.text-red-600 {
  font-weight: bold; /* 错误信息加粗 */
}

.title-container {
  display: flex;             /* 使用Flexbox布局 */
  align-items: center;      /* 垂直居中对齐 */
  justify-content: center;  /* 水平居中对齐 */
  gap: 10px;                /* 定义标题和图像之间的间距 */
}

.header-text {
  margin: 0;   /* 去掉默认的标题边距 */
}

.nav-logo {
  height: 30px;
}


</style>
