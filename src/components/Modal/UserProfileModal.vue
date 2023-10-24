<template>
  <el-dialog
      v-model="isVisible"
      width="50%"
      :title="dialogTitle"
      @close="resetData"
  >
    <el-form :model="User" label-width="80px">
      <el-form-item
          v-for="item in userFormItems"
          :key="item.prop"
          :label="item.label"
      >

        <component
            :is="item.component"
            v-model="User[item.prop]"
            v-bind="item.attrs"
        >
          <!-- Logic for the avatar uploader -->
          <template v-if="item.component === 'el-upload'">
            <img v-if="User.AvatarUrl" :src="User.AvatarUrl" class="avatar" alt=""/>
            <el-icon class="avatar-uploader-icon" name="el-icon-plus"></el-icon>
          </template>

          <el-option
              :v-if="item.component === 'el-select'"
              v-for="option in item.options"
              :key="option.ID"
              :label="option.Name"
              :value="option.ID"
          ></el-option>
        </component>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="resetData">取 消</el-button>
      <el-button @click="saveData">保存</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { userProfileModalState } from "@/composables/useState";
import { uploadFile } from "@/services/uploadService";
import {update} from "@/services/userService";

export default {
  name: 'UserProfileModal',
  setup() {
    const dialogTitle = ref("用户信息");
    const { isVisible, state: User, close } = userProfileModalState;
    const showPassword = ref(false);

    const handleAvatarSuccess = (response) => {
      console.log(User)
      User.AvatarUrl = response.url;
    };

    const beforeAvatarUpload = async (rawFile) => {
      if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('头像图片必须为JPG格式!');
        return false;
      }

      if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像图片大小不能超过2MB!');
        return false;
      }

      try {
        const response = await uploadFile(rawFile);
        if (response && response.data && response.data.url) {
          User.AvatarUrl = "http://127.0.0.1:8051/" + response.data.url;
        }
      } catch (error) {
        ElMessage.error('上传失败!');
      }

      return false;
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };


    const saveData = () => {
      update(User.value.ID, User.value)
          .then(response => {
            console.log("项目设置已保存");
            close();
          })
          .catch(error => {
            console.error("保存项目设置出错:", error);
          });
    };

    const resetData = () => {
      // 重置数据逻辑
      close();
    };

    const userFormItems = [
      {
        prop: 'AvatarUrl',
        label: '头像',
        component: 'el-upload',
        attrs: {
          class: 'avatar-uploader',
          'show-file-list': false,
          'on-success': handleAvatarSuccess,
          'before-upload': beforeAvatarUpload
        },
      },
      {
        prop: 'Username',
        label: '用户名',
        component: 'el-input',
        attrs: {
          placeholder: '请输入用户名'
        }
      },
      {
        prop: 'Password',
        label: '密码',
        component: 'el-input',
        attrs: {
          placeholder: '请输入密码',
          type: 'password',
          append: {
            component: 'el-button',
            attrs: {
              '@click': togglePasswordVisibility,
              icon: showPassword.value ? 'el-icon-eye-off' : 'el-icon-eye'
            }
          }
        }
      },
      {
        prop: 'Email',
        label: '邮箱',
        component: 'el-input',
        attrs: {
          placeholder: '请输入邮箱'
        }
      },
    ];

    return {
      isVisible,
      dialogTitle,
      User,
      showPassword,
      togglePasswordVisibility,
      handleAvatarSuccess,
      beforeAvatarUpload,
      saveData,
      resetData,
      userFormItems
    };
  }
};
</script>

<style scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
}
</style>
