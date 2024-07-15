<template>
  <div class="top-leftbox">
    <div class="leftbox2">
      <div class="top-leftbox-title">
        <span>设备列表</span>
        <span>A list of devices</span>
      </div>
      <el-table :data="tableData" style="width: 100%; margin-top: 10px" :header-cell-style="{
        background: 'transparent',
        fontSize: '15px',
        'text-align': 'center',
      }" height="200">
        <el-table-column prop="StationCode" label="测站编码" align="center" width="150" />
        <el-table-column prop="StationName" label="测站名称" align="center" width="120" />
        <el-table-column prop="MonitorValues" label="监测数值" align="center" width="110" />
        <el-table-column prop="StationClass" label="单位" align="center" width="70" />
        <el-table-column prop="Updated" label="时间" align="center" width="180" />
      </el-table>
    </div>
    <div class="leftbox1">
      <div class="top-leftbox-title">
        <span>实时监测信息</span>
        <span>Real-time monitoring of information</span>
      </div>
      <div id="MessageCharts"></div>
    </div>
    <div class="leftbox3">
      <div class="top-leftbox-title">
        <span>监测信息</span>
        <span>Monitoring information</span>
      </div>
      <div style="display: flex;align-items: center;justify-content: center;">
        <a-range-picker dropdownClassName="rangePickerIceGai" style="width:380px;margin-top: 10px;" v-model:value="selectedTimeRange" show-time />
        <el-button class="buttonserch" type="primary" @click="handleSearch">查询</el-button>
      </div>
      <div id="WaterCharts"></div>
    </div>
  </div>
  <div class="right-box" v-if="Devicebox">
    <div class="top-leftbox-title">
      <span>设备信息</span>
      <span>Device information</span>
      <img class="closeimg" src="../../assets/image/close.png" alt="" @click="close" />
    </div>
    <div class="right-box-content">
      <table class="custom-table">
        <tr>
          <td>测站名称</td>
          <td>{{ BDeviceName }}</td>
        </tr>
        <tr>
          <td>监测数值</td>
          <td>{{ BNumber }}</td>
        </tr>
        <tr>
          <td>单位</td>
          <td>{{ Bunit }}</td>
        </tr>
        <tr>
          <td>测站编码</td>
          <td>{{ BDeviceCode }}</td>
        </tr>
        <tr>
          <td>时间</td>
          <td>{{ Btime }}</td>
        </tr>
      </table>
    </div>
    <div class="right-box-img">
      <img :src="Deviceimg" alt="" class="Deviceimgbox" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import tabledataJson from "/public/data/实时监测.json";
import {
  callUIInteraction,
  addResponseEventListener,
} from "../../module/webrtcVideo/webrtcVideo.js";
import salinity from "../../assets/img/盐度监测设备.png";
import flowrate from "../../assets/img/流量监测设备.png";
import waterimg from "../../assets/img/水位监测设备.png";
import staimg from "../../assets/img/泵站监测设备.png";
import dayjs from "dayjs";

const BDeviceCode = ref("");
const BDeviceName = ref("");
const BNumber = ref("");
const Bunit = ref("");
const Btime = ref("");
const Devicebox = ref(false);
const Deviceimg = ref('');
const echartsname = ref("大涌口");
const imagePaths = [salinity, flowrate, waterimg, staimg];
const myHandleResponseFunction = (data) => {
  const jsonData = JSON.parse(data);
  console.log(jsonData);
  const randomIndex = Math.floor(Math.random() * imagePaths.length);
  Deviceimg.value = imagePaths[randomIndex];

  BDeviceName.value = jsonData.DeviceName;

  const matchedDevice = tableData.value.find(device => device.StationName === jsonData.DeviceName);
  if (matchedDevice) {
    BDeviceCode.value = matchedDevice.StationCode;
    BNumber.value = matchedDevice.MonitorValues;
    Bunit.value = matchedDevice.StationClass;
    Btime.value = matchedDevice.Updated;

    // 重新绘制图表
    const lastUpdated = dayjs(matchedDevice.Updated);
    const monitorValue = parseFloat(matchedDevice.MonitorValues);

    initWaterChart(null, null, lastUpdated, monitorValue, jsonData.DeviceName);
  }

  Devicebox.value = true;
};

const tableData = ref([]);
// 获取表格数据
const gettable = () => {
  tableData.value = tabledataJson;
};
const selectedTimeRange = ref(null)
// 处理查询按钮点击事件
const handleSearch = () => {
  if (selectedTimeRange.value) {
    const [startTime, endTime] = selectedTimeRange.value;
    if (startTime && endTime) {
      initWaterChart(startTime, endTime);
    } else {
      initWaterChart();
    }
  } else {
    initWaterChart();
  }
};
let waterChartInstance = null;
let salinityChartInstance = null;
// 绘制左中图表
const initMessageChart = (startTime = null, endTime = null) => {
  gettable();
  const waterChartElement = document.getElementById("MessageCharts");
  if (salinityChartInstance) {
    salinityChartInstance.dispose();
  }
  salinityChartInstance = echarts.init(waterChartElement);
  const options = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '11%',
      top: '20%',
      right: '22%',
      bottom: '25%'
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        rotate: 30,    // 旋转角度，这里设置为45度
        fontSize: 14,  // 这里可以根据需要调整字体大小
        interval: 0,
        color: '#b7cffc'
      },
      data: ['竹洲头泵站', '平岗泵站', '联石湾', '马角', '灯笼', '大涌口', '广昌', '挂定角']
    },
    yAxis: {
      type: 'value',
      name: 'mg/L',
      nameTextStyle: {
        color: '#b7cffc',
        fontFamily: 'FZLTHK--GBK1-0',
        fontSize: '14'
      },
      splitLine: {
        show: false // 不显示网格线
      },
      axisLabel: {
        rotate: 0,    // 旋转角度，这里设置为45度
        fontSize: 14,  // 这里可以根据需要调整字体大小
        color: '#b7cffc'
      },
    },
    visualMap: {
      top: 'middle',    // 将位置设置为中间，也可以用百分比或具体数值调整位置
      right: 10,
      align: 'left',   // 确保与右侧对齐
      itemWidth: 10,    // 调整色带的宽度
      itemHeight: 10,  // 调整色带的高度，较大的高度会增加间隙感
      textStyle: {
        color: '#b7cffc',  // 文字颜色
        fontSize: 12   // 文字大小
      },
      pieces: [
        {
          gt: 0,
          lte: 1,
          color: '#93CE07'
        },
        {
          gt: 1,
          lte: 5,
          color: '#FBDB0F'
        },
        {
          gt: 5,
          lte: 10,
          color: '#FC7D02'
        },
        {
          gt: 10,
          lte: 20,
          color: '#FD0100'
        },
        {
          gt: 20,
          lte: 30,
          color: '#AA069F'
        },
        {
          gt: 30,
          color: '#AC3B2A'
        }
      ],
      outOfRange: {
        color: '#999'
      }
    },
    series: [
      {
        name: '水质 mg/L',
        type: 'line',
        smooth: 0.2,
        data: [0.1, 0.0, 1.5, 0.3, 0.0, 1.3, 32.0, 0.0],
      }
    ]
  };
  salinityChartInstance.setOption(options);
};
// 绘制左下echarts图表
const initWaterChart = (startTime = null, endTime = null, lastUpdated = null, monitorValue = null, deviceName = "大涌口") => {
  gettable();
  const waterChartElement = document.getElementById("WaterCharts");
  if (waterChartInstance) {
    waterChartInstance.dispose();
  }
  waterChartInstance = echarts.init(waterChartElement);

  // X轴
  let dataxAxis = [];
  let dataseries = [];
  if (startTime && endTime) {
    let currentTime = dayjs(endTime);
    while (currentTime.isAfter(startTime) || currentTime.isSame(startTime)) {
      dataxAxis.unshift(currentTime.format('HH:mm'));
      currentTime = currentTime.subtract(10, 'minute');
    }
    // Y轴
    for (let i = 0; i < dataxAxis.length; i++) {
      const newValue = Math.random() * 42;
      dataseries.push(newValue.toFixed(1));
    }
  } else {
    let lastTime = dayjs(tableData.value[0].Updated);
    for (let i = 0; i < 19; i++) {
      dataxAxis.unshift(lastTime.format('HH:mm'));
      lastTime = lastTime.subtract(10, 'minute');
    }

    // Y轴
    const firstMonitorValue = parseFloat(tableData.value[0]?.MonitorValues || 0);
    let prevValue = Math.random() * 10;
    dataseries.push(prevValue.toFixed(1));
    for (let i = 1; i < dataxAxis.length; i++) {
      const max = Math.min(prevValue + 2, 12);
      const min = Math.max(prevValue - 2, 0);
      const newValue = Math.random() * (max - min) + min;
      dataseries.push(newValue.toFixed(1));
      prevValue = newValue;
    }
    if (lastUpdated && monitorValue !== null) {
      dataxAxis[dataxAxis.length - 1] = lastUpdated.format('HH:mm');
      dataseries[dataseries.length - 1] = monitorValue.toFixed(1);
    } else {
      dataxAxis[dataxAxis.length - 1] = dayjs(tableData.value[0].Updated).format('HH:mm');
      dataseries[dataseries.length - 1] = firstMonitorValue;
    }
  }

  const spacedTitle = deviceName.split('').join(String.fromCharCode(160));
  const options = {
    title: {
      text: spacedTitle,
      left: 'center',
      textStyle: {
        color: '#b7cffc',
        fontSize: 18
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      }
    },
    grid: { x: '1%', y: '15%', x2: '4%', y2: '14%', containLabel: true },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: dataxAxis,
        axisLabel: {
          show: true,
          color: "#b7cffc", //更改坐标轴文字颜色
          fontSize: 12, //更改坐标轴文字大小
        },
      },
    ],
    yAxis: {
      splitLine: { show: false },
      name: 'mg/L', // 添加单位
      nameTextStyle: {
        color: "#b7cffc",
        fontSize: 14
      },
      axisLabel: {
        show: true,
        color: "#b7cffc", //更改坐标轴文字颜色
        fontSize: 12, //更改坐标轴文字大小
      },
    },
    series: [
      {
        name: deviceName,
        type: "line",
        stack: "Total",
        smooth: true,
        lineStyle: { width: 0 },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#0358c0" },
            { offset: 1, color: "#28F2E6" },
          ]),
        },
        emphasis: { focus: "series" },
        data: dataseries,
      },
    ],
  };
  waterChartInstance.setOption(options);
};
// 关闭设备信息
const close = () => {
  Devicebox.value = false;
};
onMounted(() => {
  initWaterChart();
  initMessageChart();
  gettable();
  addResponseEventListener("handle_responses", myHandleResponseFunction);
});

onBeforeUnmount(() => {
  if (waterChartInstance) {
    waterChartInstance.dispose();
  }
  if (salinityChartInstance) {
    salinityChartInstance.dispose();
  }
});
</script>


<style scoped>
.top-leftbox {
  width: 500px;
  height: 83%;
  min-height: 845px;
  background-image: url("../../assets/image/框-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 11%;
  left: 10px;
  padding: 20px;
  overflow: hidden;
}

.right-box {
  width: 500px;
  height: 470px;
  background-image: url("../../assets/image/框-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  bottom: 20px;
  right: 10px;
  padding: 20px;
  overflow: hidden;
}

.leftbox1 {
  min-height: 235px;
  height: 29.1%;
}

.leftbox2 {
  min-height: 255px;
  height: 32.6%;
}

.leftbox3 {
  min-height: 315px;
  height: 39.3%;
}

.top-leftbox-title {
  width: 100%;
  height: 33px;
  background-image: url("../../assets/image/title.png");
  background-repeat: no-repeat;
  background-size: 140% 100%;
  display: flex;
  align-items: center;
}

.top-leftbox-title span {
  font-family: PangMenZhengDao;
  font-size: 20px;
  color: #b7cffc;
  margin-left: 40px;
}

.top-leftbox-title span:nth-child(2) {
  font-size: 12px;
}

:deep(.el-table--fit) {
  padding: 0;
}

:deep(.el-table, .el-table__expanded-cell) {
  background-color: transparent;
  border: none;
}

:deep(.el-table th) {
  background-color: transparent;
  border: none;
}

:deep(.el-table tr) {
  background-color: transparent;
  border: none;
}

:deep(.el-table--enable-row-transition .el-table__body td, .el-table .cell) {
  background-color: transparent;
  border: none;
}

:deep(.el-table__header-wrapper th) {
  background-color: transparent;
  border: none;
}

:deep(.el-table__body-wrapper td) {
  border: none;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
  background-color: transparent;
}

/* 去掉中间数据的分割线 */
:deep(.el-table__row > td) {
  border: none;
}

/* 去掉上面的线 */
:deep(.el-table th.is-leaf) {
  border: none;
}

:deep(.el-table__inner-wrapper:before) {
  display: none;
}

:deep(.el-table .cell) {
  color: #b7cffc;
}

/* #SalinityCharts {
  width: 100%;
  height: 52%;
  margin-top: 20px;
} */

#WaterCharts {
  width: 100%;
  height: 80%;
  margin-top: 10px;
}

#MessageCharts {
  margin-top: 10px;
  width: 100%;
  height: 80%;
}

.top-leftbox-title-top {
  height: 60%;
  margin-top: 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.top-leftbox-title-top-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #b7cffc;
  font-size: 18px;
}

.top-leftbox-title-img {
  width: 100px;
  height: 80px;
}

.top-leftbox-title-top-span {
  position: absolute;
  color: #b7cffc;
  font-size: 24px;
  font-family: YouSheBiaoTiHei;
  left: 38px;
  top: 5px;
  font-size: 30px;
}

.closeimg {
  position: absolute;
  width: 20px;
  height: 20px;
  right: 25px;
  top: 25px;
  cursor: pointer;
}

.Deviceimgbox {
  width: 100%;
  height: 100%;
}

.right-box-img {
  width: 100%;
  height: 200px;
  margin-top: 10px;
}

.buttonserch {
  margin-top: 10px;
  border-radius: 0;
  background-color: #0a6adf;
  margin-left: 20px;
  border: 0;
}

.custom-table {
  border-collapse: collapse;
  width: 100%;
  color: #b7cffc;
  margin-top: 10px;
}

.custom-table th,
.custom-table td {
  border: 1px solid #416491;
  padding: 8px;
  text-align: center;
  height: 35px;
  width: 50%;
}
:deep(.ant-picker-input > input){
  color: #b7cffc;
  text-align: center;
}
:deep(.ant-picker-input input::placeholder) {
  color: #9cadcc;
}
</style>
