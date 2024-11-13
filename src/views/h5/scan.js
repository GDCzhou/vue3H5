import { reactive, onMounted, onUnmounted } from 'vue';
import { Html5Qrcode } from 'html5-qrcode';
import { showToast } from 'vant';

import useVueRouter from '@/hooks/useRouter';

const { goBack } = useVueRouter();

const state = reactive({
  html5QrCode: null,
  fileList: [],
});

onMounted(() => {
  getCamerasInfo();
});
onUnmounted(() => {
  if (state.html5QrCode?.isScanning) {
    stopScan();
  }
});

const clickBack = () => {
  goBack();
};

const getCamerasInfo = () => {
  Html5Qrcode.getCameras()
    .then((devices) => {
      if (devices && devices.length) {
        state.html5QrCode = new Html5Qrcode('reader');
        startScan();
      }
    })
    .catch((err) => {
      showToast({
        message: '摄像头无访问权限！',
        duration: 2000,
      });
    });
};

const startScan = () => {
  state.html5QrCode
    .start(
      { facingMode: 'environment' },
      {
        fps: 1,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText, decodedResult) => {
        showToast(decodedText, decodedResult);
      },
    )
    .catch((err) => {
      console.log('扫码失败', err);
    });
};

const stopScan = () => {
  state.html5QrCode
    .stop()
    .then((a) => {
      console.log('已停止扫码', a);
    })
    .catch((err) => {
      console.log(err);
      showToast('停止失败');
    });
};

const uploadImg = () => {
  try {
    window.qrcode.callback = (result) => {
      showToast(result);
    };
    let file = state.fileList[0].file;
    let reader = new FileReader();
    reader.onload = (function () {
      return function (e) {
        window.qrcode.decode(e.target.result);
      };
    })(file);
    reader.readAsDataURL(file);
  } catch (error) {
    console.log(error);
    showToast({
      message: '识别失败！',
      duration: 2000,
    });
  }
};
