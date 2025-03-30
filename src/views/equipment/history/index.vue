<template>
  <div class="history-container">
    <!-- 搜索和筛选区域 -->
    <a-card class="search-card">
      <a-form :model="searchForm" layout="inline">
        <a-form-item field="user" label="使用人">
          <a-input v-model="searchForm.user" placeholder="请输入使用人姓名" allow-clear />
        </a-form-item>
        <a-form-item field="device" label="设备">
          <a-select
            v-model="searchForm.device"
            placeholder="请选择设备"
            allow-clear
            style="width: 200px"
          >
            <a-option v-for="item in deviceOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="dateRange" label="时间范围">
          <a-range-picker
            v-model="searchForm.dateRange"
            style="width: 260px"
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <template #icon><icon-search /></template>
              搜索
            </a-button>
            <a-button @click="resetSearch">
              <template #icon><icon-refresh /></template>
              重置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 数据表格区域 -->
    <a-card class="table-card">
      <template #title>
        实验记录列表
      </template>
      <template #extra>
        <a-space>
          <a-button @click="exportData('csv')">
            <template #icon><icon-download /></template>
            导出 CSV
          </a-button>
          <a-button type="primary" @click="exportData('pdf')">
            <template #icon><icon-file /></template>
            导出 PDF
          </a-button>
        </a-space>
      </template>
      
      <a-table
        :columns="columns"
        :data="filteredRecords"
        :pagination="pagination"
        :loading="loading"
      >
        <!-- 运行时长列 -->
        <template #duration="{ record }">
          {{ formatDuration(record.startTime, record.endTime) }}
        </template>
        
        <!-- 状态列 -->
        <template #status="{ record }">
          <a-space>
            <a-tag :color="getStatusColor(record)">
              {{ getStatusText(record) }}
            </a-tag>
            <a-tag v-if="record.isOvertime" color="red">超时</a-tag>
            <a-tag v-if="record.isAbnormal" color="red">异常</a-tag>
          </a-space>
        </template>

        <!-- 操作列 -->
        <template #operations="{ record }">
          <a-button type="text" @click="showDetail(record)">
            查看详情
          </a-button>
        </template>
      </a-table>
    </a-card>

    <!-- 数据统计和可视化区域 -->
    <div class="statistics-section">
      <div class="section-title">数据统计</div>
      <div class="statistics-grid">
        <a-card class="chart-card">
          <template #title>设备使用频率</template>
          <div class="chart-container" ref="frequencyChartRef"></div>
        </a-card>
        <a-card class="chart-card">
          <template #title>设备利用率趋势</template>
          <div class="chart-container" ref="utilizationChartRef"></div>
        </a-card>
      </div>
    </div>

    <!-- 详情抽屉 -->
    <a-drawer
      :visible="detailVisible"
      :width="600"
      title="实验记录详情"
      @cancel="closeDetail"
    >
      <template v-if="currentDetail">
        <a-descriptions :data="getDetailData()" layout="horizontal" bordered />
        
        <!-- 异常记录 -->
        <div v-if="currentDetail.abnormalRecords?.length" class="abnormal-records">
          <div class="section-title">异常记录</div>
          <a-timeline>
            <a-timeline-item
              v-for="(record, index) in currentDetail.abnormalRecords"
              :key="index"
              type="error"
            >
              <div class="record-time">{{ record.time }}</div>
              <div class="record-content">{{ record.description }}</div>
            </a-timeline-item>
          </a-timeline>
        </div>

        <!-- 操作记录 -->
        <div class="operation-records">
          <div class="section-title">操作记录</div>
          <a-timeline>
            <a-timeline-item
              v-for="(record, index) in currentDetail.operationRecords"
              :key="index"
            >
              <div class="record-time">{{ record.time }}</div>
              <div class="record-content">{{ record.action }}</div>
              <div class="record-operator">操作人：{{ record.operator }}</div>
            </a-timeline-item>
          </a-timeline>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconSearch, IconRefresh, IconDownload, IconFile } from '@arco-design/web-vue/es/icon';
import * as echarts from 'echarts';

// 类型定义
interface ExperimentRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  user: string;
  startTime: string;
  endTime: string;
  status: 'normal' | 'abnormal' | 'overtime';
  isOvertime: boolean;
  isAbnormal: boolean;
  abnormalRecords?: {
    time: string;
    description: string;
  }[];
  operationRecords: {
    time: string;
    action: string;
    operator: string;
  }[];
}

// 搜索表单
const searchForm = reactive({
  user: '',
  device: '',
  dateRange: [] as string[]
});

// 设备选项
const deviceOptions = [
  { label: '显微镜-01', value: 'DEV001' },
  { label: '离心机-01', value: 'DEV002' },
  { label: '分光光度计-01', value: 'DEV003' },
  { label: '恒温培养箱-01', value: 'DEV004' }
];

// 表格列定义
const columns = [
  { title: '设备名称', dataIndex: 'deviceName' },
  { title: '使用人', dataIndex: 'user' },
  { title: '开始时间', dataIndex: 'startTime' },
  { title: '结束时间', dataIndex: 'endTime' },
  { title: '运行时长', slotName: 'duration' },
  { title: '状态', slotName: 'status' },
  { title: '操作', slotName: 'operations', width: 100 }
];

// 状态和数据
const loading = ref(false);
const records = ref<ExperimentRecord[]>([
  {
    id: 'EXP001',
    deviceId: 'DEV001',
    deviceName: '显微镜-01',
    user: '张三',
    startTime: '2024-03-30 09:00:00',
    endTime: '2024-03-30 11:30:00',
    status: 'overtime',
    isOvertime: true,
    isAbnormal: false,
    operationRecords: [
      {
        time: '2024-03-30 09:00:00',
        action: '启动设备',
        operator: '张三'
      },
      {
        time: '2024-03-30 11:30:00',
        action: '关闭设备',
        operator: '张三'
      }
    ]
  },
  {
    id: 'EXP002',
    deviceId: 'DEV002',
    deviceName: '离心机-01',
    user: '李四',
    startTime: '2024-03-30 13:00:00',
    endTime: '2024-03-30 14:00:00',
    status: 'abnormal',
    isOvertime: false,
    isAbnormal: true,
    abnormalRecords: [
      {
        time: '2024-03-30 13:45:00',
        description: '设备温度异常，自动停止运行'
      }
    ],
    operationRecords: [
      {
        time: '2024-03-30 13:00:00',
        action: '启动设备',
        operator: '李四'
      },
      {
        time: '2024-03-30 13:45:00',
        action: '设备异常停止',
        operator: 'System'
      }
    ]
  }
]);

// 分页配置
const pagination = {
  total: 100,
  current: 1,
  pageSize: 10
};

// 详情抽屉
const detailVisible = ref(false);
const currentDetail = ref<ExperimentRecord | null>(null);

// 图表引用
const frequencyChartRef = ref<HTMLElement | null>(null);
const utilizationChartRef = ref<HTMLElement | null>(null);
let frequencyChart: echarts.ECharts | null = null;
let utilizationChart: echarts.ECharts | null = null;

// 计算筛选后的记录
const filteredRecords = computed(() => {
  return records.value.filter(record => {
    if (searchForm.user && !record.user.includes(searchForm.user)) {
      return false;
    }
    if (searchForm.device && record.deviceId !== searchForm.device) {
      return false;
    }
    if (searchForm.dateRange?.length === 2) {
      const start = new Date(searchForm.dateRange[0]).getTime();
      const end = new Date(searchForm.dateRange[1]).getTime();
      const recordTime = new Date(record.startTime).getTime();
      if (recordTime < start || recordTime > end) {
        return false;
      }
    }
    return true;
  });
});

// 格式化运行时长
const formatDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const duration = end - start;
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}小时${minutes}分钟`;
};

// 获取状态颜色
const getStatusColor = (record: ExperimentRecord) => {
  if (record.isAbnormal) return 'red';
  if (record.isOvertime) return 'orange';
  return 'green';
};

// 获取状态文本
const getStatusText = (record: ExperimentRecord) => {
  if (record.isAbnormal) return '异常';
  if (record.isOvertime) return '超时';
  return '正常';
};

// 获取详情数据
const getDetailData = () => {
  if (!currentDetail.value) return [];
  return [
    { label: '实验编号', value: currentDetail.value.id },
    { label: '设备名称', value: currentDetail.value.deviceName },
    { label: '使用人', value: currentDetail.value.user },
    { label: '开始时间', value: currentDetail.value.startTime },
    { label: '结束时间', value: currentDetail.value.endTime },
    { label: '运行时长', value: formatDuration(currentDetail.value.startTime, currentDetail.value.endTime) },
    { label: '运行状态', value: getStatusText(currentDetail.value) }
  ];
};

// 处理搜索
const handleSearch = () => {
  loading.value = true;
  // TODO: 调用后端API进行搜索
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

// 重置搜索
const resetSearch = () => {
  searchForm.user = '';
  searchForm.device = '';
  searchForm.dateRange = [];
  handleSearch();
};

// 显示详情
const showDetail = (record: ExperimentRecord) => {
  currentDetail.value = record;
  detailVisible.value = true;
};

// 关闭详情
const closeDetail = () => {
  detailVisible.value = false;
  currentDetail.value = null;
};

// 导出数据
const exportData = (type: 'csv' | 'pdf') => {
  // TODO: 实现数据导出功能
  Message.success(`数据导出为 ${type.toUpperCase()} 格式`);
};

// 初始化图表
const initCharts = () => {
  // 使用频率图表
  if (frequencyChartRef.value) {
    frequencyChart = echarts.init(frequencyChartRef.value);
    frequencyChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['显微镜', '离心机', '分光光度计', '恒温培养箱']
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value',
        name: '使用次数'
      },
      series: [
        {
          name: '显微镜',
          type: 'bar',
          data: [10, 8, 12, 9, 11, 5, 3]
        },
        {
          name: '离心机',
          type: 'bar',
          data: [5, 7, 6, 8, 9, 4, 2]
        }
      ]
    });
  }

  // 利用率趋势图表
  if (utilizationChartRef.value) {
    utilizationChart = echarts.init(utilizationChartRef.value);
    utilizationChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['平均利用率']
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        type: 'value',
        name: '利用率',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: '平均利用率',
          type: 'line',
          data: [65, 70, 75, 82, 78, 85]
        }
      ]
    });
  }
};

// 监听窗口大小变化
const handleResize = () => {
  frequencyChart?.resize();
  utilizationChart?.resize();
};

onMounted(() => {
  nextTick(() => {
    initCharts();
    window.addEventListener('resize', handleResize);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  frequencyChart?.dispose();
  utilizationChart?.dispose();
});
</script>

<style lang="less" scoped>
.history-container {
  padding: 20px;

  .search-card {
    margin-bottom: 16px;
  }

  .table-card {
    margin-bottom: 24px;
  }

  .statistics-section {
    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: var(--color-text-1);
      margin-bottom: 16px;
    }

    .statistics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

      .chart-card {
        .chart-container {
          height: 300px;
        }
      }
    }
  }

  .abnormal-records,
  .operation-records {
    margin-top: 24px;

    .section-title {
      margin-bottom: 16px;
      font-weight: 500;
      color: var(--color-text-1);
    }

    .record-time {
      color: var(--color-text-3);
      font-size: 13px;
    }

    .record-content {
      margin: 4px 0;
      color: var(--color-text-1);
    }

    .record-operator {
      color: var(--color-text-3);
      font-size: 13px;
    }
  }
}

// 响应式布局
@media screen and (max-width: 768px) {
  .history-container {
    .statistics-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style> 