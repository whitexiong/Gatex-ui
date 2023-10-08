<template>
  <div>
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

    </div>

    <!-- 聊天窗口 -->
    <div class="chat-window">
      <!-- 在这里显示聊天内容 -->
      <div v-html="chatContent"></div>
    </div>
</template>


<script>
import {ref} from 'vue';
import SmileyIcon from "@/components/icon/SmileyIcon.vue";
import {ChatRound, Folder} from "@element-plus/icons-vue";


export default {
  components: {SmileyIcon},
  setup(_, {emit}) {
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
  //padding: 5px;
  font-size: 24px;
}
</style>
