<template>
  <div class="reservation-container">
    <div class="content-layout">
      <!-- 左侧日历区域 -->
      <div class="left-side">
        <a-card class="calendar-view" title="设备空闲时间">
          <a-calendar />
        </a-card>
      </div>

      <!-- 右侧表单和列表区域 -->
      <div class="right-side">
        <a-card class="reservation-form" title="设备预约登记">
          <a-form :model="form" @submit="handleSubmit">
            <a-form-item field="equipmentTypes" label="设备种类" validate-trigger="change" required>
              <a-select
                v-model="form.equipmentTypes"
                placeholder="请选择设备"
                multiple
                allow-clear
              >
                <a-option v-for="item in equipmentOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-option>
              </a-select>
            </a-form-item>

            <a-form-item field="duration" label="预计使用时长" required>
              <a-range-picker
                v-model="form.duration"
                show-time
                style="width: 100%"
                :disabled-date="disabledDate"
              />
            </a-form-item>

            <a-form-item field="name" label="姓名" required>
              <a-input v-model="form.name" placeholder="请输入姓名" :readonly="true" />
            </a-form-item>

            <a-form-item field="department" label="所属部门" required>
              <a-input v-model="form.department" placeholder="请输入所属部门" :readonly="true" />
            </a-form-item>

            <a-form-item field="contact" label="联系方式" required>
              <a-input v-model="form.contact" placeholder="请输入联系方式" :readonly="true" />
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" long>提交预约</a-button>
            </a-form-item>
          </a-form>
        </a-card>

        <a-card class="my-reservations" title="我的预约">
          <a-table :columns="columns" :data="reservations">
            <template #status="{ record }">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusText(record.status) }}
              </a-tag>
            </template>
          </a-table>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';

// 模拟用户信息
const userInfo = reactive({
  name: '周明辉',
  department: '生物医学研究所',
  contact: '13928456721'
});

// 表单数据
const form = reactive({
  equipmentTypes: [],
  duration: [],
  name: userInfo.name,
  department: userInfo.department,
  contact: userInfo.contact
});

// 设备选项
const equipmentOptions = [
  { label: '显微镜', value: 'microscope' },
  { label: '离心机', value: 'centrifuge' },
  { label: '分光光度计', value: 'spectrophotometer' },
  { label: '恒温培养箱', value: 'incubator' }
];

// 预约列表列定义
const columns = [
  { title: '设备名称', dataIndex: 'equipment' },
  { title: '预约时间', dataIndex: 'time' },
  { title: '使用时长', dataIndex: 'duration' },
  { 
    title: '状态', 
    slotName: 'status'
  }
];

// 模拟预约数据
const reservations = ref([
  {
    equipment: '扫描电子显微镜',
    time: '2025-03-28 09:00:00',
    duration: '3小时',
    status: 'pending'
  },
  {
    equipment: '激光共聚焦显微镜',
    time: '2025-03-30 14:00:00',
    duration: '2小时',
    status: 'approved'
  }
]);

// 状态颜色映射
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red'
  };
  return colorMap[status];
};

// 状态文本映射
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已驳回'
  };
  return textMap[status];
};

// 禁用过去的日期
const disabledDate = (date: Date) => {
  return date.getTime() <= Date.now() - 86400000;
};

// 提交处理
const handleSubmit = () => {
  // TODO: 实现表单提交逻辑
  Message.success('预约申请已提交');
};
</script>

<style lang="less" scoped>
.reservation-container {
  padding: 20px;
  height: 100%;
  
  .content-layout {
    display: flex;
    gap: 20px;
    height: 100%;

    .left-side {
      flex: 1;
      min-width: 300px;
      max-width: 800px;

      .calendar-view {
        height: 100%;
      }
    }

    .right-side {
      flex: 1;
      min-width: 500px;
      display: flex;
      flex-direction: column;
      gap: 20px;

      .reservation-form {
        .arco-form {
          max-width: 600px;
        }
      }

      .my-reservations {
        flex: 1;
        overflow: auto;
      }
    }
  }
}

// 响应式布局
@media screen and (max-width: 1200px) {
  .reservation-container {
    .content-layout {
      flex-direction: column;

      .left-side,
      .right-side {
        width: 100%;
        max-width: none;
      }
    }
  }
}
</style> 