<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <icon-computer />
        </a-avatar>
        <a-statistic
          :title="'设备总数'"
          :value="128"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">台</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <icon-calendar />
        </a-avatar>
        <a-statistic
          :title="'今日预约'"
          :value="24"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">次</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <icon-check-circle />
        </a-avatar>
        <a-statistic
          :title="'使用中设备'"
          :value="45"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">台</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
      style="border-right: none"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <icon-bar-chart />
        </a-avatar>
        <a-statistic
          :title="'设备利用率'"
          :value="85.6"
          :precision="1"
          :value-from="0"
          animation
        >
          <template #suffix> % <icon-caret-up class="up-icon" /> </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item :span="24">
      <a-divider class="panel-border" />
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
import { IconComputer, IconCalendar, IconCheckCircle, IconBarChart } from '@arco-design/web-vue/es/icon';
</script>

<style lang="less" scoped>
  .arco-grid.panel {
    margin-bottom: 0;
    padding: 16px 20px 0 20px;
  }
  .panel-col {
    padding-left: 43px;
    border-right: 1px solid rgb(var(--gray-2));
  }
  .col-avatar {
    margin-right: 12px;
    background-color: var(--color-fill-2);
  }
  .up-icon {
    color: rgb(var(--green-6));
  }
  .unit {
    margin-left: 8px;
    color: rgb(var(--gray-8));
    font-size: 12px;
  }
  :deep(.panel-border) {
    margin: 4px 0 0 0;
  }
</style>
