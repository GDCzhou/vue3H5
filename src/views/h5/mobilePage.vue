<script lang="ts" setup>
  import { Html5QrcodeScanner } from 'html5-qrcode';

  defineOptions({
    name: 'MobilePage',
  });

  const loading = ref(false);
  const list = ref([]);
  const finished = ref(false);
  const show = ref(false);
  const bottomRef = ref<HTMLElement>(null);
  const showGuoHao = ref(false);

  const onLoad = () => {
    // 异步更新数据
    // setTimeout 仅做示例，真实场景中一般为 ajax 请求

    setTimeout(() => {
      for (let i = 0; i < 20; i++) {
        const item = {
          id: '00' + i,
          name: '张三',
        };
        list.value.push(item);
      }

      // 加载状态结束
      loading.value = false;

      // 数据全部加载完成
      if (list.value.length >= 40) {
        finished.value = true;
      }
    }, 1000);
  };
  const showOver = () => {
    showGuoHao.value = true;
    console.log('showOver');
  };
  const complete = () => {
    show.value = true;
    console.log('complete');
  };
  const overdue = () => {
    console.log('过号');
  };

  const scan = () => {
    console.log('scan');
  };

  // 扫描成功
  function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code matched = ${decodedText}`, decodedResult);
  }
  // 扫描失败
  function onScanFailure(error) {
    console.warn(`Code scan error = ${error}`);
  }
  // 创建并配置实例，渲染扫描仪
  let html5QrcodeScanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: { width: 250, height: 250 } }, /* verbose= */ false);
  html5QrcodeScanner.render(onScanSuccess, onScanFailure);
</script>
<template>
  <div class="container">
    <van-nav-bar class="nav-bar">
      <template #left>
        <div class="nav-left">
          <div>1590000000000</div>
          <div>鼎和大厦四楼</div>
        </div>
      </template>
      <template #right>
        <van-button type="primary" id="nav-btn" @click="scan">扫码排队 <van-icon name="scan" size="2em" color="#ffffff" /></van-button>
      </template>
    </van-nav-bar>
    <div class="list" :style="{ marginBottom: `68px` }">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="item in list" :key="item" :title="item">
          <template #title> {{ item.id }}-{{ item.name }} </template>
          <template #default>
            <div class="btn-group">
              <van-button type="warning" size="small" class="btn-complete" @click="complete">完成</van-button>
              <van-button type="warning" size="small" @click="overdue">过号</van-button>
            </div>
          </template>
        </van-cell>
      </van-list>
    </div>

    <div ref="bottomRef"><van-button type="primary" class="btn-over" size="large" @click="showOver">查看过号客户</van-button></div>
    <VanDialog v-model:show="show" title="请确认客户排队信息" show-cancel-button message-align="center">
      <div class="dialog-content">
        <div>姓名：<span>张三</span></div>
        <div>姓名：<span>张三</span></div>
        <div>姓名：<span>张三</span></div>
      </div>
    </VanDialog>

    <VanDialog v-model:show="showGuoHao" show-cancel-button message-align="center">
      <div class="showGuoHaoDialog">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-cell v-for="item in list" :key="item" :title="item">
            <template #title> {{ item.id }}-{{ item.name }} </template>
            <template #default>
              <div class="btn-group">
                <van-button type="warning" size="small" @click="reset">重排</van-button>
              </div>
            </template>
          </van-cell>
        </van-list>
      </div>
    </VanDialog>
    <div id="reader" width="600px"></div>
  </div>
</template>

<style>
  .nav-bar {
    border-bottom: 1px solid #ebedf0;
    padding-bottom: 1em;
  }
  .nav-left {
    text-align: left;
  }

  #nav-btn .van-button__content .van-button__text {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.6em;
  }
  .list {
  }
  .btn-group .btn-complete {
    margin-right: 0.5em;
  }
  .container {
    padding: 0 1em;
  }
  .btn-over {
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .dialog-content {
    margin-top: 20px;
    margin-bottom: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .showGuoHaoDialog {
    height: 80vh;
    overflow-y: scroll;
  }
</style>
