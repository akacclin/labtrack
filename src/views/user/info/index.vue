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
                  <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="avatar"/>
                  <icon-user v-else />
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
          <div style="height: 300px" class="chart-container">
            <div class="chart-placeholder">
              <p>图表加载中...</p>
            </div>
          </div>
        </a-card>
        <a-card class="general-card mt-4">
          <template #title>{{ t('userCenter.recentOperations') }}</template>
          <a-table :data="operationRecords" :pagination="false">
            <template #columns>
              <a-table-column
                :title="t('userCenter.operation.time')"
                data-index="time"
              >
                <template #cell="{ record }">
                  {{ formatDate(record.time) }}
                </template>
              </a-table-column>
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
              >
                <template #cell="{ record }">
                  <a-tag :color="record.result === t('userCenter.operation.status.success') ? 'green' : 
                       record.result === t('userCenter.operation.status.failed') ? 'red' : 'blue'">
                    {{ record.result }}
                  </a-tag>
                </template>
              </a-table-column>
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
import avatarImg from '@/assets/avatar.png';
import { IconUser } from '@arco-design/web-vue/es/icon';

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
const userInfo = computed(() => {
  // Check if userStore.avatar exists and if it's using the old path pattern
  let avatarSrc = userStore.avatar;
  if (!avatarSrc || avatarSrc.includes('/src/assets/avatar.png')) {
    avatarSrc = avatarImg;
  }
  
  return {
    name: userStore.name || '周明辉',
    role: userStore.role || 'user',
    avatar: avatarSrc,
    department: '生物医学研究所',
    email: 'zhouminghui@example.com',
    phone: '139****5678',
    joinTime: '2025-01-01',
  };
});

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
    time: '2025-03-28 14:30:00',
    type: '设备预约',
    deviceName: '扫描电子显微镜-01',
    result: t('userCenter.operation.status.success')
  },
  {
    time: '2025-03-27 10:15:00',
    type: '设备使用',
    deviceName: '超高速离心机-01',
    result: t('userCenter.operation.status.completed')
  },
  {
    time: '2025-03-26 16:45:00',
    type: '设备预约',
    deviceName: '紫外可见分光光度计-01',
    result: t('userCenter.operation.status.pending')
  },
  {
    time: '2025-03-25 09:30:00',
    type: '设备使用',
    deviceName: '扫描电子显微镜-01',
    result: t('userCenter.operation.status.failed')
  },
  {
    time: '2025-03-24 13:20:00',
    type: '设备预约',
    deviceName: '激光共聚焦显微镜-01',
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

.chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f8fa;
  border-radius: 4px;
  
  .chart-placeholder {
    text-align: center;
    color: #86909c;
  }
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