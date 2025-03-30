<template>
  <div class="banner">
    <div class="banner-inner">
      <div class="carousel-item">
        <!-- <div class="carousel-title">{{ t('login.banner.slogan1') }}</div>
        <div class="carousel-sub-title">{{ t('login.banner.subSlogan1') }}</div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
</script>

<style lang="less" scoped>
  .banner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background: linear-gradient(163.85deg, rgba(29, 33, 41, 0.95) 0%, rgba(0, 48, 143, 0.95) 100%);
    background: url('@/assets/images/login-banner.png') center/cover no-repeat;
    // background: white;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('@/assets/images/login-banner.png') center/cover no-repeat;
      opacity: 0.1;
      z-index: 0;
    }

    &-inner {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .carousel {
    width: 100%;
    height: 100%;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0 20px;
    }

    &-title {
      color: rgba(255, 255, 255, 0.95);
      font-weight: 600;
      font-size: 36px;
      line-height: 48px;
      text-align: center;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    &-sub-title {
      margin-top: 24px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 20px;
      line-height: 32px;
      text-align: center;
      max-width: 560px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
</style>
