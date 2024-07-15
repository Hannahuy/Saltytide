<template>
  <div>
    <div class="top-leftbox">
      <div class="top-leftbox-top" :class="{ active: activeTab === 'top' }" @click="toggleBox('top')">
        <img :src="activeTab === 'top'
          ? littleBluetop
          : bigBluetop
          " alt="" class="top-leftbox-img" />
        <span class="top-span">表层渲染</span>
      </div>
      <div class="top-leftbox-middle" :class="{ active: activeTab === 'middle' }" @click="toggleBox('middle')">
        <img :src="activeTab === 'middle'
          ? littleBluemiddle
          : bigBluemiddle
          " alt="" class="top-leftbox-img2" />
        <span class="top-span">断面分析</span>
      </div>
      <div class="top-leftbox-bottom" :class="{ active: activeTab === 'bottom' }" @click="toggleBox('bottom')">
        <img :src="activeTab === 'bottom'
          ? littleBluebottom
          : bigBluebottom
          " alt="" class="top-leftbox-img3" />
        <span>体渲染</span>
      </div>
      <div class="top-leftbox-middle-content" v-show="showtransversals">
        <span>断面选择</span>
        <div class="top-leftbox-middle-content-div">
          <el-select v-model="transversalsvalue" placeholder="请选择断面" style="width: 160px" @change="getselect"
            popper-class="blueBack">
            <el-option v-for="item in transversalsoptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <div style="
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 20px;
            ">
            <el-button type="primary" class="topbutton" @click="anewtop">重新绘制</el-button>
            <el-button type="primary" class="topbutton" @click="finishtop">完成</el-button>
          </div>
        </div>
      </div>
      <div class="top-leftbox-middle-content-2" v-show="showVolumerendering">
        <span class="top-leftbox-middle-content-2-span">体渲染剖切</span>
        <div class="top-leftbox-middle-content-div-2">
          <div class="top-leftbox-middle-content-div-2-content">
            <div class="color-bar-one">
              <a-slider v-model:value="Zaxis" vertical :reverse="true" @change="getZaxis" :min="0" :max="39" :step="1"
                tooltipPlacement="top" />
            </div>
            <span class="top-leftbox-middle-content-div-2-span">多层剖切</span>
          </div>
          <div class="top-leftbox-middle-content-div-2-content">
            <div class="color-bar-two">
              <a-slider v-model:value="threshold" vertical :reverse="true" @change="getthreshold" :min="0" :max="41.5"
                :step="0.01" tooltipPlacement="top" />
            </div>
            <span class="top-leftbox-middle-content-div-2-span">特征阈值</span>
          </div>
        </div>
      </div>
    </div>
    <div v-show="showbar" class="sidebar">
      <div class="bar">
        <div class="color-bar-number">
          <span>18(mg/L)</span>
          <span>9(mg/L)</span>
          <span>0(mg/L)</span>
        </div>
        <div class="color-bar"></div>
      </div>
    </div>
    <div class="sidebar" v-show="shownextbar">
      <div class="nextbar">
        <div class="color-nextbar-number">
          <span>41.5(mg/L)</span>
          <span>20(mg/L)</span>
          <span>0(mg/L)</span>
        </div>
        <div class="color-nextbar"></div>
      </div>
    </div>
    <div class="bottomCalendar">
      <el-date-picker v-model="timePick" type="date" :disabled-date="disabledDate" :editable="false" />
    </div>
    <div class="bottombox-button">
      <el-button type="primary" class="bottombox-Backoff" :disabled="isDisabled" @click="Backoff"></el-button>
      <el-button type="primary" class="bottombox-play" :class="{ active: activePlay === 'play' }"
        @click="togglePlay"></el-button>
      <el-button type="primary" class="bottombox-Fastforward" :disabled="isDisabled" @click="Fastforward"></el-button>
    </div>
    <div class="bottombox">
      <div class="bottombox-slider">
        <div :style="style">
          <span class="bottombox-slider-span">{{ formattedTime }}</span>
        </div>
        <el-slider :step="30" v-model="timePlay" :show-tooltip="false" :min="min" :max="max"
          style="position: relative; z-index: 1; width: 1600px" @change="gettimePlay">
        </el-slider>
      </div>
      <div class="bottombox-timespan">
        <span>{{ formattedMinTime }}</span>
        <span>{{ formattedMinTimeAdd1Day }}</span>
        <span>{{ formattedMinTimeAdd2Days }}</span>
        <span>{{ formattedMinTimeAdd3Days }}</span>
        <span>{{ formattedMinTimeAdd4Days }}</span>
        <span>{{ formattedMaxTime }}</span>
      </div>
    </div>
    <div style="position: absolute; top: 50%; left: 57%; transform: translate(-50%, -50%)">
      <div class="leftbox-middles" v-show="showEcharts">
        <div class="leftbox-top-title">
          <span>{{ firstSpanText }}</span>
          <span>{{ secondSpanText }}</span>
          <img class="closeimg" src="../../assets/image/close.png" alt="" @click="closeEcharts" />
        </div>
        <div id="transversalsEcharts">
          <img :src="transversalsEchartsimg" alt="" class="transversalsEchartsimg" />
        </div>
      </div>
    </div>
    <div style="position: absolute; top: 45%; left: 1%;">
      <div class="leftbox-middle" v-show="showsalinityEcharts">
        <div class="leftbox-top-titles">
          <span>表层盐度</span>
          <span>Surface salinity</span>
          <img class="closeimgs" src="../../assets/image/close.png" alt="" @click="closesalinityEcharts" />
        </div>
        <div id="salinityEcharts"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import dayjs from "dayjs";
import * as echarts from "echarts";
import axios from "axios";
import { callUIInteraction, addResponseEventListener, } from "../../module/webrtcVideo/webrtcVideo.js";
import { ElMessage } from 'element-plus'
import littleBluetop from '../../assets/image/表层渲染-浅蓝.png'
import bigBluetop from '../../assets/image/表层渲染-深蓝.png'
import littleBluemiddle from '../../assets/image/断面分析-浅蓝.png'
import bigBluemiddle from '../../assets/image/断面分析-深蓝.png'
import littleBluebottom from '../../assets/image/体渲染-浅蓝.png'
import bigBluebottom from '../../assets/image/体渲染-深蓝.png'
import imageindexone from '../../assets/dataImg/1aa4dcbb0bdeecd96083f41e35f910e.png'
import imageindextwo from '../../assets/dataImg/f11baccb8e23beb13656810a1757a87.png'
import imageindexthree from '../../assets/dataImg/89414d47203f8e5fd56cf15b9520970.png'

// const timePick = ref(new Date());
const timePick = ref(dayjs("2023-11-16").toDate());
const timePickform = ref(dayjs("2023-11-16").format('YYYY-MM-DD'));
// const timePlay = ref(dayjs().startOf('day').valueOf())
// const timePlay = ref(dayjs("2023-11-16").startOf("day").valueOf());
const timePlay = ref(dayjs("2023-11-16 10:00").valueOf()); // 默认设置为 2023-11-16 10:00

const disabledDate = (time) => {
  const year = time.getFullYear();
  const month = time.getMonth();
  const date = time.getDate();

  // 只允许选择2023年3月10日和2023年11月16日到2023年11月21日
  if (
    (year === 2023 && month === 2 && date === 10) || // 2023年3月10日
    (year === 2023 && month === 10 && date >= 16 && date <= 21) // 2023年11月16日到2023年11月21日
  ) {
    return false; // 可以选择
  } else {
    return true; // 不可选择
  }
};

const activeTab = ref("top");
const activePlay = ref("");
const showEcharts = ref(false);
const showsalinityEcharts = ref(false);
const Zaxis = ref(0);
const threshold = ref(0);
const transversalsEchartsimg = ref(imageindexone);
const transversalsvalue = ref("自定义绘制断面");
const transversalsoptions = [
  {
    value: "自定义绘制断面",
    label: "自定义绘制断面",
  },
  {
    value: "河道中心断面",
    label: "河道中心断面",
  }
];
let lastClickedTab = "";
const tabtimeName = ref('表层渲染')
const isDisabled = ref(false);
let playInterval = null;
// 左侧二级菜单
const toggleBox = (tab) => {
  if (activeTab.value === tab) {
    activeTab.value = "";
    if (tab === "top") {
      callUIInteraction({
        function: "咸潮模拟_表层渲染/false",
      });
      tabtimeName.value = ''
      console.log("咸潮模拟_表层渲染/false");
      showsalinityEcharts.value = false;
    } else if (tab === "middle") {
      callUIInteraction({
        function: "咸潮模拟_断面分析/false",
      });
      tabtimeName.value = ''
      showEcharts.value = false;
      console.log("咸潮模拟_断面分析/false");
    } else if (tab === "bottom") {
      callUIInteraction({
        function: "咸潮模拟_体渲染/false",
      });
      tabtimeName.value = ''
      console.log("咸潮模拟_体渲染/false");
    }
  } else {
    var formattedTime = dayjs(timePlay.value).format("YYYY-MM-DD HH:mm:ss");
    activeTab.value = tab;
    let tabName = "";
    if (tab === "top") {
      tabName = "表层渲染";
      tabtimeName.value = "表层渲染";
      showEcharts.value = false;
      callUIInteraction({
        function: "咸潮模拟_" + tabName + "/true",
      });
      callUIInteraction({
        function: "表层渲染/" + formattedTime,
      });
    } else if (tab === "middle") {
      tabName = "断面分析";
      tabtimeName.value = "断面分析";
      showsalinityEcharts.value = false;
      callUIInteraction({
        function: "咸潮模拟_" + tabName + "/true",
      });
      callUIInteraction({
        function: '自定义绘制断面',
      });
      callUIInteraction({
        function: `咸潮模拟自定义绘制断面选择时间轴/` + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss')
      });
    } else if (tab === "bottom") {
      tabName = "体渲染";
      tabtimeName.value = "体渲染";
      showEcharts.value = false;
      callUIInteraction({
        function: "咸潮模拟_" + tabName + "/true",
      });
      callUIInteraction({
        function: "体渲染/" + formattedTime,
      });
      showsalinityEcharts.value = false;
    }
    activePlay.value = ""; // 确保播放按钮不为play
    timePick.value = dayjs("2023-11-16").startOf("day").toDate(); // 清空日期选择器
    timePlay.value = dayjs(timePick.value).startOf("day").valueOf(); // 将时间轴从0点00开始
    if (playInterval) {
      clearInterval(playInterval); // 清除计时器
      playInterval = null;
    }
  }
  lastClickedTab = tab;
};

// 获取断面选择框内容
const getselectmenu = ref()
const getselect = (e) => {
  getselectmenu.value = e;
  callUIInteraction({
    function: e,
  });
  if (e == '自定义绘制断面') {
    callUIInteraction({
      function: '咸潮模拟自定义绘制断面选择时间轴/' + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
    });
  }
};
// 图片路径   顺序切换图片
const imagePaths = [imageindexthree, imageindextwo, imageindexone,];
let currentImagePathIndex = 0;
const updateImage = () => {
  transversalsEchartsimg.value = imagePaths[currentImagePathIndex];
};
// 倒退
let lastClickTime = 0;
let handleTime = false;
const Backoff = () => {
  handleTime = true;
  if (tabtimeName.value === '体渲染') {
    const currentTime = Date.now();
    if (currentTime - lastClickTime < 500) {
      return;
    }
    lastClickTime = currentTime;
    isDisabled.value = true;
    setTimeout(() => {
      isDisabled.value = false;
    }, 500);
  }
  const previousTime = timePlay.value;
  timePlay.value = dayjs(previousTime).subtract(1, 'hour').valueOf();
  if (tabtimeName.value === '断面分析') {
    if (getselectmenu.value === '河道中心断面') {
      callUIInteraction({
        function: `咸潮模拟河道中心断面选择时间轴/` + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
      });
    } else {
      callUIInteraction({
        function: `咸潮模拟自定义绘制断面选择时间轴/` + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
      });
    }
  } else {
    callUIInteraction({
      function: `咸潮模拟${tabtimeName.value}时间轴/` + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  transversalsEchartsimg.value = imagePaths[currentImagePathIndex];
  currentImagePathIndex = (currentImagePathIndex - 1 + imagePaths.length) % imagePaths.length;
  updateImage();
};
// 暂停/播放
let previousPlayState = "";
let intervalTime = null;
const togglePlay = () => {
  if (tabtimeName.value == '体渲染') {
    intervalTime = 20;
  } else {
    intervalTime = 16.6665;
  }
  previousPlayState = activePlay.value;
  activePlay.value = activePlay.value === "play" ? "" : "play";
  if (activePlay.value === "play") {
    playInterval = setInterval(() => {
      timePlay.value = dayjs(timePlay.value).add(1, "minute").valueOf();
      if (activePlay.value !== "play") {
        clearInterval(playInterval);
      }
    }, intervalTime);
  } else {
    clearInterval(playInterval);
  }
};
// 前进
const Fastforward = () => {
  handleTime = true;
  if (tabtimeName.value === '体渲染') {
    const currentTime = Date.now();
    if (currentTime - lastClickTime < 500) {
      return;
    }
    lastClickTime = currentTime;
    isDisabled.value = true;
    setTimeout(() => {
      isDisabled.value = false;
    }, 500);
  }
  const previousTime = timePlay.value;
  timePlay.value = dayjs(previousTime).add(1, 'hour').valueOf();
  if (tabtimeName.value === '断面分析') {
    if (getselectmenu.value === '河道中心断面') {
      callUIInteraction({
        function: `咸潮模拟河道中心断面选择时间轴/` + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
      });
    } else {
      callUIInteraction({
        function: `咸潮模拟自定义绘制断面选择时间轴/` + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
      });
    }
  } else {
    callUIInteraction({
      function: `咸潮模拟${tabtimeName.value}时间轴/` + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  transversalsEchartsimg.value = imagePaths[currentImagePathIndex];
  currentImagePathIndex = (currentImagePathIndex + 1) % imagePaths.length;
  updateImage();
};

// const min = ref(dayjs().startOf('day').valueOf());
// const max = ref(dayjs().endOf('day').valueOf());
const min = ref(dayjs(timePick.value).startOf("day").valueOf());
const max = ref(dayjs(timePick.value).add(5, 'days').endOf("day").valueOf());

const formattedTime = computed(() => {
  const time = dayjs(timePlay.value);
  if (time.isSame(dayjs(max.value))) {
    return dayjs(max.value).add(1, "day").format("YYYY/MM/DD 00:00");
  } else {
    return time.format("YYYY/MM/DD HH:mm");
  }
});

const formattedMinTime = computed(() => {
  return dayjs(min.value).format("YYYY-MM-DD");
});

const formattedMinTimeAdd1Day = computed(() => {
  return dayjs(min.value).add(1, "day").format("YYYY-MM-DD");
});

const formattedMinTimeAdd2Days = computed(() => {
  return dayjs(min.value).add(2, "days").format("YYYY-MM-DD");
});

const formattedMinTimeAdd3Days = computed(() => {
  return dayjs(min.value).add(3, "days").format("YYYY-MM-DD");
});

const formattedMinTimeAdd4Days = computed(() => {
  return dayjs(min.value).add(4, "days").format("YYYY-MM-DD");
});

const formattedMaxTime = computed(() => {
  return dayjs(max.value).format("YYYY-MM-DD");
});

const style = computed(() => {
  const length = max.value - min.value,
    progress = timePlay.value - min.value,
    left = (progress / length) * 100;
  return {
    paddingLeft: `${left}%`,
  };
});
watch(timePick, (newVal) => {
  const selectedDate = dayjs(newVal);
  if (selectedDate.isSame(dayjs("2023-11-16"), 'day')) {
    timePlay.value = dayjs("2023-11-16 10:00").valueOf(); // 设置为 2023-11-16 10:00
  } else {
    timePlay.value = selectedDate.startOf("day").valueOf(); // 设置为选择日期的 00:00
  }
  min.value = selectedDate.startOf("day").valueOf();
  max.value = selectedDate.add(5, 'days').endOf("day").valueOf(); // 保持进度条为5天的进度
  // callUIInteraction({
  //   function: `咸潮模拟${tabtimeName.value}选择时间/` + selectedDate.format("YYYY-MM-DD HH:mm:ss"),
  // });
});
watch(timePlay, (newVal) => {
  if (handleTime) {
    handleTime = false;
  } else {
    const currentTime = dayjs(newVal);
    if (currentTime.minute() === 0 && currentTime.second() === 0) {
      if (tabtimeName.value === '断面分析') {
        if (getselectmenu.value === '河道中心断面') {
          callUIInteraction({
            function: `咸潮模拟河道中心断面选择时间轴/` + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
          });
        } else {
          callUIInteraction({
            function: `咸潮模拟自定义绘制断面选择时间轴/` + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
          });
        }
      } else {
        callUIInteraction({
          function: `咸潮模拟${tabtimeName.value}时间轴/` + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
        });
      }
    }
    if (currentTime.isSame(dayjs(max.value))) {
      activePlay.value = '';
    }
  }
});
// 监听时间轴
const gettimePlay = (e) => {
  const clickedTime = dayjs(e).second(0).format("YYYY-MM-DD HH:mm:ss");
  timePlay.value = dayjs(e).second(0).valueOf(); // 确保秒数为 0
  if (activePlay.value === "play") {
    activePlay.value = "";
  }
  if (tabtimeName.value === '断面分析') {
    if (getselectmenu.value === '河道中心断面') {
      callUIInteraction({
        function: `咸潮模拟河道中心断面选择时间轴/` + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
      });
    } else {
      callUIInteraction({
        function: `咸潮模拟自定义绘制断面选择时间轴/` + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
      });
    }
  } else {
    callUIInteraction({
      function: `咸潮模拟${tabtimeName.value}时间轴/` + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  // console.log(clickedTime);
};
const firstSpanText = ref("");
const secondSpanText = ref("");
// 重新绘制
const anewtop = () => {
  if (transversalsvalue.value === "河道中心断面") {
    callUIInteraction({
      function: "河道中心断面_重新绘制",
    });
    console.log("河道");
  } else if (transversalsvalue.value === "自定义绘制断面") {
    callUIInteraction({
      function: "自定义绘制断面_重新绘制",
    });
    console.log("自定义");
  }
};
// 完成
const finishtop = () => {
  var formattedTime = dayjs(timePlay.value).format("YYYY-MM-DD HH:mm:ss");
  if (transversalsvalue.value === "河道中心断面") {
    showEcharts.value = true;
    firstSpanText.value = "河道中心断面";
    secondSpanText.value = "river center section";
    callUIInteraction({
      function:
        "河道中心断面_完成/" +
        JSON.stringify({
          time: formattedTime,
        }),
    });
  } else if (transversalsvalue.value === "自定义绘制断面") {
    callUIInteraction({
      function:
        "自定义绘制断面_完成/" +
        JSON.stringify({
          time: formattedTime,
        }),
    });
  }
};
// 关闭echarts图表
const closeEcharts = () => {
  showEcharts.value = false;
};
const closesalinityEcharts = () => {
  showsalinityEcharts.value = false;
};
// 监听多层
const getZaxis = (e) => {
  callUIInteraction({
    function: "多层剖切/" + e,
  });
  // console.log(e);
};
// 监听特征阈值
const getthreshold = (e) => {
  const e_new = 23 / 41.5 * e;
  callUIInteraction({
    function: "特征阈值/" + e_new,
  });
  console.log(e_new);
};
const showVolumerendering = computed(() => {
  return activeTab.value === "bottom";
});
const showtransversals = computed(() => {
  return activeTab.value === "middle";
});
const showbar = computed(() => {
  return activeTab.value === "top";
});
const shownextbar = computed(() => {
  return activeTab.value === "bottom" || activeTab.value === "middle" & transversalsvalue.value === '自定义绘制断面';
});
let salinitydata = null;
const salinityinit = (data) => {
  const salinityChartElement = document.getElementById("salinityEcharts");
  if (salinitydata) {
    salinitydata.dispose();
  }
  salinitydata = echarts.init(salinityChartElement);
  data = data.map(value => parseFloat(value).toFixed(2));
  const options = {
    visualMap: [
      {
        show: false,
        type: 'continuous',
        seriesIndex: 0,
        min: 0,
        max: 400
      }
    ],
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      axisLabel: {
        show: true,
        textStyle: {
          color: "#b7cffc",
          fontSize: 14,
        },
      },
    },
    yAxis: {
      name: 'mg/L', // 添加单位
      nameTextStyle: {
        color: "#b7cffc",
        fontSize: 14
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: "#b7cffc",
          fontSize: 14
        },
        formatter: function (value) {
          return (1.805 * value + 0.03).toFixed(1);
        }
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        name: '盐度值',
        data: data,
        lineStyle: { // 添加lineStyle属性
          width: 5 // 设置线条粗细为2
        }
      }
    ],
    grid: { x: 30, y: 30, x2: 5, y2: 25 },
  };
  salinitydata.setOption(options);
};
// 接收来自UE的传值
const myHandleResponseFunction = (data) => {
  const datajson = JSON.parse(data);
  console.log(datajson);
  const lonValue = datajson.Lon;
  const latValue = datajson.Lat;
  if (datajson.Type == '数据报错') {
    ElMessage({
      message: datajson.error,
      type: 'warning',
    });
  } else if (datajson.Type == '表层盐度点击查询') {
    axios.get(window.VITE_APP_BASE_API + `get_raster_value?lat=${latValue}&lon=${lonValue}`).then((res) => {
      if (res.data.success === true) {
        if (res.data.values) {
          showsalinityEcharts.value = true;
          salinityinit(res.data.values);
        } else {
          showsalinityEcharts.value = false;
        }
      }
    }).catch((err) => {
      console.error(err);
    });
  } else if (datajson.Type == '监测设备点击查询') {
    let lon, lat;
    if (datajson.DeviceName == '大涌口') {
      lon = 113.409157;
      lat = 22.210725;
    } else if (datajson.DeviceName == '灯笼') {
      lon = 113.381269;
      lat = 22.229766;
    } else if (datajson.DeviceName == '马角') {
      lon = 113.373014;
      lat = 22.252390;
    } else if (datajson.DeviceName == '联石湾') {
      lon = 113.360377;
      lat = 22.263531;
    } else if (datajson.DeviceName == '平岗泵站') {
      lon = 113.308119;
      lat = 22.331204;
    } else if (datajson.DeviceName == '广昌') {
      lon = 113.418896;
      lat = 22.195317;
    } else if (datajson.DeviceName == '挂定角') {
      lon = 113.421996;
      lat = 22.187936;
    } else if (datajson.DeviceName == '竹洲头泵站') {
      lon = 113.264171;
      lat = 22.388227;
    }
    if (lon && lat) {
      axios.get(window.VITE_APP_BASE_API + `get_raster_value?lat=${lat}&lon=${lon}`).then((res) => {
        if (res.data.success === true) {
          if (res.data.values) {
            showsalinityEcharts.value = true;
            salinityinit(res.data.values);
          } else {
            showsalinityEcharts.value = false;
          }
        }
      }).catch((err) => {
        console.error(err);
      });
    }
  }
};
onMounted(() => {
  if (dayjs(timePick.value).isSame(dayjs("2023-11-16"), 'day')) {
    timePlay.value = dayjs("2023-11-16 10:00").valueOf(); // 初始设置为 2023-11-16 10:00
  } else {
    timePlay.value = dayjs(timePick.value).startOf("day").valueOf(); // 初始设置为选择日期的 00:00
  }
  min.value = dayjs(timePick.value).startOf("day").valueOf();
  max.value = dayjs(timePick.value).add(5, 'days').endOf("day").valueOf(); // 初始设置为5天的进度
  addResponseEventListener("handle_responses", myHandleResponseFunction);
  callUIInteraction({
    function: "咸潮模拟_表层渲染/true",
  });
  callUIInteraction({
    function: '咸潮模拟表层渲染时间轴/' + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss')
  });
});
onBeforeUnmount(() => {
  if (salinitydata) {
    salinitydata.dispose();
  }
});
</script>

<style scoped>
.top-leftbox {
  width: 227px;
  height: 106px;
  position: absolute;
  left: 30px;
  top: 100px;
}

.top-leftbox-top,
.top-leftbox-middle,
.top-leftbox-bottom {
  margin-top: 20px;
  width: 250px;
  height: 70px;
  background-image: url("../../assets/image/二级按钮.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  font-size: 24px;
  font-family: YouSheBiaoTiHei;
  font-weight: 400;
  color: #d4e1ff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  letter-spacing: 5px;
}

.top-span {
  margin-left: 30px;
  box-sizing: border-box;
}

.active {
  background-image: url("../../assets/image/二级按钮-选中.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.top-leftbox-img {
  position: absolute;
  width: 65px;
  height: 65px;
  left: 3px;
  top: 20px;
}

.top-leftbox-img2 {
  position: absolute;
  width: 65px;
  height: 65px;
  left: 4px;
  top: 110px;
}

.top-leftbox-img3 {
  position: absolute;
  width: 65px;
  height: 65px;
  left: 3px;
  top: 202px;
}

.top-leftbox-middle-content {
  width: 200px;
  height: 160px;
  background-image: url("../../assets/image/弹框.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 120% 125%;
  position: absolute;
  color: #b7cffc;
  left: 280px;
  top: 55px;
}

.top-leftbox-middle-content span {
  width: 100%;
  height: 35px;
  line-height: 38px;
  padding-left: 10px;
  font-size: 20px;
  display: block;
  font-family: YouSheBiaoTiHei;
  box-sizing: border-box;
}

.top-leftbox-middle-content-div {
  height: 85px;
  padding: 20px;
}

.top-leftbox-middle-content-2 {
  width: 200px;
  height: 280px;
  background-image: url("../../assets/image/弹框.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 120% 125%;
  position: absolute;
  color: #b7cffc;
  left: 280px;
  top: 175px;
}

.top-leftbox-middle-content-2-span {
  width: 100%;
  height: 50px;
  line-height: 60px;
  padding-left: 10px;
  font-size: 20px;
  display: block;
  font-family: YouSheBiaoTiHei;
  box-sizing: border-box;
}

.top-leftbox-middle-content-div-2 {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 215px;
}

.bottomCalendar {
  position: absolute;
  bottom: 90px;
  left: 30px;
  width: 130px;
  height: 2.5rem;
  color: rgb(0, 113, 204);
  border-radius: 1.25rem;
  /* background: #fff; */
  line-height: 2.5rem;
  border: 0;
  cursor: pointer;
  padding: 0;
  font-size: 18px;
}

.bottombox {
  width: 100%;
  padding: 0 30px 0 100px;
  /* height: 50px; */
  position: absolute;
  bottom: 25px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.bottombox-button {
  position: absolute;
  bottom: 22px;
  left: 1.5%;
  display: flex;
  align-items: center;
  z-index: 1;
}

:deep(.el-input__wrapper) {
  position: absolute;
  z-index: 1000;
  width: 130px;
  height: 2.5rem;
  color: rgb(0, 113, 204);
  border-radius: 1.25rem;
  background: #fff;
  line-height: 2.5rem;
  border: 0;
  cursor: pointer;
  padding: 0;
  font-size: 18px;
}

:deep(.el-input__prefix-inner) {
  display: none !important;
}

:deep(.el-input__inner) {
  margin-right: 20px;
  color: rgb(0, 113, 204);
  cursor: pointer;
}

:deep(.el-input__suffix-inner) {
  display: none !important;
}

.bottombox-Backoff {
  background-image: url("../../assets/img/Backoff.png");
  background-repeat: no-repeat;
  background-color: #42aeff;
  background-position: center;
  border-radius: 100%;
  border: 0;
  width: 30px;
  height: 30px;
}

.bottombox-play {
  background-image: url("../../assets/img/Timeout.png");
  background-repeat: no-repeat;
  background-color: #42aeff;
  background-position: 55% 50%;
  border-radius: 100%;
  border: 0;
  width: 40px;
  height: 40px;
}

.bottombox-play.active {
  background-image: url("../../assets/img/Play.png");
  background-repeat: no-repeat;
  background-color: #42aeff;
  background-position: center;
  background-size: 70% 70%;
  border-radius: 100%;
  border: 0;
  width: 40px;
  height: 40px;
}

.bottombox-Fastforward {
  background-image: url("../../assets/img/Fastforward.png");
  background-repeat: no-repeat;
  background-color: #42aeff;
  background-position: center;
  border-radius: 100%;
  border: 0;
  width: 30px;
  height: 30px;
}

.bottombox-timespan {
  width: 1600px;
  position: absolute;
  display: flex;
  justify-content: space-between;
  color: white;
  bottom: -10px;
  font-size: 14px;
}

.bottombox-slider-span {
  width: 125px;
  background-color: #42aeff;
  border-radius: 1.25rem;
  color: white;
  display: block;
  text-align: center;
  font-size: 14px;
}

.bottombox-slider :deep(.el-slider__button) {
  background-color: transparent;
  border: 0;
}

.bottombox-slider :deep(.el-slider__bar) {
  background-color: #42aeff;
}

.topbutton {
  border-radius: 0;
  background-color: #0a6adf;
  border: 0;
}

#transversalsEcharts {
  margin-top: 10px;
  display: flex;
  align-items: center;
  width: 1110px;
  height: 520px;
  /* margin-top: 10px; */
}

.transversalsEchartsimg {
  width: 100%;
  height: 100%
}

#salinityEcharts {
  margin-top: 10px;
  width: 410px;
  height: 220px;
}

.leftbox-middle {
  width: 450px;
  height: 300px;
  background-image: url("../../assets/image/框-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;
  padding: 20px;
  box-sizing: border-box;
}

.leftbox-middles {
  width: 1150px;
  height: 600px;
  background-image: url("../../assets/image/框-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;
  padding: 20px;
  box-sizing: border-box;
}

.leftbox-top-title {
  width: 1100px;
  height: 33px;
  background-image: url("../../assets/image/title.png");
  background-repeat: no-repeat;
  background-size: 65% 100%;
  display: flex;
  align-items: center;
}

.leftbox-top-title span {
  font-family: PangMenZhengDao;
  font-size: 20px;
  color: #b7cffc;
  margin-left: 40px;
}

.leftbox-top-title span:nth-child(2) {
  font-size: 12px;
}

.leftbox-top-titles {
  width: 410px;
  height: 33px;
  background-image: url("../../assets/image/title.png");
  background-repeat: no-repeat;
  background-size: 150% 100%;
  display: flex;
  align-items: center;
}

.leftbox-top-titles span {
  font-family: PangMenZhengDao;
  font-size: 20px;
  color: #b7cffc;
  margin-left: 40px;
}

.leftbox-top-titles span:nth-child(2) {
  font-size: 12px;
}

.closeimg {
  position: absolute;
  width: 20px;
  height: 20px;
  right: 30px;
  top: 40px;
  cursor: pointer;
}

.closeimgs {
  position: absolute;
  width: 20px;
  height: 20px;
  right: 25px;
  top: 45px;
  cursor: pointer;
}

:deep(.el-select__wrapper) {
  border-radius: 0;
  background-color: #041831;
  border: 1px solid #416491;
  box-shadow: none;
}

:deep(.el-select__placeholder.is-transparent) {
  background-color: #041831;
}

:deep(.el-select__placeholder) {
  color: #b7cffc;
}

.color-bar-one {
  height: 150px;
  margin-bottom: 25px;
}

.color-bar-two {
  height: 150px;
  margin-bottom: 25px;
}

/* .color-bar-one :deep(.el-slider__runway){
  background-color: #00a8d2;

}
.color-bar-one :deep(.el-slider__bar){
  background-color: #00a8d2;
  
}
.color-bar-two :deep(.el-slider__runway){
  background: linear-gradient(180deg,
      #ff0000 0%,
      #ffdb00 20%,
      #c4ff00 40%,
      #00ff09 60%,
      #2323f5 80%,
      #7e01ff 100%);
}
.color-bar-two :deep(.el-slider__bar){
  background-color: transparent;
} */

/* .top-leftbox-middle-content-2:deep(.ant-slider-handle) {
  background-color: transparent;
  border: 0;
  background-image: url("../../assets/img/slipPoint_icon.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 20px;
  height: 20px;
  position: absolute;
  left: -4px;
} */

.top-leftbox-middle-content-div-2-content {
  width: 85px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
}

.sidebar {
  position: absolute;
  bottom: 35px;
  right: 20px;
  background-image: url("../../assets/image/框-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 95px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bar {
  display: flex;
  align-items: center;
}

.color-bar {
  width: 10px;
  height: 176px;
  background: linear-gradient(180deg, #ff0000 0%, #ffdb00 33%, #c4ff00 66%, #3aaa00 100%);
  border-radius: 9px;
}

.color-bar-number {
  height: 176px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-right: 5px;
  font-size: 12px;
}

.nextbar {
  display: flex;
  align-items: center;
}

.color-nextbar {
  width: 10px;
  height: 176px;
  background: linear-gradient(180deg,
      #ff0000 5%,
      #ff8800 20%,
      #ffdb00 35%,
      #0cd112 50%,
      #0dc1ce 70%,
      #2323f5 95%);
  border-radius: 9px;
}

.color-nextbar-number {
  height: 176px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-right: 5px;
  font-size: 12px;
}

.bottombox-play[disabled] {
  cursor: not-allowed;
  background-image: url("../../assets/img/Timeout.png");
  background-repeat: no-repeat;
  background-color: #42aeff;
  background-position: 55% 50%;
  border-radius: 100%;
  border: 0;
  width: 40px;
  height: 40px;
}

.bottombox-Backoff:disabled {
  cursor: not-allowed;
  background-image: url("../../assets/img/Backoff.png");
  background-repeat: no-repeat;
  background-color: #42aeff;
  background-position: center;
  border-radius: 100%;
  border: 0;
  width: 30px;
  height: 30px;
}

.bottombox-Fastforward:disabled {
  cursor: not-allowed;
  background-image: url("../../assets/img/Fastforward.png");
  background-repeat: no-repeat;
  background-color: #42aeff;
  background-position: center;
  border-radius: 100%;
  border: 0;
  width: 30px;
  height: 30px;
}
</style>
