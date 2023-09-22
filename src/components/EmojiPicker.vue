<template>
  <div>
    <!-- 工具栏 -->
    <div class="toolbar-left">
      <!-- 表情按钮 -->
      <el-popover
          v-model="showEmojiPanel"
          placement="top"
          width="300"
          trigger="click"
          style="z-index: 9999;"
      >
        <template #reference>
          <el-button class="icon-btn" @click="selectEmoji">
            <el-icon>
              <SmileyIcon/>
            </el-icon>
          </el-button>
        </template>
        <div class="emoji-grid">
          <!-- 这里列出所有的表情，你可以根据需要添加更多 -->
          <span v-for="emoji in emojis" :key="emoji" @click="() => selectEmoji(emoji)">{{ emoji }}</span>
        </div>
      </el-popover>

      <!-- 其他按钮 -->
      <el-button class="icon-btn">
        <el-icon>
          <Folder/>
        </el-icon>
      </el-button>
      <el-button class="icon-btn">
        <el-icon>
          <ChatRound/>
        </el-icon>
      </el-button>

    </div>

    <!-- 聊天窗口 -->
    <div class="chat-window">
      <!-- 在这里显示聊天内容 -->
      <div v-html="chatContent"></div>
    </div>
  </div>
</template>


<script>
import {ref} from 'vue';
import SmileyIcon from "@/components/icon/SmileyIcon.vue";
import {ChatRound, Folder} from "@element-plus/icons-vue";


export default {
  components: {SmileyIcon, Folder, ChatRound},
  setup(_, {emit}) { // 注意这里，我们使用解构来获得 emit
    const showEmojiPanel = ref(false);
    const emojis = [
      '😀', '😃', '😄', '😁', '😆', '😅',
      '😂', '🤣', '😊', '😇', '🙂', '🙃',
      '😉', '😌', '😍', '😘', '😗', '😙',
      '😚', '😋', '😜', '😝', '😛', '🤑',
      '🤗', '🤓', '😎', '🤡', '🤠', '😏',
      '😒', '😞', '😔', '😟', '😕', '🙁',
      '☹️', '😣', '😖', '😫', '😩', '😤',
      '😠', '😡', '😶', '😐', '😑', '😯',
      '😦', '😧', '😮', '😲', '😵', '🤐',
      '🤢', '🤧', '😷', '🤒', '🤕', '🤑',
      '🤠', '😸', '😺', '😻', '😼', '😽'
    ];

    const selectEmoji = (emoji) => {
      if (typeof emoji === 'string'){
        console.log(emoji)
        emit('emoji-selected', emoji);
      }
    };

    return {showEmojiPanel, emojis, selectEmoji};
  },
};
</script>


<style scoped>
.emoji-grid {
  display: flex;
  flex-wrap: wrap;
}

.emoji-grid span {
  cursor: pointer;
  padding: 5px;
  font-size: 24px;
}

.toolbar-left {
  display: flex;
  align-items: center;
}
</style>
