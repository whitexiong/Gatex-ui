<template>
  <el-container class="wechat-container"
                :style="chatContainerStyle"
                @mousedown="startDrag"
                @mousemove="onDrag"
                @mouseup="endDrag"
  >

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

      <!-- 聊天窗口 -->
      <el-scrollbar>
        <div v-for="room in chatRooms" :key="room.ID" class="room-item"
             :class="{ selected: room.ID === selectedRoom.ID }"
             @click="selectRoom(room)">

            <div class="avatars-group">
              <img v-for="user in room.Users.slice(0, 3)" :key="user.ID" :src="user.AvatarUrl" alt="User Avatar" class="avatar-group-item"/>
            </div>
            <span>{{ room.Name }}</span>
        </div>
      </el-scrollbar>

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
      <el-header class="header draggable-handle" v-if="selectedRoom">
        {{ selectedRoom.Name }}
<!--        <span v-if="isTyping">...正在输入</span>-->
      </el-header>
      <el-scrollbar ref="messagesContainer">

        <el-main class="messages">
          <div v-for="(msg, index) in currentChatMessages" :key="index"
               :class="['message-container', msg.type]">
            <el-avatar v-if="msg.type === 'received'"
                       :src="selectedUser.avatar"
                       class="chat-avatar"></el-avatar>

            <div class="message">{{ msg.content }}</div>

            <el-avatar v-if="msg.type === 'sent'"
                       :src="'https://placekitten.com/49/49'"
                       class="chat-avatar"></el-avatar>
          </div>
        </el-main>

      </el-scrollbar>

      <el-footer class="input-container">
        <!-- 左侧的图标工具栏 -->
        <EmojiPicker @emoji-selected="addEmojiToInput" />

        <!-- 中间的输入框 -->
        <el-input
            v-model="message"
            placeholder="请输入...."
            class="chat-input"
            @keyup.enter="sendMessage"
        ></el-input>

        <!-- 右侧的发送按钮 -->
        <div class="toolbar-right">
          <div class="send-button" @click="sendMessage">发送</div>
        </div>
      </el-footer>

    </el-container>
  </el-container>
</template>

<script>
import { reactive, toRefs, onBeforeUnmount, onMounted, nextTick, ref } from "vue";
import {Search} from "@element-plus/icons-vue";
import { getChatUsers, fetchChatHistoryForUser, fetchChatWindow, createChatRoom  } from "@/services/chatService";
import EmojiPicker from '@/components/EmojiPicker.vue';
import {Plus} from '@element-plus/icons';

export default {
  computed: {
    Search() {
      return Search
    }
  },
  components: {Plus, EmojiPicker },

  setup() {

    const showModal = ref(false);
    const input1 = ref('');
    const selectedUser = ref({});
    const selectedUsers = ref([]);
    const chatRooms = ref([]);
    const currentChatMessages = ref([]);
    const messagesContainer = ref(null);

    const isDragging = ref(false);
    const startX = ref(0);
    const startY = ref(0);
    const chatContainerStyle = ref({});

    const startDrag = (e) => {
      // 检查事件的目标是否是拖动把手或其子元素
      let target = e.target;
      while (target) {
        if (target.classList.contains('draggable-handle')) {
          break; // 找到拖动把手
        }
        target = target.parentElement;
      }

      if (!target) {
        return; // 如果没有找到拖动把手，则退出
      }

      isDragging.value = true;
      startX.value = e.clientX - e.currentTarget.offsetLeft;
      startY.value = e.clientY - e.currentTarget.offsetTop;
    };


    const onDrag = (e) => {
      if (isDragging.value) {
        chatContainerStyle.value = {
          left: `${e.clientX - startX.value}px`,
          top: `${e.clientY - startY.value}px`
        };
      }
    };

    const endDrag = () => {
      isDragging.value = false;
    };

    const addEmojiToInput = (emoji) => {
      state.message += emoji; // 直接使用 state.message
    };

    const state = reactive({
      message: '',
      chatMessages: {},
      users: [],
      selectedUser: { id: null, username: '', avatar: '', chat_room_id: null },
      socket: null,
      filteredUsers: [],  // 假设这是你的用户列表
      transferData: [],   // 假设这是你的穿梭框数据
      selectedRoom: { ID: null, Name: '', Description: '', Users: [], Messages: []}
    });

    // 创建穿梭框数据
    const createTransferData = () => {
      console.log(state.users)
      state.transferData = state.users.map(user => ({
        key: user.id,
        label: user.username,
        disabled: false
      }));
    };

    const toggleModal = () => {
      showModal.value = !showModal.value;
    };

    onMounted(async () => {
      initWebSocket();
      await fetchChatUsers();
      createTransferData();
      await fetchChatWindowsByUser();
    });

    const fetchChatWindowsByUser = async () => {
      try {
        const response = await fetchChatWindow();
        if (response.data && Array.isArray(response.data)) {
          chatRooms.value = response.data
          console.log(chatRooms.value)
        }
      } catch (error) {
        console.error("Error fetching chat windows:", error);
      }
    };


    onBeforeUnmount(() => {
      if (state.socket) {
        state.socket.close();
      }
    });

    const fetchChatUsers = async () => {
      try {
        const response = await getChatUsers();
        if (response.data && Array.isArray(response.data)) {
          state.users = response.data;
        }
      } catch (error) {
        console.error("Error fetching chat users:", error);
      }
    };

    const scrollToBottom = async () => {
      await nextTick();

      setTimeout(() => {
        if (messagesContainer.value && messagesContainer.value.$el) {
          const scrollWrapper = messagesContainer.value.$el.querySelector('.el-scrollbar__wrap');
          if (scrollWrapper) {
            scrollWrapper.scrollTop = scrollWrapper.scrollHeight;
          }
        }
      }, 50); // 这里设置了200毫秒的延迟，你可以根据需要调整这个值。
    };

    const initWebSocket = () => {
      // state.socket = new WebSocket("ws://120.46.80.249:8051/ws");
      const token = localStorage.getItem('token');
      state.socket = new WebSocket(`ws://10.8.0.6:8051/ws?token=${token}`);
      // state.socket = new WebSocket(`ws://127.0.0.1:8051/ws?token=${token}`);

      state.socket.onopen = (event) => {
        console.log("WebSocket 已打开：", event);

        const userData = JSON.parse(localStorage.getItem('userData'));
        const userId = userData ? userData.id : null;

        if (userId) {
          state.socket.send(JSON.stringify({
            userId: userId
          }));
        }
      };

      function displayMessageWordByWord(content, callback) {
        let index = 0;
        let currentMessage = "";

        const interval = setInterval(() => {
          if (index >= content.length) {
            clearInterval(interval);
            callback();
            return;
          }

          currentMessage += content.charAt(index);
          index++;

          // 更新消息显示逻辑
          if (currentChatMessages.value.length && currentChatMessages.value[currentChatMessages.value.length - 1].temporary) {
            currentChatMessages.value[currentChatMessages.value.length - 1].content = currentMessage;
          } else {
            currentChatMessages.value.push({ content: currentMessage, type: 'received', temporary: true });
          }
          scrollToBottom();
        }, 50);
      }

      state.socket.onmessage = (event) => {
        console.log("Received message:", event.data);
        scrollToBottom();
        const userData = JSON.parse(localStorage.getItem('userData'));
        const userId = userData ? userData.id : null;

        try {
          const data = JSON.parse(event.data);
          console.log("Parsed message data:", data);

          if (userId === data.SenderID) {
            console.log("Message sent by the current user. Ignoring.");
            currentChatMessages.value.push({ content: data.Content, type: 'sent' });
            return;
          }

          const chatRoomId = data.ChatRoomID;
          if (!state.chatMessages[chatRoomId]) {
            state.chatMessages[chatRoomId] = [];
          }

            if (chatRoomId === state.selectedRoom.ID) {
              // 使用上面创建的函数来逐字显示消息
              displayMessageWordByWord(data.Content, () => {
                // 当所有单词都显示完毕后，删除"temporary"属性
                if (currentChatMessages.value.length) {
                  delete currentChatMessages.value[currentChatMessages.value.length - 1].temporary;
                }
              });
            }
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
      if (state.message.trim() && state.selectedRoom && state.selectedRoom.ID) {

        const userData = JSON.parse(localStorage.getItem('userData'));
        const senderId = userData ? userData.id : null;
        if (!senderId) {
          console.error("User ID not found in local storage.");
          return;
        }

        const messageBody = {
          content: state.message,
          chatRoomId: state.selectedRoom.ID,  // Use room ID from selectedRoom
          senderId: senderId
        };

        const payload = {
          chatId: state.selectedRoom.ID,  // Use room ID from selectedRoom
          body: JSON.stringify(messageBody)
        };

        state.socket.send(JSON.stringify(payload));

        if (!state.chatMessages[state.selectedRoom.ID]) {
          state.chatMessages[state.selectedRoom.ID] = [];
        }
        state.chatMessages[state.selectedRoom.ID].push({ content: state.message, type: 'sent' });

        state.message = '';
      }
    };


    const selectRoom = async (room) => {
      state.selectedRoom = room;

      await fetchChatHistoryForUser(room.ID);
      console.log(state.selectedRoom)
      const userData = JSON.parse(localStorage.getItem('userData'));
      const currentUserId = userData ? userData.id : null;

      currentChatMessages.value = state.selectedRoom.Messages.map(msg => {
        return {
          content: msg.Content,
          type: msg.SenderID === currentUserId ? 'sent' : 'received'
        };
      });

      await scrollToBottom()
    };


    const onConfirmTransfer = async () => {
      try {
        const selectedUserIds = selectedUsers.value;

        console.log("创建用户的名称:",selectedUsers)
        const chatRoomData = {
          Description: "",
          UserIDs: selectedUserIds
        };
        const response = await createChatRoom(chatRoomData);
        await fetchChatWindowsByUser();
        toggleModal();
      } catch (error) {
        console.error("Error creating chat room:", error);
      }
    };

    const getOtherUser = async (users) => {
      return users[0];
    };

    return {
      ...toRefs(state),
      currentChatMessages,
      sendMessage,
      fetchChatUsers,
      initWebSocket,
      fetchChatHistoryForUser,
      input1,
      showModal,
      toggleModal,
      onConfirmTransfer,
      selectedUser,
      selectedUsers,
      state,
      selectRoom,
      chatRooms,
      getOtherUser,
      messagesContainer,
      scrollToBottom,
      addEmojiToInput,
      startDrag,
      onDrag,
      endDrag,
      chatContainerStyle,
    };
  }
};
</script>

<style scoped>
.wechat-container {
  height: 640px;
  width: 940px;
  border: 1px solid #ccc;
  position: absolute;
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


.room-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #e4e7ed;
}

.room-item:hover {
  background-color: #e4e7ed;
}

.room-item.selected {
  background-color: #e4e7ed;
}

.room-item span {
  margin-left: 10px;
}

.chat-container {
  flex: 1;
}

.messages {
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px; /* 两边的间距 */
  border-top: 1px solid #ccc; /* 加上这行 */
}

.chat-input {
  flex: 1;
  border-radius: 20px;
  background-color: #fff;
  border: none;
  margin: 0 10px;
}

@media only screen and (max-width: 768px) {
  .wechat-container {
    width: 100%;
    height: 100%;
  }
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

.avatar, .avatar-group-item {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.avatars-group {
  display: flex;
  align-items: center;
}

.avatar-group-item {
  margin-left: -10px; /* 使头像部分重叠 */
  z-index: 1;
}

/* 使第二个和第三个头像位于第一个头像之后 */
.avatar-group-item:nth-child(2) {
  z-index: 2;
}

.avatar-group-item:nth-child(3) {
  z-index: 3;
}

/* 基础样式 */
.message-container {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.message {
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
}

/* 左侧（接收的消息） */
.message-container.received {
  justify-content: flex-start;
}

.message-container.received .message {
  background-color: #eee; /* 淡灰色背景 */
}

.message-container.sent {
  justify-content: flex-end;
}

.message-container.sent .message {
  background-color: #00bfff; /* 淡蓝色背景 */
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.chat-input {
  flex-grow: 1;
  margin: 0 10px; /* 输入框两边的间距 */
}

.send-button {
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #1E90FF; /* 按钮颜色 */
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.send-button:hover {
  background-color: #187CBD; /* 按钮悬停颜色 */
}
</style>
