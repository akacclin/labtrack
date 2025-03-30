<template>
  <div class="operation-container">
    <!-- 门禁控制区域 -->
    <a-card class="access-control">
      <template #title>
        <span class="card-title">门禁控制</span>
        <a-tag :color="accessStatus.color" class="access-status">
          {{ accessStatus.text }}
        </a-tag>
      </template>
      <div class="card-content">
        <div class="card-reader">
          <icon-scan class="scan-icon" :class="{ scanning: isScanning }" />
          <div class="reader-status">{{ readerStatus }}</div>
        </div>
        <div class="access-info" v-if="currentUser">
          <a-descriptions :data="getUserInfo()" layout="inline-horizontal" />
        </div>
        <!-- 模拟刷卡输入框 - 实际项目中应对接真实刷卡设备 -->
        <a-input-search
          v-model="cardNumber"
          placeholder="请刷卡或输入卡号"
          search-button
          @search="handleCardSwipe"
        />
      </div>
    </a-card>

    <!-- 设备状态区域 -->
    <div class="equipment-grid">
      <a-card 
        v-for="device in devices" 
        :key="device.id"
        class="device-card"
        :class="getDeviceClass(device.status)"
      >
        <template #title>
          <div class="device-header">
            <span class="device-name">{{ device.name }}</span>
            <a-tag :color="getDeviceStatusColor(device.status)">
              {{ getDeviceStatusText(device.status) }}
            </a-tag>
          </div>
        </template>
        <div class="device-content">
          <div class="device-info">
            <p>设备编号：{{ device.id }}</p>
            <p>当前使用者：{{ device.currentUser || '-' }}</p>
            <p>开始时间：{{ device.startTime || '-' }}</p>
            <p>剩余时间：{{ device.remainingTime || '-' }}</p>
          </div>
          <div class="device-actions">
            <a-button
              type="primary"
              :status="device.status === 'running' ? 'danger' : 'success'"
              :disabled="!canOperateDevice(device)"
              @click="handleDeviceOperation(device)"
            >
              {{ device.status === 'running' ? '关闭设备' : '启动设备' }}
            </a-button>
          </div>
        </div>
        <!-- 超时提醒 -->
        <div class="overtime-alert" v-if="device.isOvertime">
          <a-alert type="warning" banner>
            设备使用已超时，请及时结束操作
          </a-alert>
        </div>
      </a-card>
    </div>

    <!-- 操作确认对话框 -->
    <a-modal
      v-model:visible="operationModal.visible"
      :title="operationModal.title"
      @ok="confirmOperation"
      @cancel="cancelOperation"
    >
      <p>{{ operationModal.message }}</p>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconScan } from '@arco-design/web-vue/es/icon';

// 类型定义
interface Device {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'queuing' | 'unavailable';
  currentUser?: string;
  startTime?: string;
  remainingTime?: string;
  isOvertime?: boolean;
  reservation?: {
    userId: string;
    startTime: string;
    endTime: string;
  };
}

interface User {
  id: string;
  name: string;
  department: string;
  cardNumber: string;
  validTime: {
    start: string;
    end: string;
  };
}

// 门禁状态
const isScanning = ref(false);
const cardNumber = ref('');
const currentUser = ref<User | null>(null);
const readerStatus = ref('等待刷卡...');

// 计算门禁状态
const accessStatus = computed(() => {
  if (!currentUser.value) {
    return { color: 'gray', text: '未激活' };
  }
  const now = new Date().getTime();
  const start = new Date(currentUser.value.validTime.start).getTime();
  const end = new Date(currentUser.value.validTime.end).getTime();
  
  if (now < start) {
    return { color: 'orange', text: '未到有效时间' };
  }
  if (now > end) {
    return { color: 'red', text: '已过有效时间' };
  }
  return { color: 'green', text: '门禁已激活' };
});

// 设备列表
const devices = ref<Device[]>([
  {
    id: 'DEV001',
    name: '显微镜-01',
    status: 'running',
    currentUser: '张三',
    startTime: '2024-03-30 09:00:00',
    remainingTime: '30分钟',
    isOvertime: true
  },
  {
    id: 'DEV002',
    name: '离心机-01',
    status: 'queuing',
    reservation: {
      userId: 'USER002',
      startTime: '2024-03-30 10:00:00',
      endTime: '2024-03-30 11:00:00'
    }
  },
  {
    id: 'DEV003',
    name: '分光光度计-01',
    status: 'idle'
  },
  {
    id: 'DEV004',
    name: '恒温培养箱-01',
    status: 'unavailable'
  }
]);

// 操作确认对话框状态
const operationModal = reactive({
  visible: false,
  title: '',
  message: '',
  device: null as Device | null,
  action: '' as 'start' | 'stop'
});

// 获取用户信息展示数据
const getUserInfo = () => {
  if (!currentUser.value) return [];
  return [
    { label: '姓名', value: currentUser.value.name },
    { label: '部门', value: currentUser.value.department },
    { label: '有效时间', value: `${currentUser.value.validTime.start} 至 ${currentUser.value.validTime.end}` }
  ];
};

// 处理刷卡
const handleCardSwipe = async (value: string) => {
  isScanning.value = true;
  readerStatus.value = '正在验证...';
  
  try {
    // TODO: 调用后端API验证卡号
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    
    // 模拟验证结果
    currentUser.value = {
      id: 'USER001',
      name: '张三',
      department: '研发部',
      cardNumber: value,
      validTime: {
        start: '2024-03-30 08:00:00',
        end: '2024-03-30 18:00:00'
      }
    };
    
    Message.success('验证成功');
    readerStatus.value = '验证成功';
  } catch (error) {
    Message.error('卡号验证失败');
    readerStatus.value = '验证失败';
    currentUser.value = null;
  } finally {
    isScanning.value = false;
    cardNumber.value = '';
  }
};

// 获取设备状态样式
const getDeviceClass = (status: string) => {
  return {
    'device-idle': status === 'idle',
    'device-running': status === 'running',
    'device-queuing': status === 'queuing',
    'device-unavailable': status === 'unavailable'
  };
};

// 获取设备状态颜色
const getDeviceStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    idle: 'green',
    running: 'blue',
    queuing: 'orange',
    unavailable: 'red'
  };
  return colorMap[status];
};

// 获取设备状态文本
const getDeviceStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    idle: '空闲中',
    running: '使用中',
    queuing: '排队中',
    unavailable: '不可用'
  };
  return textMap[status];
};

// 判断是否可以操作设备
const canOperateDevice = (device: Device) => {
  if (!currentUser.value || device.status === 'unavailable') {
    return false;
  }
  
  // 如果设备正在运行，只有当前使用者可以关闭
  if (device.status === 'running') {
    return device.currentUser === currentUser.value.name;
  }
  
  // 检查是否在预约时间段内
  if (device.reservation) {
    const now = new Date().getTime();
    const start = new Date(device.reservation.startTime).getTime();
    const end = new Date(device.reservation.endTime).getTime();
    return now >= start && now <= end && device.reservation.userId === currentUser.value.id;
  }
  
  return device.status === 'idle';
};

// 处理设备操作
const handleDeviceOperation = (device: Device) => {
  operationModal.device = device;
  operationModal.action = device.status === 'running' ? 'stop' : 'start';
  operationModal.title = device.status === 'running' ? '关闭设备' : '启动设备';
  operationModal.message = `确定要${operationModal.action === 'start' ? '启动' : '关闭'}设备 ${device.name} 吗？`;
  operationModal.visible = true;
};

// 确认设备操作
const confirmOperation = async () => {
  if (!operationModal.device) return;
  
  try {
    // TODO: 调用后端API执行设备操作
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    
    // 模拟操作结果
    const device = devices.value.find(d => d.id === operationModal.device?.id);
    if (device) {
      if (operationModal.action === 'start') {
        device.status = 'running';
        device.currentUser = currentUser.value?.name;
        device.startTime = new Date().toLocaleString();
        device.remainingTime = '2小时';
      } else {
        device.status = 'idle';
        device.currentUser = undefined;
        device.startTime = undefined;
        device.remainingTime = undefined;
        device.isOvertime = false;
      }
    }
    
    Message.success(`设备${operationModal.action === 'start' ? '启动' : '关闭'}成功`);
  } catch (error) {
    Message.error(`设备${operationModal.action === 'start' ? '启动' : '关闭'}失败`);
  } finally {
    operationModal.visible = false;
  }
};

// 取消设备操作
const cancelOperation = () => {
  operationModal.visible = false;
};
</script>

<style lang="less" scoped>
.operation-container {
  padding: 20px;
  
  .access-control {
    margin-bottom: 20px;

    .card-title {
      margin-right: 12px;
    }

    .card-content {
      display: flex;
      align-items: center;
      gap: 24px;

      .card-reader {
        text-align: center;
        
        .scan-icon {
          font-size: 48px;
          color: var(--color-text-2);
          margin-bottom: 8px;

          &.scanning {
            animation: scanning 1.5s infinite;
            color: rgb(var(--arcoblue-6));
          }
        }

        .reader-status {
          color: var(--color-text-3);
        }
      }

      .access-info {
        flex: 1;
      }
    }
  }

  .equipment-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;

    .device-card {
      .device-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .device-name {
          font-weight: 500;
        }
      }

      .device-content {
        margin: 16px 0;

        .device-info {
          margin-bottom: 16px;

          p {
            margin: 8px 0;
            color: var(--color-text-2);
          }
        }

        .device-actions {
          text-align: right;
        }
      }

      .overtime-alert {
        margin-top: 16px;
      }

      &.device-running {
        border: 1px solid rgb(var(--arcoblue-6));
      }

      &.device-queuing {
        border: 1px solid rgb(var(--orange-6));
      }

      &.device-unavailable {
        border: 1px solid rgb(var(--red-6));
        opacity: 0.8;
      }
    }
  }
}

@keyframes scanning {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

// 响应式布局
@media screen and (max-width: 768px) {
  .operation-container {
    .access-control {
      .card-content {
        flex-direction: column;
        align-items: stretch;
      }
    }
  }
}
</style> 