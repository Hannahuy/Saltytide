<template>
  <div>
    <div class="top-leftbox">
      <div class="top-leftbox-top" :class="{ active: activeTab === 'top' }" @click="toggleBox('top')">
        <img :src="activeTab === 'top'
        ? '/src/assets/image/表层渲染-浅蓝.png'
        : '/src/assets/image/表层渲染-深蓝.png'
        " alt="" class="top-leftbox-img" />
        <span class="top-span">表层渲染</span>
      </div>
      <div class="top-leftbox-middle" :class="{ active: activeTab === 'middle' }" @click="toggleBox('middle')">
        <img :src="activeTab === 'middle'
        ? '/src/assets/image/断面分析-浅蓝.png'
        : '/src/assets/image/断面分析-深蓝.png'
        " alt="" class="top-leftbox-img2" />
        <span class="top-span">断面分析</span>
      </div>
      <div class="top-leftbox-bottom" :class="{ active: activeTab === 'bottom' }" @click="toggleBox('bottom')">
        <img :src="activeTab === 'bottom'
        ? '/src/assets/image/体渲染-浅蓝.png'
        : '/src/assets/image/体渲染-深蓝.png'
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
            <span class="top-leftbox-middle-content-div-2-span">Z轴剖切</span>
            <el-slider v-model="Zaxis" style="width: 120px; margin-left: 10px" @change="getZaxis" :min="0" :max="1"
              :step="0.01" />
          </div>
          <div class="top-leftbox-middle-content-div-2-content">
            <span class="top-leftbox-middle-content-div-2-span">特征阈值</span>
            <el-slider v-model="threshold" style="width: 120px; margin-left: 10px" @change="getthreshold" :min="0"
              :max="1" :step="0.01" />
          </div>
        </div>
      </div>
    </div>
    <div v-show="showbar" class="sidebar">
      <div class="bar">
        <div class="color-bar-number">
          <span>10(‰)</span>
          <span>5(‰)</span>
          <span>0(‰)</span>
        </div>
        <div class="color-bar"></div>
      </div>
    </div>
    <div class="sidebar" v-show="shownextbar">
      <div class="nextbar">
        <div class="color-nextbar-number">
          <span>23(‰)</span>
          <span>11(‰)</span>
          <span>0(‰)</span>
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
        :disabled="disabledPlay" @click="togglePlay" :title="disabledPlay ? '播放按钮已禁用' : ''"></el-button>
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
        <span>{{ formattedMinTimeAdd6 }}</span>
        <span>{{ formattedMinTimeAdd12 }}</span>
        <span>{{ formattedMinTimeAdd18 }}</span>
        <span>{{ formattedMaxTime }}</span>
      </div>
    </div>
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)">
      <div class="leftbox-middles" v-show="showEcharts">
        <div class="leftbox-top-title">
          <span>{{ firstSpanText }}</span>
          <span>{{ secondSpanText }}</span>
          <img class="closeimg" src="../../assets/image/close.png" alt="" @click="closeEcharts" />
        </div>
        <div id="transversalsEcharts">
          <img :src="transversalsEchartsimg" alt="" style="width: 100%; height: 100%;margin-top: 5px;" />
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

// const timePick = ref(new Date());
const timePick = ref(dayjs("2023-03-10").toDate());
const timePickform = ref(dayjs("2023-03-10").format('YYYY-MM-DD'));
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

// const timePlay = ref(dayjs().startOf('day').valueOf())
const timePlay = ref(dayjs("2023-03-10").startOf("day").valueOf());
const activeTab = ref("top");
const activePlay = ref("");
const showEcharts = ref(false);
const showsalinityEcharts = ref(false);
const Zaxis = ref(1);
const threshold = ref(0);
const transversalsEchartsimg = ref(
  "/src/assets/dataImg/1aa4dcbb0bdeecd96083f41e35f910e.png"
);
const transversalsvalue = ref("");
const transversalsoptions = [
  {
    value: "河道中心断面",
    label: "河道中心断面",
  },
  {
    value: "自定义绘制断面",
    label: "自定义绘制断面",
  },
];
let lastClickedTab = "";
const tabtimeName = ref('表层渲染')
const disabledPlay = ref(false);
const isDisabled = ref(false);
let playInterval = null;
// 左侧二级菜单
const toggleBox = (tab) => {
  transversalsvalue.value = "";
  if (activeTab.value === tab) {
    activeTab.value = "";
    if (tab === "top") {
      callUIInteraction({
        function: "咸潮模拟_表层渲染/false",
      });
      tabtimeName.value = ''
      console.log("咸潮模拟_表层渲染/false");
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
      showtransversals.value = false;
      callUIInteraction({
        function: "表层渲染/" + formattedTime,
      });
      disabledPlay.value = false; // 启用播放按钮
    } else if (tab === "middle") {
      tabName = "断面分析";
      tabtimeName.value = "断面分析";
      showtransversals.value = true;
      disabledPlay.value = false; // 启用播放按钮
    } else if (tab === "bottom") {
      tabName = "体渲染";
      tabtimeName.value = "体渲染";
      showEcharts.value = false;
      showtransversals.value = false;
      callUIInteraction({
        function: "体渲染/" + formattedTime,
      });
      disabledPlay.value = true; // 禁用播放按钮
      activePlay.value = ""; // 确保播放按钮不为play
      timePick.value = dayjs("2023-03-10").startOf("day").toDate(); // 清空日期选择器
      timePlay.value = dayjs(timePick.value).startOf("day").valueOf(); // 将时间轴从0点00开始
      if (playInterval) {
        clearInterval(playInterval); // 清除计时器
        playInterval = null;
      }
    }
    callUIInteraction({
      function: "咸潮模拟_" + tabName + "/true",
    });
    console.log("咸潮模拟_" + tabName + "/true");
  }
  lastClickedTab = tab;
};

// 获取断面选择框内容
const getselect = (e) => {
  callUIInteraction({
    function: e,
  });
};
// 图片路径   顺序切换图片
const imagePaths = [
  "/src/assets/dataImg/89414d47203f8e5fd56cf15b9520970.png",
  "/src/assets/dataImg/f11baccb8e23beb13656810a1757a87.png",
  "/src/assets/dataImg/1aa4dcbb0bdeecd96083f41e35f910e.png",
];
let currentImagePathIndex = 0;
const updateImage = () => {
  transversalsEchartsimg.value = imagePaths[currentImagePathIndex];
};
let lastClickTime = 0;
// 倒退
const Backoff = () => {
  if (tabtimeName.value === '体渲染') {
    const currentTime = Date.now();
    if (currentTime - lastClickTime < 1000) {
      return;
    }
    lastClickTime = currentTime;
    isDisabled.value = true;
    setTimeout(() => {
      isDisabled.value = false;
    }, 1000);
  }
  const previousTime = timePlay.value;
  timePlay.value = dayjs(previousTime).subtract(1, 'hour').valueOf();
  callUIInteraction({
    function: `咸潮模拟${tabtimeName.value}时间轴/` + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
  });
  transversalsEchartsimg.value = imagePaths[currentImagePathIndex];
  currentImagePathIndex = (currentImagePathIndex - 1 + imagePaths.length) % imagePaths.length;
  updateImage();
};
// 暂停/播放
let previousPlayState = "";
const togglePlay = () => {
  if (disabledPlay.value) return; // 添加判断，如果播放按钮被禁用，则不执行下面的代码
  previousPlayState = activePlay.value;
  activePlay.value = activePlay.value === "play" ? "" : "play";
  if (activePlay.value === "play") {
    playInterval = setInterval(() => {
      timePlay.value = dayjs(timePlay.value).add(1, "minute").valueOf();
      if (activePlay.value !== "play") {
        clearInterval(playInterval);
      }
    }, 16.6665);
  } else {
    clearInterval(playInterval);
  }
};
// 前进
const Fastforward = () => {
  if (tabtimeName.value === '体渲染') {
    const currentTime = Date.now();
    if (currentTime - lastClickTime < 1000) {
      return;
    }
    lastClickTime = currentTime;
    isDisabled.value = true;
    setTimeout(() => {
      isDisabled.value = false;
    }, 1000);
  }
  const previousTime = timePlay.value;
  timePlay.value = dayjs(previousTime).add(1, 'hour').valueOf();
  callUIInteraction({
    function: `咸潮模拟${tabtimeName.value}时间轴/` + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
  });
  transversalsEchartsimg.value = imagePaths[currentImagePathIndex];
  currentImagePathIndex = (currentImagePathIndex + 1) % imagePaths.length;
  updateImage();
};

// const min = ref(dayjs().startOf('day').valueOf());
// const max = ref(dayjs().endOf('day').valueOf());
const min = ref(dayjs(timePick.value).startOf("day").valueOf());
const max = ref(dayjs(timePick.value).endOf("day").valueOf());

const formattedTime = computed(() => {
  const time = dayjs(timePlay.value);
  if (time.isSame(dayjs(max.value))) {
    return dayjs(max.value).add(1, "day").format("YYYY/MM/DD 00:00");
  } else {
    return time.format("YYYY/MM/DD HH:mm");
  }
});

const formattedMinTime = computed(() => {
  return dayjs(min.value).format("YYYY/MM/DD 00:00");
});

const formattedMinTimeAdd6 = computed(() => {
  return dayjs(min.value).add(6, "hour").format("YYYY/MM/DD HH:mm");
});

const formattedMinTimeAdd12 = computed(() => {
  return dayjs(min.value).add(12, "hour").format("YYYY/MM/DD HH:mm");
});

const formattedMinTimeAdd18 = computed(() => {
  return dayjs(min.value).add(18, "hour").format("YYYY/MM/DD HH:mm");
});

const formattedMaxTime = computed(() => {
  return dayjs(max.value).add(1, "day").format("YYYY/MM/DD 00:00");
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
  const formattedDate = selectedDate.format("YYYY-MM-DD");
  callUIInteraction({
    function: `咸潮模拟${tabtimeName.value}选择时间/` + formattedDate,
  });
  min.value = selectedDate.startOf("day").valueOf();
  max.value = selectedDate.endOf("day").valueOf();
  timePlay.value = selectedDate.startOf("day").valueOf();
});
watch(timePlay, (newVal) => {
  const currentTime = dayjs(newVal);
  if (currentTime.minute() === 0 && currentTime.second() === 0) {
    callUIInteraction({
      function: `咸潮模拟${tabtimeName.value}时间轴/` + currentTime.format("YYYY-MM-DD HH:mm:ss"),
    });
  }
  if (currentTime.isSame(dayjs(max.value))) {
    activePlay.value = '';
  }
});
// 监听时间轴
const gettimePlay = (e) => {
  const clickedTime = dayjs(e).format("YYYY-MM-DD HH:mm:ss");
  if ((activePlay.value = "play")) {
    activePlay.value = "";
  }
  callUIInteraction({
    function: `咸潮模拟${tabtimeName.value}时间轴/` + clickedTime,
  });
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
// 监听Z轴
const getZaxis = (e) => {
  callUIInteraction({
    function: "Z轴剖切/" + e,
  });
  console.log(e);
};
// 监听特征阈值
const getthreshold = (e) => {
  callUIInteraction({
    function: "特征阈值/" + e,
  });
  console.log(e);
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
  return activeTab.value === "bottom";
});
let salinitydata = null;
const salinityinit = (data) => {
  const salinityChartElement = document.getElementById("salinityEcharts");
  if (salinitydata) {
    salinitydata.dispose();
  }
  salinitydata = echarts.init(salinityChartElement);
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
      data: Array.from({ length: 24 }, (_, i) => `${timePickform.value} ${i}:00`),
      axisLabel: {
        show: true,
        textStyle: {
          color: "#b7cffc",
          fontSize: 10,
        },
      },
    },
    yAxis: {
      axisLine: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: "#b7cffc",
          fontSize: 12
        },
        formatter: function (value) {
          return value.toFixed(2) + '‰';
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
        data: data
      }
    ],
    grid: { x: 60, y: 25, x2: 5, y2: 25 },
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
    })
  } else if (datajson.Type == '表层盐度点击查询') {
    axios.get(`/api/get_raster_value?lat=${latValue}&lon=${lonValue}`).then((res) => {
      if (res.data.success === true) {
        if (res.data.values) {
          showsalinityEcharts.value = true;
          salinityinit(res.data.values);
        }
      }
    })
      .catch((err) => {
        console.error(err);
      });
  }
};
onMounted(() => {
  addResponseEventListener("handle_responses", myHandleResponseFunction);
  callUIInteraction({
    function: "咸潮模拟_表层渲染/true",
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
  height: 160px;
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
  height: 35px;
  line-height: 38px;
  padding-left: 10px;
  font-size: 20px;
  display: block;
  font-family: YouSheBiaoTiHei;
  box-sizing: border-box;
}

.top-leftbox-middle-content-div-2-span {
  width: 60px;
  height: 35px;
  line-height: 38px;
  font-size: 14px;
  box-sizing: border-box;
}

.top-leftbox-middle-content-div-2 {
  display: flex;
  flex-direction: column;
  height: 85px;
  padding: 10px;
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
  font-size: 12px;
}

.bottombox-slider-span {
  width: 120px;
  background-color: #42aeff;
  border-radius: 1.25rem;
  color: white;
  display: block;
  text-align: center;
  font-size: 12px;
}

:deep(.el-slider__button) {
  background-color: transparent;
  border: 0;
}

:deep(.el-slider__bar) {
  background-color: #42aeff;
}

.topbutton {
  border-radius: 0;
  background-color: #0a6adf;
  border: 0;
}

#transversalsEcharts {
  width: 860px;
  height: 430px;
  margin-top: 10px;
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
  width: 900px;
  height: 520px;
  background-image: url("../../assets/image/框-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;
  padding: 20px;
  box-sizing: border-box;
}

.leftbox-top-title {
  width: 860px;
  height: 33px;
  background-image: url("../../assets/image/title.png");
  background-repeat: no-repeat;
  background-size: 85% 100%;
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
  right: 25px;
  top: 35px;
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

.top-leftbox-middle-content-2:deep(.el-slider__runway) {
  height: 2px;
  background-color: #00a8d2;
}

.top-leftbox-middle-content-2:deep(.el-slider__bar) {
  height: 2px;
  background-color: #00a8d2;
}

.top-leftbox-middle-content-2:deep(.el-slider__button) {
  background-color: transparent;
  border: 0;
  background-image: url("../../assets/img/slipPoint_icon.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-bottom: 4px;
}

.top-leftbox-middle-content-div-2-content {
  display: flex;
  align-items: center;
  height: 40px;
  margin-top: 5px;
}

.sidebar {
  position: absolute;
  bottom: 35px;
  right: 30px;
  background-image: url("../../assets/image/框-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 70px;
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
      #ff0000 0%,
      #ffdb00 20%,
      #c4ff00 40%,
      #00ff09 60%,
      #2323f5 80%,
      #7e01ff 100%);
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
