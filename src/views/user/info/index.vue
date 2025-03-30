<template>
  <div class="container">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card class="general-card">
          <template #title>{{ t('userCenter.title') }}</template>
          <a-descriptions :data="[
            {
              label: '姓名',
              value: userInfo.name
            },
            {
              label: '邮箱',
              value: userInfo.email
            },
            {
              label: '角色',
              value: userInfo.role
            },
            {
              label: '部门',
              value: userInfo.department
            },
            {
              label: '加入时间',
              value: userInfo.joinTime
            }
          ]" />
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card class="general-card">
          <template #title>{{ t('userCenter.deviceUsage') }}</template>
          <a-row :gutter="16" class="mb-4">
            <a-col :span="8">
              <a-statistic
                :title="t('userCenter.totalUsage')"
                :value="statistics.total"
                show-group-separator
              >
                <template #suffix>
                  <icon-up style="color: #ee4d38;" />
                  <span style="font-size: 14px; margin-left: 4px; color: #ee4d38;">12%</span>
                </template>
              </a-statistic>
            </a-col>
            <a-col :span="8">
              <a-statistic
                :title="t('userCenter.monthlyUsage')"
                :value="statistics.monthly"
                show-group-separator
              />
            </a-col>
            <a-col :span="8">
              <a-statistic
                :title="t('userCenter.weeklyUsage')"
                :value="statistics.weekly"
                show-group-separator
              />
            </a-col>
          </a-row>
        </a-card>
        <a-card class="general-card mt-4">
          <template #title>{{ t('userCenter.recentOperations') }}</template>
          <a-table :data="operationRecords" :pagination="false">
            <template #columns>
              <a-table-column
                title="操作时间"
                data-index="time"
                :render="({ record }) => formatDate(record.time)"
              />
              <a-table-column
                title="操作类型"
                data-index="type"
              />
              <a-table-column
                title="设备名称"
                data-index="device"
              />
              <a-table-column
                title="操作结果"
                data-index="result"
              />
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/store';
import { IconUp } from '@arco-design/web-vue/es/icon';
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
const userInfo = computed(() => [
  {
    label: '用户名',
    value: userStore.username,
  },
  {
    label: '所属部门',
    value: '实验室管理部',
  },
  {
    label: '联系电话',
    value: '138****1234',
  },
  {
    label: '电子邮箱',
    value: 'example@lab.com',
  },
  {
    label: '加入时间',
    value: '2024-01-01',
  },
]);

// 操作记录列定义
const operationColumns = [
  {
    title: '操作时间',
    dataIndex: 'time',
    slotName: 'time',
  },
  {
    title: '操作类型',
    dataIndex: 'type',
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
  },
  {
    title: '操作结果',
    dataIndex: 'result',
  },
];

// 模拟操作记录数据
const operationRecords = ref([
  {
    time: '2024-03-20 14:30:00',
    type: '设备预约',
    deviceName: '显微镜A',
    result: '成功',
  },
  {
    time: '2024-03-19 10:15:00',
    type: '设备使用',
    deviceName: '离心机B',
    result: '完成',
  },
  // 更多记录...
]);

// 统计数据
const statistics = ref({
  monthlyReservations: 28,
  totalHours: 156.5,
  utilizationRate: 85.6,
});

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