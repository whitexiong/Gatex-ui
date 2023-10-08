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
        <span class="file-info">xxx.jpg</span>
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
  setup(props) {
    const fileList = ref([]);
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

    const confirmUpload = () => {
      showConfirmDialog.value = false;
      if (selectedFile.value) {
        // 在这里执行实际的上传操作，例如使用 axios 发送文件到服务器。
      }
    };

    return {
      triggerUpload,
      handleFileChange,
      confirmUpload,
      showConfirmDialog,
      fileList,
      fileInput
    };
  }
};

</script>

<style scoped>
.recipient-info {
  display: flex;
  align-items: center;
  gap: 10px; /* space between avatar and the recipient details */
  padding: 10px 0;
}

.recipient-details {
  display: flex;
  flex-direction: column;
}

.recipient-name {
  font-weight: bold;
}

.chat-avatar {
  width: 50px;
  height: 50px;
}

.file-display {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 0;
}

.file-label {
  font-weight: bold;
}
</style>
