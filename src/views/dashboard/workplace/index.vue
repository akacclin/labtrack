<template>
  <div class="container">
    <div class="left-side">
      <div class="panel">
        <Banner />
        <DataPanel />
        <ContentChart />
      </div>
      <a-grid :cols="24" :col-gap="16" :row-gap="16" style="margin-top: 16px">
        <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }">
          <a-card class="general-card" title="设备状态分布">
            <Chart height="320px" :option="pieChartOption" />
          </a-card>
        </a-grid-item>
      </a-grid>
    </div>
    <div class="right-side">
      <a-card class="general-card" title="系统公告">
        <a-list :max-height="360">
          <a-list-item v-for="notice in noticeList" :key="notice.id">
            <a-space direction="vertical" style="width: 100%">
              <a-space>
                <a-tag :color="notice.type === 'important' ? 'red' : 'blue'">
                  {{ notice.type === 'important' ? '重要' : '普通' }}
                </a-tag>
                <span class="notice-title">{{ notice.title }}</span>
              </a-space>
              <div class="notice-content">{{ notice.content }}</div>
              <div class="notice-time">{{ notice.time }}</div>
            </a-space>
          </a-list-item>
        </a-list>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useChartOption from '@/hooks/chart-option';
import Banner from './components/banner.vue';
import DataPanel from './components/data-panel.vue';
import ContentChart from './components/content-chart.vue';

const noticeList = ref([
  {
    id: 1,
    type: 'important',
    title: '系统维护通知',
    content: '系统将于2025年3月30日凌晨2:00-4:00进行例行维护，请提前做好相关安排。',
    time: '2025-03-24 10:00',
  },
  {
    id: 2,
    type: 'normal',
    title: '新设备使用培训',
    content: '新引进的激光共聚焦显微镜将于2025年3月28日下午2:00进行使用培训，请相关人员准时参加。',
    time: '2025-03-23 16:30',
  },
  {
    id: 3,
    type: 'normal',
    title: '设备预约规则更新',
    content: '为提高设备使用效率，预约规则已更新，请查看最新规则。',
    time: '2025-03-20 09:00',
  },
]);

const { chartOption: pieChartOption } = useChartOption(() => {
  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      bottom: '0',
      left: 'center',
    },
    series: [
      {
        name: '设备状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 45, name: '使用中', itemStyle: { color: '#36CBCB' } },
          { value: 68, name: '空闲', itemStyle: { color: '#1890FF' } },
          { value: 10, name: '维护中', itemStyle: { color: '#FFB800' } },
          { value: 5, name: '故障', itemStyle: { color: '#FF4D4F' } },
        ],
      },
    ],
  };
});
</script>

<script lang="ts">
export default {
  name: 'Workplace',
};
</script>

<style lang="less" scoped>
.container {
  background-color: var(--color-fill-2);
  padding: 16px 20px;
  padding-bottom: 0;
  display: flex;
}

.left-side {
  flex: 1;
  overflow: auto;
}

.right-side {
  width: 280px;
  margin-left: 16px;
}

.panel {
  background-color: var(--color-bg-2);
  border-radius: 4px;
  overflow: auto;
}

.general-card {
  border-radius: 4px;
  background-color: var(--color-bg-2);
}

.notice {
  &-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-1);
  }

  &-content {
    font-size: 13px;
    color: var(--color-text-3);
    margin: 4px 0;
  }

  &-time {
    font-size: 12px;
    color: var(--color-text-4);
  }
}

// 响应式布局
.mobile {
  .container {
    display: block;
  }
  .right-side {
    width: 100%;
    margin-left: 0;
    margin-top: 16px;
  }
}
</style>
