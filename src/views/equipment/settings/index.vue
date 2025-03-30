<template>
  <div class="settings-container">
    <a-tabs>
      <!-- 设备信息维护 -->
      <a-tab-pane key="equipment" title="设备信息维护">
        <a-card>
          <template #title>
            <a-space>
              设备列表
              <a-button type="primary" @click="showEquipmentModal('add')">
                <template #icon><icon-plus /></template>
                新增设备
              </a-button>
            </a-space>
          </template>

          <!-- 设备分组选择 -->
          <div class="group-filter">
            <a-space>
              <span>设备分组：</span>
              <a-select
                v-model="selectedGroup"
                placeholder="请选择设备分组"
                style="width: 200px"
                allow-clear
              >
                <a-option v-for="group in equipmentGroups" :key="group.value" :value="group.value">
                  {{ group.label }}
                </a-option>
              </a-select>
              <a-button @click="showGroupModal">
                <template #icon><icon-settings /></template>
                管理分组
              </a-button>
            </a-space>
          </div>

          <!-- 设备列表表格 -->
          <a-table :columns="equipmentColumns" :data="equipmentList" :pagination="false">
            <template #operations="{ record }">
              <a-space>
                <a-button type="text" @click="showEquipmentModal('edit', record)">
                  编辑
                </a-button>
                <a-popconfirm
                  content="确定要删除该设备吗？"
                  @ok="handleDeleteEquipment(record)"
                >
                  <a-button type="text" status="danger">
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table>
        </a-card>
      </a-tab-pane>

      <!-- 管理员账号配置 -->
      <a-tab-pane key="admin" title="管理员账号配置">
        <a-card>
          <template #title>
            <a-space>
              管理员列表
              <a-button type="primary" @click="showAdminModal('add')">
                <template #icon><icon-plus /></template>
                新增管理员
              </a-button>
            </a-space>
          </template>

          <a-table :columns="adminColumns" :data="adminList" :pagination="false">
            <template #status="{ record }">
              <a-tag :color="record.status === 'active' ? 'green' : 'red'">
                {{ record.status === 'active' ? '启用' : '禁用' }}
              </a-tag>
            </template>
            <template #operations="{ record }">
              <a-space>
                <a-button type="text" @click="showAdminModal('edit', record)">
                  编辑
                </a-button>
                <a-button
                  type="text"
                  :status="record.status === 'active' ? 'danger' : 'success'"
                  @click="toggleAdminStatus(record)"
                >
                  {{ record.status === 'active' ? '禁用' : '启用' }}
                </a-button>
              </a-space>
            </template>
          </a-table>
        </a-card>
      </a-tab-pane>

      <!-- 权限分配 -->
      <a-tab-pane key="permissions" title="权限分配">
        <a-card>
          <template #title>
            角色权限配置
          </template>

          <a-row :gutter="16">
            <a-col :span="6">
              <a-card>
                <template #title>角色列表</template>
                <a-menu
                  :selected-keys="[selectedRole]"
                  @menu-item-click="handleRoleSelect"
                >
                  <a-menu-item v-for="role in roles" :key="role.value">
                    {{ role.label }}
                  </a-menu-item>
                </a-menu>
              </a-card>
            </a-col>
            <a-col :span="18">
              <a-card v-if="selectedRole">
                <template #title>权限设置</template>
                <a-tree
                  :data="permissionTree"
                  :checked-keys="checkedPermissions"
                  :selectable="false"
                  checkable
                  @check="handlePermissionCheck"
                />
              </a-card>
            </a-col>
          </a-row>
        </a-card>
      </a-tab-pane>

      <!-- 安全设置 -->
      <a-tab-pane key="security" title="安全设置">
        <a-card>
          <template #title>
            系统安全配置
          </template>

          <a-form :model="securityForm" layout="vertical">
            <!-- 卡控逻辑 -->
            <a-form-item field="cardControl" label="卡控逻辑">
              <a-radio-group v-model="securityForm.cardControl">
                <a-radio value="strict">严格模式（必须刷卡且身份匹配）</a-radio>
                <a-radio value="flexible">灵活模式（仅需刷卡验证）</a-radio>
                <a-radio value="disabled">关闭（无需刷卡）</a-radio>
              </a-radio-group>
            </a-form-item>

            <!-- 开机时间阈值 -->
            <a-form-item field="startupThreshold" label="开机时间阈值">
              <a-input-number
                v-model="securityForm.startupThreshold"
                :min="0"
                :max="60"
                style="width: 160px"
              >
                <template #append>分钟</template>
              </a-input-number>
              <div class="form-item-help">
                超过设定时间未操作，设备将自动关机
              </div>
            </a-form-item>

            <!-- 异常报警设置 -->
            <a-form-item field="alarmSettings" label="异常报警设置">
              <a-space direction="vertical">
                <a-checkbox
                  v-model="securityForm.alarmSettings.overtime"
                  >超时报警</a-checkbox
                >
                <a-checkbox
                  v-model="securityForm.alarmSettings.temperature"
                  >温度异常报警</a-checkbox
                >
                <a-checkbox
                  v-model="securityForm.alarmSettings.unauthorized"
                  >未授权使用报警</a-checkbox
                >
              </a-space>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" @click="saveSecuritySettings">
                保存设置
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>
    </a-tabs>

    <!-- 设备信息弹窗 -->
    <a-modal
      v-model:visible="equipmentModal.visible"
      :title="equipmentModal.type === 'add' ? '新增设备' : '编辑设备'"
      @ok="handleEquipmentSubmit"
    >
      <a-form :model="equipmentForm" layout="vertical">
        <a-form-item field="name" label="设备名称">
          <a-input v-model="equipmentForm.name" placeholder="请输入设备名称" />
        </a-form-item>
        <a-form-item field="group" label="所属分组">
          <a-select
            v-model="equipmentForm.group"
            placeholder="请选择设备分组"
          >
            <a-option v-for="group in equipmentGroups" :key="group.value" :value="group.value">
              {{ group.label }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="description" label="设备描述">
          <a-textarea
            v-model="equipmentForm.description"
            placeholder="请输入设备描述"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 分组管理弹窗 -->
    <a-modal
      v-model:visible="groupModal.visible"
      title="分组管理"
      @ok="handleGroupSubmit"
    >
      <div class="group-list">
        <a-space direction="vertical" fill>
          <a-card v-for="group in equipmentGroups" :key="group.value">
            <template #extra>
              <a-button
                type="text"
                status="danger"
                @click="handleDeleteGroup(group)"
              >
                删除
              </a-button>
            </template>
            {{ group.label }}
          </a-card>
        </a-space>
        <div class="add-group">
          <a-input-search
            v-model="newGroupName"
            placeholder="请输入分组名称"
            search-button
            @search="handleAddGroup"
          >
            <template #button-icon>
              <icon-plus />
            </template>
          </a-input-search>
        </div>
      </div>
    </a-modal>

    <!-- 管理员账号弹窗 -->
    <a-modal
      v-model:visible="adminModal.visible"
      :title="adminModal.type === 'add' ? '新增管理员' : '编辑管理员'"
      @ok="handleAdminSubmit"
    >
      <a-form :model="adminForm" layout="vertical">
        <a-form-item field="username" label="用户名">
          <a-input
            v-model="adminForm.username"
            placeholder="请输入用户名"
            :disabled="adminModal.type === 'edit'"
          />
        </a-form-item>
        <a-form-item
          field="password"
          label="密码"
          v-if="adminModal.type === 'add'"
        >
          <a-input-password
            v-model="adminForm.password"
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item field="name" label="姓名">
          <a-input v-model="adminForm.name" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item field="role" label="角色">
          <a-select v-model="adminForm.role" placeholder="请选择角色">
            <a-option v-for="role in roles" :key="role.value" :value="role.value">
              {{ role.label }}
            </a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import {
  IconPlus,
  IconSettings,
} from '@arco-design/web-vue/es/icon';

// 设备相关
const selectedGroup = ref('');
const equipmentGroups = ref([
  { label: '显微镜', value: 'microscope' },
  { label: '离心机', value: 'centrifuge' },
  { label: '培养箱', value: 'incubator' }
]);

const equipmentColumns = [
  { title: '设备名称', dataIndex: 'name' },
  { title: '所属分组', dataIndex: 'group' },
  { title: '状态', dataIndex: 'status' },
  { title: '操作', slotName: 'operations', width: 160 }
];

const equipmentList = ref([
  {
    id: 1,
    name: '显微镜-01',
    group: 'microscope',
    status: '正常'
  }
]);

// 管理员相关
const adminColumns = [
  { title: '用户名', dataIndex: 'username' },
  { title: '姓名', dataIndex: 'name' },
  { title: '角色', dataIndex: 'role' },
  { title: '状态', slotName: 'status' },
  { title: '操作', slotName: 'operations', width: 160 }
];

const adminList = ref([
  {
    username: 'admin',
    name: '系统管理员',
    role: 'admin',
    status: 'active'
  }
]);

// 角色和权限相关
const roles = [
  { label: '系统管理员', value: 'admin' },
  { label: '设备管理员', value: 'manager' },
  { label: '普通用户', value: 'user' }
];

const selectedRole = ref('admin');

const permissionTree = [
  {
    title: '设备管理',
    key: 'equipment',
    children: [
      { title: '设备预约', key: 'equipment.reservation' },
      { title: '预约审批', key: 'equipment.approval' },
      { title: '设备操作', key: 'equipment.operation' },
      { title: '实验记录', key: 'equipment.history' }
    ]
  },
  {
    title: '系统设置',
    key: 'settings',
    children: [
      { title: '设备维护', key: 'settings.equipment' },
      { title: '账号管理', key: 'settings.admin' },
      { title: '权限配置', key: 'settings.permissions' },
      { title: '安全设置', key: 'settings.security' }
    ]
  }
];

const checkedPermissions = ref(['equipment.reservation', 'equipment.operation']);

// 安全设置表单
const securityForm = reactive({
  cardControl: 'strict',
  startupThreshold: 30,
  alarmSettings: {
    overtime: true,
    temperature: true,
    unauthorized: true
  }
});

// 弹窗状态
const equipmentModal = reactive({
  visible: false,
  type: 'add'
});

const groupModal = reactive({
  visible: false
});

const adminModal = reactive({
  visible: false,
  type: 'add'
});

// 表单数据
const equipmentForm = reactive({
  name: '',
  group: '',
  description: ''
});

const adminForm = reactive({
  username: '',
  password: '',
  name: '',
  role: ''
});

const newGroupName = ref('');

// 设备相关方法
const showEquipmentModal = (type: 'add' | 'edit', record?: any) => {
  equipmentModal.type = type;
  equipmentModal.visible = true;
  if (type === 'edit' && record) {
    equipmentForm.name = record.name;
    equipmentForm.group = record.group;
    equipmentForm.description = record.description || '';
  } else {
    equipmentForm.name = '';
    equipmentForm.group = '';
    equipmentForm.description = '';
  }
};

const handleEquipmentSubmit = () => {
  // TODO: 实现设备添加/编辑逻辑
  Message.success('保存成功');
  equipmentModal.visible = false;
};

const handleDeleteEquipment = (record: any) => {
  // TODO: 实现设备删除逻辑
  Message.success('删除成功');
};

// 分组相关方法
const showGroupModal = () => {
  groupModal.visible = true;
};

const handleAddGroup = () => {
  if (!newGroupName.value) {
    Message.warning('请输入分组名称');
    return;
  }
  // TODO: 实现分组添加逻辑
  equipmentGroups.value.push({
    label: newGroupName.value,
    value: newGroupName.value.toLowerCase()
  });
  newGroupName.value = '';
};

const handleDeleteGroup = (group: any) => {
  // TODO: 实现分组删除逻辑
  const index = equipmentGroups.value.findIndex(g => g.value === group.value);
  if (index > -1) {
    equipmentGroups.value.splice(index, 1);
  }
};

const handleGroupSubmit = () => {
  groupModal.visible = false;
};

// 管理员相关方法
const showAdminModal = (type: 'add' | 'edit', record?: any) => {
  adminModal.type = type;
  adminModal.visible = true;
  if (type === 'edit' && record) {
    adminForm.username = record.username;
    adminForm.name = record.name;
    adminForm.role = record.role;
  } else {
    adminForm.username = '';
    adminForm.password = '';
    adminForm.name = '';
    adminForm.role = '';
  }
};

const handleAdminSubmit = () => {
  // TODO: 实现管理员添加/编辑逻辑
  Message.success('保存成功');
  adminModal.visible = false;
};

const toggleAdminStatus = (record: any) => {
  // TODO: 实现管理员状态切换逻辑
  record.status = record.status === 'active' ? 'inactive' : 'active';
  Message.success('状态更新成功');
};

// 权限相关方法
const handleRoleSelect = (key: string) => {
  selectedRole.value = key;
  // TODO: 加载对应角色的权限
};

const handlePermissionCheck = (checkedKeys: string[]) => {
  checkedPermissions.value = checkedKeys;
  // TODO: 保存权限设置
};

// 安全设置相关方法
const saveSecuritySettings = () => {
  // TODO: 实现安全设置保存逻辑
  Message.success('设置保存成功');
};
</script>

<style lang="less" scoped>
.settings-container {
  padding: 20px;

  .group-filter {
    margin-bottom: 16px;
  }

  .group-list {
    .add-group {
      margin-top: 16px;
    }
  }

  .form-item-help {
    color: var(--color-text-3);
    font-size: 12px;
    margin-top: 4px;
  }
}
</style> 