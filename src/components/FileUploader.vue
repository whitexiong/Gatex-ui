<template>
  <div>
    <!-- File Upload Button -->
    <el-button class="icon-btn" @click.stop="triggerUpload">
      <el-icon>
        <Folder />
      </el-icon>
    </el-button>

    <!-- Hidden File Input -->
    <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" />

    <!-- Upload Confirmation Dialog -->
    <el-dialog v-model="showConfirmDialog" title="确认上传">
      <!-- Recipient Information -->
      <div class="recipient-info">
        <el-avatar :src="'https://placekitten.com/49/49'" class="chat-avatar"></el-avatar>
        <div class="recipient-details">
          <span>发送给：</span>
          <strong class="recipient-name">小白</strong>
        </div>
      </div>

      <div class="file-display">
        <strong class="file-label">文件名称:</strong>
        <span class="file-info">{{ selectedFile.name }}</span>
      </div>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="showConfirmDialog = false">取消</el-button>
          <el-button @click="confirmUpload">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Folder } from "@element-plus/icons-vue";
import { uploadFile } from "@/services/uploadService";
import { ElMessage } from 'element-plus';

export default {
  props: {
    avatar: {
      type: String,
      required: true
    },
    userId: {
      type: [String, Number],
      required: true
    },
    chatWindowId: {
      type: [String, Number],
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  components: { Folder },
  setup(props, { emit }) {
    const fileInput = ref(null);
    const showConfirmDialog = ref(false);
    const selectedFile = ref(null);

    const triggerUpload = () => {
      fileInput.value?.click();
    };

    const handleFileChange = (event) => {
      if (event.target.files && event.target.files[0]) {
        selectedFile.value = event.target.files[0];
        showConfirmDialog.value = true;
      }
    };

    const confirmUpload = async () => {
      showConfirmDialog.value = false;
      if (selectedFile.value) {
        try {
          const response = await uploadFile(selectedFile.value);
          if (response && response.data && response.data.avatar_url) {
            // 根据您的响应构建完整的 URL
            const imageUrl = "http://10.8.0.6:8051/" + response.data.avatar_url;

            // 发出一个事件，通知父组件图片已上传，并传递URL。
            emit('file-uploaded', imageUrl);
          } else {
            // 如果响应中没有 avatar_url，给出错误消息
            ElMessage.error('服务器未返回图片 URL！');
          }
        } catch (error) {
          ElMessage.error('上传失败!');
        }
      }
    };


    return {
      triggerUpload,
      handleFileChange,
      confirmUpload,
      showConfirmDialog,
      fileInput,
      selectedFile
    };
  }
};
</script>
