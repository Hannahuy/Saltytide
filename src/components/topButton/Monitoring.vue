<template>
  <div class="top-leftbox">
    <div class="leftbox1">
      <div class="top-leftbox-title">
        <span>站点数量</span>
        <span>Number of sites</span>
      </div>
      <div class="top-leftbox-title-top">
        <div class="top-leftbox-title-top-content">
          <span class="top-leftbox-title-top-span">3</span>
          <img src="/src/assets/img/图标4.png" class="top-leftbox-title-img" alt="">
          <span>泵站监测</span>
        </div>
        <div class="top-leftbox-title-top-content">
          <span class="top-leftbox-title-top-span">2</span>
          <img src="/src/assets/img/图标4.png" class="top-leftbox-title-img" alt="">
          <span>流量监测</span>
        </div>
        <div class="top-leftbox-title-top-content">
          <span class="top-leftbox-title-top-span">4</span>
          <img src="/src/assets/img/图标4.png" class="top-leftbox-title-img" alt="">
          <span>水位监测</span>
        </div>
        <div class="top-leftbox-title-top-content">
          <span class="top-leftbox-title-top-span">3</span>
          <img src="/src/assets/img/图标4.png" class="top-leftbox-title-img" alt="">
          <span>盐度监测</span>
        </div>
      </div>
      <div id="SalinityCharts"></div>
    </div>
    <div class="leftbox2">
      <div class="top-leftbox-title">
        <span>设备列表</span>
        <span>A list of devices</span>
      </div>
      <el-table :data="tableData" style="width: 100%" :header-cell-style="{
        background: 'transparent',
        fontSize: '15px',
        'text-align': 'center',
      }" height="150" align="center">
        <el-table-column prop="DeviceName" label="设备名称" align="center" />
        <el-table-column prop="DeviceType" label="设备类型" align="center" />
        <el-table-column prop="OnlineSituation" label="是否在线" align="center" />
      </el-table>
    </div>
    <div class="leftbox3">
      <div class="top-leftbox-title">
        <span>监测信息</span>
        <span>Monitoring information</span>
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
      <div class="right-box-content-top">
        <span style="margin-right: 10px;">设备类型：{{ BDeviceType }}</span>
        <span style="margin-right: 10px;">设备名称：{{ BDeviceName }}</span>
        <span>是否在线：{{ BOnlineStatus }}</span>
      </div>
      <div class="right-box-content-bottom">
        <span style="margin-right: 10px;">经度：{{ BLongitude }}</span>
        <span>纬度：{{ BLatitude }}</span>
      </div>
    </div>
    <div class="right-box-img">
      <img :src="Deviceimg" alt="" class="Deviceimgbox">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import tabledataJson from "/public/data/实时监测.json";
import { callUIInteraction, addResponseEventListener, } from "../../module/webrtcVideo/webrtcVideo.js";
import salinity from '../../assets/img/盐度监测设备.png';
import flowrate from '../../assets/img/流量监测设备.png';
import waterlevel from '../../assets/img/水位监测设备.png';
import pumpingstation from '../../assets/img/泵站监测设备.png';

const BDeviceType = ref('');
const BDeviceName = ref('');
const BOnlineStatus = ref('');
const BLongitude = ref('');
const BLatitude = ref('');
const Devicebox = ref(false);
const Deviceimg = ref()
const dataxAxis = ref(['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45'])
const dataseries = ref([20, 30, 25, 35, 40, 45, 50, 48, 45, 40, 35, 30, 28, 30, 32, 35, 38, 40, 42, 40, 38, 36, 34, 32])
const echartsname = ref('水位监测')
const myHandleResponseFunction = (data) => {
  const jsonData = JSON.parse(data);
  echartsname.value = jsonData.DeviceType;
  switch (jsonData.DeviceType) {
    case '泵站监测':
      dataseries.value = [120, 130, 125, 135, 140, 145, 150, 148, 145, 140, 135, 130, 128, 130, 132, 135, 138, 140, 142, 140, 138, 136, 134, 132];
      Deviceimg.value = pumpingstation;
      break;
    case '流量监测':
      dataseries.value = [120, 130, 125, 135, 140, 145, 150, 148, 145, 140, 135, 130, 128, 130, 132, 135, 138, 140, 142, 140, 138, 136, 134, 132];
      Deviceimg.value = flowrate;
      break;
    case '水位监测':
      dataseries.value = [20, 30, 25, 35, 40, 45, 50, 48, 45, 40, 35, 30, 28, 30, 32, 35, 38, 40, 42, 40, 38, 36, 34, 32];
      Deviceimg.value = waterlevel;
      break;
    case '盐度监测':
      dataseries.value = [4.4, 3.4, 3.1, 5.6, 7.5, 8.5, 9.5, 10.4, 11.4, 9.8, 7.5, 7.9, 7.1, 6.4, 6.2, 5.8, 5.4, 5.1, 4.7, 4.5, 3.9, 3.5, 3.4, 3.6];
      Deviceimg.value = salinity;
      break;
  }
  initWaterChart();
  Devicebox.value = true;
  BDeviceType.value = jsonData.DeviceType;
  BDeviceName.value = jsonData.DeviceName;
  BOnlineStatus.value = jsonData.OnlineStatus;
  BLongitude.value = jsonData.Longitude;
  BLatitude.value = jsonData.Latitude;
};
const tableData = ref([]);
// 获取表格数据
const gettable = () => {
  tableData.value = tabledataJson.Table;
};

let waterChartInstance = null;
let salinityChartInstance = null;
// 绘制echarts图表
const initWaterChart = () => {
  const waterChartElement = document.getElementById("WaterCharts");
  if (waterChartInstance) {
    waterChartInstance.dispose();
  }
  waterChartInstance = echarts.init(waterChartElement);
  const options = {
    title: {
      text: echartsname.value,
      left: 'center',
      textStyle: {
        color: '#b7cffc',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      }
    },
    grid: { x: 10, y: 40, x2: 10, y2: 10, containLabel: true },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: dataxAxis.value,
        axisLabel: {
          show: true,
            color: "#b7cffc", //更改坐标轴文字颜色
            fontSize: 12, //更改坐标轴文字大小
        },
      },
    ],
    yAxis: {
      splitLine: { show: false },
      axisLabel: {
        show: true,
          color: "#b7cffc", //更改坐标轴文字颜色
          fontSize: 12, //更改坐标轴文字大小
      },
    },
    series: [
      {
        name: echartsname.value,
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
        data: dataseries.value,
      },
    ],
  };
  waterChartInstance.setOption(options);
};
// 绘制echarts图表
const initSalinityChart = () => {
  const salinityChartElement = document.getElementById("SalinityCharts");
  if (salinityChartInstance) {
    salinityChartInstance.dispose();
  }
  salinityChartInstance = echarts.init(salinityChartElement);
  const options = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: '7%',
      top: '7%',
      textStyle: {
        color: '#b7cffc',
      },
      itemGap: 20, // 间距
    },
    series: [
      {
        name: '站点数量',
        type: 'pie',
        radius: '80%',
        data: [
          { value: 3, name: '泵站监测' },
          { value: 2, name: '流量监测' },
          { value: 4, name: '水位监测' },
          { value: 3, name: '盐度监测' }
        ],
        label: {
          color: '#b7cffc',
          fontWeight: 'bolder',
          fontSize: '14',
        },
        left: '20%',
        bottom: '17%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  salinityChartInstance.setOption(options);
};
// 关闭设备信息
const close = () => {
  Devicebox.value = false;
}
onMounted(() => {
  initWaterChart();
  initSalinityChart();
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
  height: 35%;
  min-height: 360px;
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
  min-height: 321px;
  height: 40%;
}

.leftbox2 {
  min-height: 201px;
  height: 25%;
}

.leftbox3 {
  min-height: 281px;
  height: 35%;
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


#SalinityCharts {
  width: 100%;
  height: 52%;
  margin-top: 20px;
}

#WaterCharts {
  width: 100%;
  height: 80%;
  margin-top: 20px;
}

.top-leftbox-title-top {
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
}

.top-leftbox-title-img {
  width: 80px;
  height: 60px;
}

.top-leftbox-title-top-span {
  position: absolute;
  color: #b7cffc;
  font-size: 24px;
  font-family: YouSheBiaoTiHei;
  left: 30px;
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
}

.right-box-content {
  height: 90px;
  color: #b7cffc;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.right-box-content-top,
.right-box-content-bottom {
  width: 100%;
  display: flex;
}

.right-box-content-top span,
.right-box-content-bottom span {
  display: inline-block;
  width: 160px;
}
</style>
