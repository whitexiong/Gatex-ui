<template>
  <el-container class="wechat-container">

    <el-aside class="aside">
      <!-- 搜索和+按钮 -->
      <div class="header-flex">
        <!-- 搜索框 -->
        <el-input
            v-model="input1"
            class="w-50 m-2"
            size="small"
            placeholder="搜索"
            :prefix-icon="Search"
        />

        <!-- +按钮 -->
        <el-button @click="showModal = true" size="small" class="chat-plus">
          <el-icon :size="12" ><Plus /></el-icon>
        </el-button>
      </div>

      <!-- 用户列表 -->
<!--      <div class="user-list-scrollable">-->
        <el-scrollbar>

        <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="user-item"
            :class="{ selected: user.id === selectedUser.id }"
            @click="selectUser(user)"
        >
          <el-avatar :src="user.avatar"></el-avatar>
          <span>{{ user.username }}</span>
        </div>
        </el-scrollbar>

<!--      </div>-->
    </el-aside>

    <!-- 新增的模态框 -->
    <el-dialog v-model="showModal" title="选择用户">
      <el-transfer
          v-model="selectedUsers"
          :data="state.transferData"
          :titles="['好友列表', '选择联系人']"
          filterable
          :filter-placeholder="'搜索用户'"
      ></el-transfer>

      <template v-slot:footer>
        <el-button @click="toggleModal">取 消</el-button>
        <el-button @click="onConfirmTransfer">完 成</el-button>
      </template>
    </el-dialog>

    <el-container class="chat-container">
      <el-header class="header" v-if="selectedUser">
        {{ selectedUser.name }}
        <span v-if="isTyping">...正在输入</span>
      </el-header>
      <el-scrollbar>

      <el-main class="messages" ref="messagesContainer">
          <div v-for="(msg, index) in currentChatMessages" :key="index" :class="msg.type">
            <el-avatar :src="msg.type === 'sent' ? 'https://placekitten.com/49/49' : selectedUser.avatar" class="chat-avatar"></el-avatar>
            <div class="message">{{ msg.content }}</div>
          </div>
      </el-main>
      </el-scrollbar>

      <el-footer class="input-container">
        <div class="toolbar">
          <el-button class="icon-btn"><el-icon><WalletFilled /></el-icon></el-button>
          <el-button class="icon-btn"><el-icon><Folder /></el-icon></el-button>
          <el-button class="icon-btn"><el-icon><ChatRound /></el-icon></el-button>
        </div>
        <el-input
            v-model="message"
            placeholder="请输入...."
            class="chat-input"
            @keyup.enter="sendMessage"
        ></el-input>
        <div class="send-button" @click="sendMessage">发送</div>
      </el-footer>

    </el-container>
  </el-container>
</template>

<script>
import { reactive, toRefs, onBeforeUnmount, onMounted, computed, nextTick, ref } from "vue";
import {WalletFilled, Folder, ChatRound, Search} from "@element-plus/icons-vue";
import { getChatUsers, fetchChatHistoryForUser } from "@/services/chatService";
import {Plus} from '@element-plus/icons';

export default {
  computed: {
    Search() {
      return Search
    }
  },
  components: { WalletFilled, Folder, ChatRound, Plus },

  setup() {

    const showModal = ref(false);
    const input1 = ref('');
    const selectedUser = ref({});
    const selectedUsers = ref([]);

    const state = reactive({
      message: '',
      chatMessages: {},
      users: [],
      selectedUser: { id: null, username: '', avatar: '', chat_room_id: null },
      socket: null,
      filteredUsers: [
        { id: '1', username: 'Alice', avatar: 'path_to_avatar_1.jpg' },
        { id: '2', username: 'Bob', avatar: 'path_to_avatar_2.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
        { id: '3', username: 'Charlie', avatar: 'path_to_avatar_3.jpg' },
      ],  // 假设这是你的用户列表
      transferData: []   // 假设这是你的穿梭框数据
    });

    // 创建穿梭框数据
    const createTransferData = () => {
      state.transferData = state.filteredUsers.map(user => ({
        key: user.id,
        label: user.username,
        disabled: false
      }));
    };

    const toggleModal = () => {
      showModal.value = !showModal.value;
    };

    // 选择用户
    // const selectUser = (user) => {
    //   selectedUser.value = user;
    // };

    // 确认穿梭框的选择
    const onConfirmTransfer = () => {
      console.log("Selected users in Transfer:", selectedUsers.value);
      toggleModal();
    };

    // 调用创建穿梭框数据的函数
    createTransferData();

    const currentChatMessages = computed(() => {
      return state.chatMessages[state.selectedUser?.chat_room_id] || [];
    });

    onMounted(() => {
      initWebSocket();
      fetchChatUsers();
    });

    onBeforeUnmount(() => {
      if (state.socket) {
        state.socket.close();
      }
    });

    const fetchChatUsers = async () => {
      try {
        const response = await getChatUsers();
        state.users = response.data;
      } catch (error) {
        console.error("Error fetching chat users:", error);
      }
    };

    const initWebSocket = () => {
      // state.socket = new WebSocket("ws://120.46.80.249:8051/ws");
      const token = localStorage.getItem('token');
      state.socket = new WebSocket(`ws://127.0.0.1:8051/ws?token=${token}`);

      state.socket.onopen = (event) => {
        console.log("WebSocket 已打开：", event);

        const userData = JSON.parse(localStorage.getItem('userData'));
        const userId = userData ? userData.id : null;

        if (userId) {
          state.socket.send(JSON.stringify({
            type: 'user_online',
            userId: userId
          }));
        }
      };

      state.socket.onmessage = (event) => {
        console.log("Received message:", event.data);
        const userData = JSON.parse(localStorage.getItem('userData'));
        const userId = userData ? userData.id : null;

        try {
          const data = JSON.parse(event.data);
          console.log("Parsed message data:", data);

          if (data.senderId === userId) {
            console.log("Message sent by the current user. Ignoring.");
            return;
          }

          const chatRoomId = data.ChatRoomID;
          if (!state.chatMessages[chatRoomId]) {
            state.chatMessages[chatRoomId] = [];
          }

          state.chatMessages[chatRoomId].push({ content: data.Content, type: 'received' });
        } catch (error) {
          console.error("解析消息错误:", error);
        }
      };

      state.socket.onerror = (error) => {
        console.error("WebSocket 出错：", error);
      };

      state.socket.onclose = (event) => {
        console.log("WebSocket 已关闭：", event);
      };
    };

    const sendMessage = () => {
      if (state.message.trim() && state.selectedUser && state.selectedUser.id) {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const senderId = userData ? userData.id : null;
        if (!senderId) {
          console.error("User ID not found in local storage.");
          return;
        }

        const messageBody = {
          content: state.message,
          toUserId: state.selectedUser.id,
          chatRoomId: state.selectedUser.chat_room_id,
          senderId: senderId
        };

        const payload = {
          type: "text",
          chatId: state.selectedUser.chat_room_id,
          body: JSON.stringify(messageBody)
        };

        state.socket.send(JSON.stringify(payload));

        if (!state.chatMessages[state.selectedUser.chat_room_id]) {
          state.chatMessages[state.selectedUser.chat_room_id] = [];
        }
        state.chatMessages[state.selectedUser.chat_room_id].push({ content: state.message, type: 'sent' });

        state.message = '';
      }
    };

    const selectUser = (user) => {
      state.selectedUser = user;
      fetchChatHistory(user.id);
    };

    const fetchChatHistory = async (userId) => {
      try {
        const response = await fetchChatHistoryForUser(userId);
        state.chatMessages[state.selectedUser.chat_room_id] = response.data;
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    return {
      ...toRefs(state),
      currentChatMessages,
      sendMessage,
      selectUser,
      fetchChatUsers,
      initWebSocket,
      fetchChatHistory,
      input1,
      showModal,
      toggleModal,
      onConfirmTransfer,
      selectedUser,
      selectedUsers,
      state
    };
  }
};
</script>

<style scoped>
.wechat-container {
  height: 600px;
  width: 800px;
  border: 1px solid #ccc;
}

.sent .message:hover {
  background-color: rgba(93, 190, 93, 0.7); /* 这是为绿色气泡设置的悬停颜色，你可以根据需要调整 */
}

.header {
  z-index: 1000; /* 将其置于最上层 */
  background-color: #f5f5f5; /* 使用淡灰色背景 */
  border-bottom: 1px solid #e0e0e0; /* 添加一个底边框 */
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */
  height: 60px;  /* 调整高度以适应内容，如果需要可以适当调整 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 底部稍微的阴影 */
  font-size: 16px; /* 调整文字大小，如果需要可以适当调整 */
}


.user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #e4e7ed;
}

.user-item:hover {
  background-color: #e4e7ed;
}

.user-item.selected {
  background-color: #e4e7ed;
}

.user-item span {
  margin-left: 10px;
}

.chat-container {
  flex: 1;
}

.messages {
  overflow-y: scroll;
  padding: 10px;
}

.sent .chat-avatar {
  order: 2;
}

.sent .message {
  background-color: #4CAF50; /* 微信绿色 */
  color: white;
  border-radius: 15px 5px 15px 15px;
}

/* 对方发送的消息样式 */
.received .message {
  background-color: #ffffff;
  color: black;
  border-radius: 5px 15px 15px 15px;
  border: 1px solid #e9e9e9;  /* 微信的对话气泡有一个细细的边 */
}

.chat-avatar {
  margin: 0 10px;
}
.message {
  padding: 8px 12px;
  border-radius: 5px 15px 15px;
  max-width: 70%;
  position: relative;
}
.input-container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  padding: 5px;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
}

.toolbar {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.icon-btn {
  padding: 5px;
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
}

.chat-input {
  flex: 1;
  border-radius: 20px;
  background-color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 0 10px;
}

.send-button {
  color: #4caf50;
  background-color: #e0e0e0;
  border-radius: 15px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-button:hover {
  background-color: #d0d0d0;
}

.sent .message::after {
  content: '';
  position: absolute;
  top: 0;
  right: -6px;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-left-color: #4CAF50;
  border-right: 0;
  border-bottom: 0;
}

/* 对方发送的消息气泡尾巴 */
.received .message::before {
  content: '';
  position: absolute;
  top: 0;
  left: -6px;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-right-color: #ffffff;
  border-left: 0;
  border-bottom: 0;
}

.messages:hover {
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent; /* 鼠标悬停时，滑块变色 */
}

.header-flex {
  position: sticky;              /* 使用 sticky 定位 */
  top: 0;
  z-index: 1000;                   /* 将其置于最上层 */
  background-color: #f5f5f5;      /* 使用淡灰色背景 */
  border-bottom: 1px solid #e0e0e0; /* 添加一个底边框 */
  display: flex;
  justify-content: space-between; /* 在元素之间留出空间 */
  align-items: center;            /* 垂直居中 */
  height: 60px;                   /* 调整高度以适应内容 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 底部稍微的阴影 */
  font-size: 16px;                /* 调整文字大小 */
  padding: 0;                /* 在左右两边添加一些内部间距 */
  margin-top: 0;                  /* 确保顶部没有外部间距 */
  width: 100%;                    /* 填满父容器 */
}

.chat-plus {
  margin-left: 5px;
}

.aside {
  /* 对于大部分的浏览器 */
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */

  /* 对于Webkit浏览器 */
  &::-webkit-scrollbar {
    display: none;
  }

  border-right: 1px solid #e4e7ed;
  background-color: #f5f7fa;
}


</style>
