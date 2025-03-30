<template>
  <div class="container">
    <LoginBanner />
    <div class="content">
      <div class="top">
        <div class="header">
          <img
            alt="logo"
            src="https://oss-dicom.oss-cn-beijing.aliyuncs.com/logo.svg?OSSAccessKeyId=LTAI5tJjvX12mB8GSG9vSMB8&Expires=1000001743338635&Signature=7%2BJlpC4E2kbz6sNEyd5Pe5B11MA%3D"
          />
          <div class="title">实验室仪器设备管理系统</div>
        </div>
      </div>
      <div class="main">
        <LoginForm />
      </div>
      <div class="footer">
        <Footer />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Footer from '@/components/footer/index.vue';
  import LoginBanner from './components/banner.vue';
  import LoginForm from './components/login-form.vue';
</script>

<style lang="less" scoped>
  .container {
    position: relative;
    height: 100vh;
    overflow: hidden;
  }

  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .top {
    text-align: center;
    padding-top: 60px;
  }

  .header {
    display: inline-flex;
    align-items: center;
    padding: 0 20px;
    
    img {
      width: 48px;
      height: 48px;
      margin-right: 16px;
    }

    .title {
      color: rgba(3, 84, 150, 0.95);
      font-weight: 600;
      font-size: 24px;
      line-height: 32px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  .main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
  }

  .footer {
    width: 100%;
    padding: 20px;
    text-align: center;
    
    :deep(.footer) {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  @media (max-width: @screen-lg) {
    .banner {
      display: none;
    }
  }
</style>
