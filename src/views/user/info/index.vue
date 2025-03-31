<template>
  <div class="container">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card class="general-card">
          <template #title>{{ t('userCenter.title') }}</template>
          <div class="user-info">
            <div class="user-profile">
              <div class="avatar-wrapper">
                <a-avatar :size="80">
                  <img :src="userInfo.avatar" alt="avatar"/>
                </a-avatar>
                <div class="user-name">{{ userInfo.name }}</div>
                <div class="user-role">{{ getRoleName(userInfo.role) }}</div>
              </div>
            </div>
            <a-descriptions :data="userInfoData" layout="inline-vertical" bordered/>
          </div>
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card class="general-card">
          <template #title>{{ t('userCenter.deviceUsage') }}</template>
          <a-row :gutter="16" class="mb-4">
            <a-col :span="8">
              <a-statistic
                :title="t('userCenter.totalUsage')"
                :value="statistics.totalHours"
                show-group-separator
              >
                <template #suffix>小时</template>
              </a-statistic>
            </a-col>
            <a-col :span="8">
              <a-statistic
                :title="t('userCenter.monthlyUsage')"
                :value="statistics.monthlyReservations"
                show-group-separator
              >
                <template #suffix>次</template>
              </a-statistic>
            </a-col>
            <a-col :span="8">
              <a-statistic
                :title="t('userCenter.weeklyUsage')"
                :value="statistics.utilizationRate"
                :precision="1"
                show-group-separator
              >
                <template #suffix>%</template>
              </a-statistic>
            </a-col>
          </a-row>
          <a-divider/>
          <a-typography-title :heading="6">{{ t('userCenter.usageTrend') }}</a-typography-title>
          <div style="height: 300px">
            <a-chart :option="chartOption"/>
          </div>
        </a-card>
        <a-card class="general-card mt-4">
          <template #title>{{ t('userCenter.recentOperations') }}</template>
          <a-table :data="operationRecords" :pagination="false">
            <template #columns>
              <a-table-column
                :title="t('userCenter.operation.time')"
                data-index="time"
                :render="({ record }) => formatDate(record.time)"
              />
              <a-table-column
                :title="t('userCenter.operation.type')"
                data-index="type"
              />
              <a-table-column
                :title="t('userCenter.operation.device')"
                data-index="deviceName"
              />
              <a-table-column
                :title="t('userCenter.operation.result')"
                data-index="result"
                :render="({ record }) => {
                  const color = record.result === t('userCenter.operation.status.success') ? 'green' : 
                               record.result === t('userCenter.operation.status.failed') ? 'red' : 'blue';
                  return h(Tag, { color }, () => record.result);
                }"
              />
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, h } from 'vue';
import { useUserStore } from '@/store';
import { Tag } from '@arco-design/web-vue';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const userStore = useUserStore();

// 角色名称映射
const getRoleName = (role: string) => {
  const roleMap: Record<string, string> = {
    admin: '系统管理员',
    manager: '设备管理员',
    user: '普通用户',
  };
  return roleMap[role] || role;
};

// 用户基本信息
const userInfo = computed(() => ({
  name: userStore.name || '陈明',
  role: userStore.role || 'user',
  avatar: userStore.avatar || '//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image',
  department: '实验室管理部',
  email: 'chenming@example.com',
  phone: '138****1234',
  joinTime: '2025-01-01',
}));

// 用户信息描述列表数据
const userInfoData = computed(() => [
  {
    label: t('userCenter.basicInfo.department'),
    value: userInfo.value.department
  },
  {
    label: t('userCenter.basicInfo.phone'),
    value: userInfo.value.phone
  },
  {
    label: t('userCenter.basicInfo.email'),
    value: userInfo.value.email
  },
  {
    label: t('userCenter.basicInfo.joinTime'),
    value: userInfo.value.joinTime
  }
]);

// 统计数据
const statistics = ref({
  totalHours: 156.5,
  monthlyReservations: 28,
  utilizationRate: 85.6
});

// 图表配置
const chartOption = {
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value',
    name: '使用时长(小时)'
  },
  series: [
    {
      data: [8, 6, 9, 7, 8.5, 4, 3],
      type: 'line',
      smooth: true
    }
  ]
};

// 操作记录数据
const operationRecords = ref([
  {
    time: '2025-03-20 14:30:00',
    type: '设备预约',
    deviceName: '显微镜A',
    result: t('userCenter.operation.status.success')
  },
  {
    time: '2025-03-19 10:15:00',
    type: '设备使用',
    deviceName: '离心机B',
    result: t('userCenter.operation.status.completed')
  },
  {
    time: '2025-03-18 16:45:00',
    type: '设备预约',
    deviceName: '分光光度计C',
    result: t('userCenter.operation.status.pending')
  },
  {
    time: '2025-03-17 09:30:00',
    type: '设备使用',
    deviceName: '显微镜A',
    result: t('userCenter.operation.status.failed')
  },
  {
    time: '2025-03-16 13:20:00',
    type: '设备预约',
    deviceName: '离心机B',
    result: t('userCenter.operation.status.success')
  }
]);

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};
</script>

<style lang="less" scoped>
.container {
  padding: 20px;
}

.general-card {
  border-radius: 4px;
}

.mt-4 {
  margin-top: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}

.user-info {
  padding: 20px;

  .user-profile {
    .avatar-wrapper {
      text-align: center;
      margin-bottom: 24px;

      .user-name {
        margin-top: 12px;
        font-size: 20px;
        font-weight: 500;
        color: var(--color-text-1);
      }

      .user-role {
        margin-top: 4px;
        font-size: 14px;
        color: var(--color-text-3);
      }
    }
  }
}
</style> 