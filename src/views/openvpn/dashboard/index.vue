<template>
  <el-container>
    <el-header>
      <h1>OpenVPN 高级控制面板</h1>
    </el-header>

    <el-main>
      <!-- 概览统计部分 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card>
            <div class="big-number">420</div>
            <div>当前在线用户</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <div class="big-number">3.5 TB</div>
            <div>带宽使用</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <div class="big-number">12</div>
            <div>VPN 节点数</div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 节点连接速度和延迟图表 -->
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <el-card>
            <template v-slot:header>
              <span>节点连接速度</span>
            </template>
            <div id="node-speed" style="height: 300px;"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template v-slot:header>
              <span>节点延迟</span>
            </template>
            <div id="node-latency" style="height: 300px;"></div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <!-- 当天VPN流量的时间序列图 -->
        <el-col :span="12">
          <el-card>
            <template v-slot:header>
              <span>当天流量图</span>
            </template>
            <div id="daily-flow" style="height: 300px;"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template v-slot:header>
              <span>最受欢迎节点</span>
            </template>
            <div id="popular-nodes" style="height: 300px;"></div>
          </el-card>
        </el-col>
      </el-row>

    </el-main>
  </el-container>
</template>

<script>
import { onMounted } from 'vue';
import * as echarts from 'echarts';

export default {
  name: 'AdvancedVPNDashboard',
  setup() {
    onMounted(() => {
      initCharts();
    });

    const initCharts = () => {
//
//       // 省略其他图表初始化逻辑...
// // 节点连接速度图
      const nodeSpeed = echarts.init(document.getElementById('node-speed'));
      nodeSpeed.setOption({
        title: {
          text: 'VPN节点连接速度'
        },
        tooltip: {},
        legend: {
          data: ['速度']
        },
        xAxis: {
          data: ['节点A', '节点B', '节点C', '节点D', '节点E']
        },
        yAxis: {},
        series: [{
          name: '速度',
          type: 'bar',
          data: [5.2, 4.3, 6.1, 5.8, 4.9]
        }]
      });
//
// 节点延迟图
      const nodeLatency = echarts.init(document.getElementById('node-latency'));
      nodeLatency.setOption({
        title: {
          text: 'VPN节点延迟'
        },
        tooltip: {},
        legend: {
          data: ['延迟']
        },
        xAxis: {
          data: ['节点A', '节点B', '节点C', '节点D', '节点E']
        },
        yAxis: {},
        series: [{
          name: '延迟',
          type: 'bar',
          data: [15, 20, 12, 16, 25]
        }]
      });


// // 当天VPN流量的时间序列图初始化
      const dailyFlow = echarts.init(document.getElementById('daily-flow'));
      dailyFlow.setOption({
        title: {
          text: '当天流量图'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} GB'
          }
        },
        series: [{
          data: [10, 20, 15, 30, 40, 35, 50],
          type: 'line',
          smooth: true
        }]
      });




// // 最受欢迎VPN节点的Top 5饼图初始化
      const popularNodes = echarts.init(document.getElementById('popular-nodes'));
      popularNodes.setOption({
        title: {
          text: '最受欢迎节点'
        },
        tooltip: {},
        series: [{
          type: 'pie',
          data: [
            {name: '节点A', value: 400},
            {name: '节点B', value: 300},
            {name: '节点C', value: 200},
            {name: '节点D', value: 100},
            {name: '节点E', value: 50}
          ]
        }]
      });
    };

    return {

    };
  },
};

</script>

<style scoped>
.el-header {
  background-color: #b3c0d1;
  line-height: 60px;
  padding-left: 20px;
  color: #333;
}
.big-number {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 10px;
}
</style>
