<template>
  <el-container class="wechat-container">
    <el-aside class="user-list">
      <div v-for="user in users" :key="user.id" class="user-item" @click="selectUser(user)">
        <el-avatar :src="user.avatar"></el-avatar>
        <span>{{ user.name }}</span>
      </div>
    </el-aside>
    <el-container class="chat-container">
      <el-header class="header">聊天和 {{ selectedUser.name }}</el-header>
      <el-main class="messages">
        <div v-for="(msg, index) in messages" :key="index" :class="msg.type">
          <el-avatar :src="msg.type === 'sent' ? 'https://placekitten.com/49/49' : selectedUser.avatar" class="chat-avatar"></el-avatar>
          <div class="message">{{ msg.content }}</div>
        </div>
      </el-main>
      <el-footer class="input-container">
        <el-input v-model="message" placeholder="Type a message..." class="chat-input">
          <template #prepend>
            <el-button icon="el-icon-smile"></el-button>
            <el-button icon="el-icon-picture"></el-button>
          </template>
        </el-input>
        <el-button type="primary" @click="sendMessage">Send</el-button>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      messages: [
        { content: 'Hello! How are you?', type: 'received' },
        { content: "I'm good, thanks! How about you?", type: 'sent' },
        { content: 'Doing well, thanks for asking!', type: 'received' }
      ],
      users: [
        { id: 1, name: '周静', avatar: 'https://placekitten.com/50/50' },
        { id: 2, name: '习近平', avatar: 'https://placekitten.com/49/49' }
      ],
      selectedUser: { id: 1, name: 'John Doe', avatar: 'https://placekitten.com/50/50' }
    };
  },
  methods: {
    sendMessage() {
      if (this.message.trim()) {
        this.messages.push({ content: this.message, type: 'sent' });
        this.message = '';
      }
    },
    selectUser(user) {
      this.selectedUser = user;
    }
  }
}
</script>

<style scoped>
.wechat-container {
  height: 600px;
  width: 800px;
  border: 1px solid #ccc;
}

.header {
  background-color: #00aaff;
  color: white;
  padding: 10px;
  text-align: center;
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
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  margin-bottom: 10px;
}

.sent {
  flex-direction: row-reverse;
}

.chat-avatar {
  margin: 0 10px;
}

.message {
  padding: 10px;
  border-radius: 5px;
  max-width: 70%;
}

.received .message {
  background-color: #ffffff;
}

.sent .message {
  background-color: #00aaff;
  color: white;
}

.input-container {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f5f7fa;
}

.chat-input {
  flex: 1;
  margin-right: 10px;
}
</style>
