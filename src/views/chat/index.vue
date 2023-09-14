<template>
  <el-container class="wechat-container">
    <el-aside class="user-list">
      <div v-for="user in users" :key="user.id" class="user-item" :class="{ selected: user.id === selectedUser.id }" @click="selectUser(user)">
        <el-avatar :src="user.avatar"></el-avatar>
        <span>{{ user.username }}</span>
      </div>
    </el-aside>
    <el-container class="chat-container">
      <el-header class="header" v-if="selectedUser">
        {{ selectedUser.name }}
        <span v-if="isTyping">...正在输入</span>
      </el-header>
      <el-main class="messages" ref="messagesContainer">
        <div v-for="(msg, index) in currentChatMessages" :key="index" :class="msg.type">
          <el-avatar :src="msg.type === 'sent' ? 'https://placekitten.com/49/49' : selectedUser.avatar" class="chat-avatar"></el-avatar>
          <div class="message">{{ msg.content }}</div>
        </div>
      </el-main>
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
import { WalletFilled, Folder, ChatRound } from "@element-plus/icons-vue";
import { getChatUsers, fetchChatHistoryForUser } from "@/services/chatService";

export default {
  components: { WalletFilled, Folder, ChatRound },

  setup() {
    const state = reactive({
      message: '',
      chatMessages: {},
      users: [],
      selectedUser: { id: null, username: '', avatar: '', chat_room_id: null },
      socket: null
    });

    const messagesContainer = ref(null); // 定义一个响应式引用
    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    };

    const currentChatMessages = computed(() => {
      return state.chatMessages[state.selectedUser?.chat_room_id] || [];
    });

    onMounted(() => {
      initWebSocket();
      fetchChatUsers();
      scrollToBottom();
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
      state.socket = new WebSocket("ws://120.46.80.249:8051/ws");

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

          if (data.ToUserID !== userId) {
            return
          }

          const chatRoomId = data.ChatRoomID;
          if (!state.chatMessages[chatRoomId]) {
            state.chatMessages[chatRoomId] = [];
          }

          state.chatMessages[chatRoomId].push({ content: data.Content, type: 'received' });
          scrollToBottom();

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
        scrollToBottom()
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
      fetchChatHistory
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


.user-list {
  width: 250px;
  padding: 20px;
  border-right: 1px solid #e4e7ed;
  background-color: #f5f7fa;
  overflow-y: scroll;
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

.received, .sent {
  display: flex;
  align-items: center;
  padding: 5px 0;
  margin-bottom: 10px;
}

.sent {
  justify-content: flex-end;
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


/* 为用户列表和消息列表都预留滚动条的宽度 */
.messages, .user-list {
  padding-right: 8px; /* 和滚动条的宽度相等的内边距 */
  box-sizing: content-box; /* 使用内容盒模型，确保总宽度不变 */
}

/* WebKit浏览器（如Chrome、Safari）的滚动条样式 */
.messages::-webkit-scrollbar, .user-list::-webkit-scrollbar {
  width: 8px; /* 滚动条的宽度 */
}

/* 滚动条的轨迹（背景） */
.messages::-webkit-scrollbar-track, .user-list::-webkit-scrollbar-track {
  border-radius: 10px;
  background: transparent; /* 设置为透明 */
}

/* 滚动条的滑块样式 */
.messages::-webkit-scrollbar-thumb, .user-list::-webkit-scrollbar-thumb {
  background-color: transparent; /* 默认透明 */
  border-radius: 10px; /* 圆角 */
}

/* 当鼠标放在元素上时，显示滚动条滑块 */
.messages:hover::-webkit-scrollbar-thumb, .user-list:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2); /* 微信的滚动条颜色 */
}

/* Firefox浏览器的滚动条样式 */
.messages, .user-list {
  scrollbar-width: thin; /* Firefox支持的滚动条宽度属性 */
  scrollbar-color: transparent transparent; /* 默认透明 */
}

.messages:hover, .user-list:hover {
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent; /* 鼠标悬停时，滑块变色 */
}

.wechat-container,
.chat-container {
    height: 100%;
}

.user-list {
    width: 100%; /* 默认为100%适应手机屏幕 */
    overflow-y: scroll;
}

.chat-container {
    flex-direction: column-reverse; /* 将消息记录放在底部 */
}

.header,
.input-container {
    padding: 10px; /* 调整内边距使其更适应手机屏幕 */
}

.chat-input {
    width: 80%; /* 调整宽度为80%，使发送按钮有足够的空间 */
}

.send-button {
    width: 20%;
    text-align: center;
}

/* 当屏幕宽度大于768px时，适应桌面或平板 */
@media (min-width: 768px) {
    .user-list {
        width: 30%; /* 调整宽度为30% */
    }

    .chat-container {
        flex-direction: column;
    }

    .chat-input {
        width: 90%;
    }

    .send-button {
        width: 10%;
    }
}

</style>
