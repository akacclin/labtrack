<template>
  <div class="approval-container">
    <!-- 搜索和筛选区域 -->
    <a-card class="search-card">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-input-search
            v-model="searchKeyword"
            placeholder="搜索申请人/设备名称"
            @search="handleSearch"
          />
        </a-col>
        <a-col :span="4">
          <a-select
            v-model="filterStatus"
            placeholder="审批状态"
            allow-clear
            @change="handleFilterChange"
          >
            <a-option value="pending">待审核</a-option>
            <a-option value="processing">审核中</a-option>
            <a-option value="approved">已通过</a-option>
            <a-option value="rejected">已驳回</a-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select
            v-model="filterEquipment"
            placeholder="设备类型"
            allow-clear
            @change="handleFilterChange"
          >
            <a-option v-for="item in equipmentOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-range-picker
            v-model="filterDateRange"
            style="width: 100%"
            @change="handleFilterChange"
          />
        </a-col>
      </a-row>
    </a-card>

    <!-- 审核列表区域 -->
    <a-card class="list-card">
      <a-table :data="filteredReservations" :columns="columns" :pagination="pagination">
        <!-- 状态列 -->
        <template #status="{ record }">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>

        <!-- 操作列 -->
        <template #operations="{ record }">
          <a-space>
            <a-button type="text" @click="showDetail(record)">查看详情</a-button>
            <a-button
              v-if="canApprove(record)"
              type="primary"
              size="small"
              status="success"
              @click="handleApprove(record)"
            >
              通过
            </a-button>
            <a-button
              v-if="canApprove(record)"
              type="primary"
              size="small"
              status="danger"
              @click="handleReject(record)"
            >
              驳回
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!-- 详情抽屉 -->
    <a-drawer
      :visible="detailVisible"
      @cancel="closeDetail"
      @ok="closeDetail"
      title="预约详情"
      width="600px"
    >
      <template v-if="currentDetail">
        <a-descriptions :data="getDetailData(currentDetail)" />
        
        <!-- 审批进度 -->
        <div class="approval-progress">
          <div class="title">审批进度</div>
          <div class="progress-steps">
            <div v-for="(step, index) in currentDetail.approvalFlow" 
              :key="index" 
              class="step-item"
              :class="[
                getStepClass(step.status),
                { 'is-last': index === currentDetail.approvalFlow.length - 1 }
              ]"
            >
              <!-- 步骤标识 -->
              <div class="step-indicator">
                <div class="step-node">
                  <span v-if="step.status === 'approved'" class="icon-check">✓</span>
                  <span v-else-if="step.status === 'rejected'" class="icon-close">×</span>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <div class="step-line" v-if="!isLastStep(index, currentDetail.approvalFlow)"></div>
              </div>
              
              <!-- 步骤内容 -->
              <div class="step-content">
                <div class="step-title">
                  <span class="approver">{{ step.approver }}</span>
                  <span :class="['step-status', `status-${step.status}`]">
                    {{ getStepStatusText(step.status) }}
                  </span>
                </div>
                <div class="step-time" v-if="step.time">
                  {{ step.time }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 审批备注 -->
        <div class="approval-remarks">
          <div class="title">审批记录</div>
          <a-timeline>
            <a-timeline-item
              v-for="(record, index) in currentDetail.approvalRecords"
              :key="index"
              :dot-color="getTimelineColor(record.action)"
            >
              <div class="record-item">
                <span>{{ record.approver }} - {{ record.action }}</span>
                <span class="time">{{ record.time }}</span>
                <div class="remark">{{ record.remark }}</div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
      </template>
    </a-drawer>

    <!-- 审批操作对话框 -->
    <a-modal
      v-model:visible="approvalModalVisible"
      :title="approvalAction === 'approve' ? '通过审批' : '驳回申请'"
      @ok="submitApproval"
      @cancel="cancelApproval"
    >
      <a-form :model="approvalForm">
        <a-form-item label="审批备注" required>
          <a-textarea
            v-model="approvalForm.remark"
            :placeholder="approvalAction === 'approve' ? '请输入通过备注' : '请输入驳回原因'"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { Message } from '@arco-design/web-vue';

// 在 script 开始处添加类型定义
interface ApprovalStep {
  approver: string;
  status: string;
  time?: string;
}

interface ApprovalRecord {
  approver: string;
  action: string;
  time: string;
  remark: string;
}

interface ReservationDetail {
  id: string;
  applicant: string;
  equipment: string;
  reservationTime: string;
  duration: string;
  applyTime: string;
  status: string;
  department: string;
  contact: string;
  purpose: string;
  approvalFlow: ApprovalStep[];
  approvalRecords: ApprovalRecord[];
}

// 搜索和筛选状态
const searchKeyword = ref('');
const filterStatus = ref('');
const filterEquipment = ref('');
const filterDateRange = ref();

// 设备选项
const equipmentOptions = [
  { label: '显微镜', value: 'microscope' },
  { label: '离心机', value: 'centrifuge' },
  { label: '分光光度计', value: 'spectrophotometer' },
  { label: '恒温培养箱', value: 'incubator' }
];

// 表格列定义
const columns = [
  { title: '申请编号', dataIndex: 'id' },
  { title: '申请人', dataIndex: 'applicant' },
  { title: '设备名称', dataIndex: 'equipment' },
  { title: '预约时间', dataIndex: 'reservationTime' },
  { title: '使用时长', dataIndex: 'duration' },
  { title: '申请时间', dataIndex: 'applyTime' },
  { 
    title: '状态',
    slotName: 'status'
  },
  {
    title: '操作',
    slotName: 'operations',
    width: 160
  }
];

// 分页配置
const pagination = {
  total: 100,
  current: 1,
  pageSize: 10,
};

// 模拟预约数据
const reservations = ref([
  {
    id: 'RSV20250320001',
    applicant: '陈丽华',
    equipment: '扫描电子显微镜',
    reservationTime: '2025-03-28 09:00:00',
    duration: '3小时',
    applyTime: '2025-03-20 14:30:00',
    status: 'pending',
    approvalProgress: 0,
    department: '材料科学研究所',
    contact: '13812345678',
    purpose: '纳米材料表面形貌观察',
    approvalFlow: [
      { approver: '研究所主管', status: 'pending' },
      { approver: '设备管理员', status: 'pending' },
      { approver: '实验室主任', status: 'pending' }
    ],
    approvalRecords: []
  },
  {
    id: 'RSV20250320002',
    applicant: '王嘉伟',
    equipment: '超高速离心机',
    reservationTime: '2025-03-30 10:00:00',
    duration: '1.5小时',
    applyTime: '2025-03-20 15:20:00',
    status: 'processing',
    approvalProgress: 33,
    department: '生物化学实验室',
    contact: '13987654321',
    purpose: '蛋白质分离纯化',
    approvalFlow: [
      { approver: '实验室负责人', status: 'approved', time: '2025-03-21 09:15:00' },
      { approver: '设备管理员', status: 'pending' },
      { approver: '科研部主任', status: 'pending' }
    ],
    approvalRecords: [
      {
        approver: '实验室负责人',
        action: '通过',
        time: '2025-03-21 09:15:00',
        remark: '实验方案合理，设备使用申请符合规范，同意使用'
      }
    ]
  }
]);

// 计算筛选后的数据
const filteredReservations = computed(() => {
  return reservations.value.filter(item => {
    // 关键词搜索
    if (searchKeyword.value && !item.applicant.includes(searchKeyword.value) && 
        !item.equipment.includes(searchKeyword.value)) {
      return false;
    }
    // 状态筛选
    if (filterStatus.value && item.status !== filterStatus.value) {
      return false;
    }
    // 设备类型筛选
    if (filterEquipment.value && !item.equipment.includes(filterEquipment.value)) {
      return false;
    }
    // TODO: 日期范围筛选
    return true;
  });
});

// 详情抽屉状态
const detailVisible = ref(false);
const currentDetail = ref<ReservationDetail | null>(null);

// 审批对话框状态
const approvalModalVisible = ref(false);
const approvalAction = ref('approve');
const approvalForm = reactive({
  remark: ''
});

// 处理搜索
const handleSearch = (value: string) => {
  searchKeyword.value = value;
};

// 处理筛选变化
const handleFilterChange = () => {
  // TODO: 实现筛选逻辑
};

// 显示详情
const showDetail = (record: ReservationDetail) => {
  currentDetail.value = record;
  detailVisible.value = true;
};

// 关闭详情
const closeDetail = () => {
  detailVisible.value = false;
  currentDetail.value = null;
};

// 获取详情数据
const getDetailData = (detail: ReservationDetail) => {
  return [
    { label: '申请编号', value: detail.id },
    { label: '申请人', value: detail.applicant },
    { label: '所属部门', value: detail.department },
    { label: '联系方式', value: detail.contact },
    { label: '设备名称', value: detail.equipment },
    { label: '预约时间', value: detail.reservationTime },
    { label: '使用时长', value: detail.duration },
    { label: '使用目的', value: detail.purpose },
    { label: '申请时间', value: detail.applyTime }
  ];
};

// 获取审批进度
const getApprovalStep = (detail: ReservationDetail) => {
  return detail.approvalFlow.findIndex((step: ApprovalStep) => step.status === 'pending');
};

// 获取时间线颜色
const getTimelineColor = (action: string) => {
  return action === '通过' ? 'green' : 'red';
};

// 判断是否可以审批
const canApprove = (record: ReservationDetail) => {
  // TODO: 根据当前用户角色和审批流程判断是否可以审批
  return record.status === 'pending' || record.status === 'processing';
};

// 处理通过操作
const handleApprove = (record: ReservationDetail) => {
  approvalAction.value = 'approve';
  approvalModalVisible.value = true;
};

// 处理驳回操作
const handleReject = (record: ReservationDetail) => {
  approvalAction.value = 'reject';
  approvalModalVisible.value = true;
};

// 提交审批
const submitApproval = () => {
  if (!approvalForm.remark) {
    Message.warning('请输入审批备注');
    return;
  }
  // TODO: 实现审批提交逻辑
  Message.success(approvalAction.value === 'approve' ? '已通过审批' : '已驳回申请');
  approvalModalVisible.value = false;
  approvalForm.remark = '';
};

// 取消审批
const cancelApproval = () => {
  approvalModalVisible.value = false;
  approvalForm.remark = '';
};

// 状态颜色映射
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    processing: 'blue',
    approved: 'green',
    rejected: 'red'
  };
  return colorMap[status];
};

// 状态文本映射
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待审核',
    processing: '审核中',
    approved: '已通过',
    rejected: '已驳回'
  };
  return textMap[status];
};

// 获取步骤样式类
const getStepClass = (status: string) => {
  return {
    'step-approved': status === 'approved',
    'step-rejected': status === 'rejected',
    'step-pending': status === 'pending',
    'step-processing': status === 'processing'
  };
};

// 判断是否为最后一步
const isLastStep = (index: number, steps: ApprovalStep[]) => {
  return index === steps.length - 1;
};

// 获取步骤状态
const getStepStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'wait',
    processing: 'process',
    approved: 'finish',
    rejected: 'error'
  };
  return statusMap[status] || 'wait';
};

// 获取步骤状态文本
const getStepStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待审核',
    processing: '审核中',
    approved: '已通过',
    rejected: '已驳回'
  };
  return textMap[status] || '待审核';
};
</script>

<style lang="less" scoped>
.approval-container {
  padding: 20px;
  
  .search-card {
    margin-bottom: 16px;
  }

  .list-card {
    margin-bottom: 16px;
  }

  .approval-progress {
    margin: 24px 0;
    padding: 20px;
    background-color: var(--color-fill-2);
    border-radius: 8px;
    
    .title {
      margin-bottom: 24px;
      font-size: 16px;
      font-weight: 500;
      color: var(--color-text-1);
    }

    .progress-steps {
      .step-item {
        display: flex;
        position: relative;
        margin-bottom: 24px;

        &:last-child {
          margin-bottom: 0;
        }

        .step-indicator {
          position: relative;
          margin-right: 16px;
          
          .step-node {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: var(--color-fill-3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: var(--color-text-2);
            border: 2px solid var(--color-fill-4);
            z-index: 1;
          }

          .step-line {
            position: absolute;
            left: 15px;
            top: 32px;
            width: 2px;
            height: calc(100% + 8px);
            background-color: var(--color-fill-4);
          }

          .icon-check {
            color: rgb(var(--success-6));
          }

          .icon-close {
            color: rgb(var(--danger-6));
          }
        }

        .step-content {
          flex: 1;
          padding-top: 4px;

          .step-title {
            display: flex;
            align-items: center;
            margin-bottom: 4px;

            .approver {
              font-weight: 500;
              color: var(--color-text-1);
              margin-right: 12px;
            }

            .step-status {
              font-size: 13px;
              padding: 2px 8px;
              border-radius: 10px;
              
              &.status-approved {
                color: rgb(var(--success-6));
                background-color: rgb(var(--success-1));
              }
              
              &.status-rejected {
                color: rgb(var(--danger-6));
                background-color: rgb(var(--danger-1));
              }
              
              &.status-pending {
                color: rgb(var(--warning-6));
                background-color: rgb(var(--warning-1));
              }
              
              &.status-processing {
                color: rgb(var(--arcoblue-6));
                background-color: rgb(var(--arcoblue-1));
              }
            }
          }

          .step-time {
            font-size: 13px;
            color: var(--color-text-3);
          }
        }

        &.step-approved {
          .step-node {
            background-color: rgb(var(--success-1));
            border-color: rgb(var(--success-6));
            color: rgb(var(--success-6));
          }
        }

        &.step-rejected {
          .step-node {
            background-color: rgb(var(--danger-1));
            border-color: rgb(var(--danger-6));
            color: rgb(var(--danger-6));
          }
        }

        &.step-processing {
          .step-node {
            background-color: rgb(var(--arcoblue-1));
            border-color: rgb(var(--arcoblue-6));
            color: rgb(var(--arcoblue-6));
          }
        }
      }
    }
  }

  .approval-remarks {
    .title {
      margin-bottom: 16px;
      font-weight: 500;
    }

    .record-item {
      .time {
        margin-left: 8px;
        color: var(--color-text-3);
      }

      .remark {
        margin-top: 4px;
        color: var(--color-text-2);
      }
    }
  }
}
</style> 