<template>
  <div class="github-mimic">

    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="代码" name="first">代码</el-tab-pane>
      <el-tab-pane label="问题" name="second">问题</el-tab-pane>
      <el-tab-pane label="拉取请求" name="third">拉取请求</el-tab-pane>
      <el-tab-pane label="操作" name="fourth">操作</el-tab-pane>
      <el-tab-pane label="项目" name="fifth">项目</el-tab-pane>
      <el-tab-pane label="维基" name="sixth">维基</el-tab-pane>
    </el-tabs>

    <!-- 项目信息和操作 -->
    <div class="project-info">
      <div>
        <h1>我的项目</h1>
        <p>项目的简要描述。</p>
      </div>
      <div class="project-actions">
        <button>点赞 120</button>
        <button>派生 45</button>
        <button>关注 300</button>
        <button>克隆或下载</button>
        <button>新建问题</button>
        <button>拉取请求</button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 贡献部分 -->

      <div class="contributions-section">
        <h2>贡献</h2>
        <p>过去一年</p>
        <div class="contribution-grid">
          <div v-for="day in 365" :key="day" class="day-box" :style="{backgroundColor: getContributionColor(day)}"></div>
        </div>
        <div class="contribution-legend">
          <div v-for="color in contributionColors" :key="color" class="legend-box" :style="{backgroundColor: color}"></div>
        </div>
      </div>

    <!-- 代码信息 -->
    <div class="code-info">
      <p>最新提交： "初始提交" 3小时前，由John Doe提交</p>
      <div>
        <select>
          <option>主分支</option>
          <option>开发分支</option>
        </select>
        <select>
          <option>v1.0</option>
          <option>v2.0</option>
        </select>
      </div>
      <div class="file-directory">文件和目录浏览占位符</div>
    </div>

    <!-- 问题和拉取请求统计 -->
    <div class="issues-stats">
      <p>未解决问题：12</p>
      <p>已关闭问题：88</p>
      <p>最近活跃拉取请求：拉取请求 #123 "修复Bug"</p>
    </div>

    <!-- 贡献者 -->
    <div class="contributors">
      <h3>主要贡献者：</h3>
      <ul>
        <li>John Doe</li>
        <li>Jane Smith</li>
      </ul>
      <a href="#">查看所有贡献者</a>
    </div>

    <!-- 许可信息 -->
    <div class="license">
      <p>许可证：MIT</p>
    </div>

    <!-- 相关项目 -->
    <div class="related-projects">
      <h3>相关项目：</h3>
      <ul>
        <li>项目A</li>
        <li>项目B</li>
      </ul>
    </div>

    <!-- README和文档 -->
    <div class="readme-docs">
      <h3>README.md</h3>
      <p>这是一个示例README内容。</p>
      <a href="#">前往文档</a>
    </div>

    <!-- 社交和健康 -->
    <div class="social-health">
      <p>评论和讨论占位符</p>
      <p>?? 120 | ?? 5</p>
      <p>CI/CD状态：已通过</p>
    </div>


    <!-- 时间线和里程碑 -->
    <div class="timeline">
      <h2>时间线和里程碑</h2>
      <div v-for="event in timelineEvents" :key="event.ID" class="timeline-item">
        <div class="event-date">{{ event.EventDate }}</div>
        <div class="event-description">
          <span v-if="event.EventType" class="event-icon">??</span>
          {{ event.Description }}
        </div>
      </div>
    </div>

    <div class="milestones">
      <div v-for="milestone in milestones" :key="milestone.ID" class="milestone-item">
        <div class="milestone-date">{{ milestone.Date }}</div>
        <div class="milestone-title">?? {{ milestone.Title }}</div>
      </div>
    </div>

  </div>
  </div>
</template>


<script>
import { ref } from 'vue';

export default {
  name: 'GithubMimic',
  setup() {
    const timelineEvents = ref([/* ...你的时间线数据 */]);
    const milestones = ref([/* ...你的里程碑数据 */]);
    const contributionColors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

    function getContributionColor(day) {
      return contributionColors[Math.floor(Math.random() * contributionColors.length)];
    }

    return {
      timelineEvents,
      milestones,
      getContributionColor,
      contributionColors
    };
  }
};
</script>

<style scoped>
.github-mimic {
  width: 100%;
  max-width: 80%;
  margin: 20px auto;
  background-color: #fff;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  padding: 40px;
}

.nav-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e1e4e8;
}

.nav-item {
  padding: 12px 15px;
  text-decoration: none;
  color: #0366d6;
  font-size: 1.1em;
}

.nav-item.active {
  border-bottom: 2px solid #0366d6;
}

.project-info, .code-info, .issues-stats, .contributors, .license, .related-projects, .readme-docs, .social-health, .timeline, .milestones {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
}

.project-actions, .contribution-legend {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.contribution-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  width: 100%;
}

.day-box, .legend-box {
  width: 15px;
  height: 15px;
  border-radius: 2px;
}

.timeline-item, .milestone-item {
  margin-bottom: 10px;
}

.event-icon {
  margin-right: 5px;
}

.main-content {
  margin-top: 30px;
}

.contributions-section {
  padding: 30px 0;
}
</style>
