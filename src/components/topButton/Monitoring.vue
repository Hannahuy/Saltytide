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
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import tabledataJson from "/public/data/实时监测.json";

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
    grid: { x: 10, y: 10, x2: 10, y2: 1, containLabel: true },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        axisLabel: {
          show: true,
          textStyle: {
            color: "#b7cffc", //更改坐标轴文字颜色
            fontSize: 12, //更改坐标轴文字大小
          },
        },
      },
    ],
    yAxis: {
      splitLine: { show: false },
      axisLabel: {
        show: true,
        textStyle: {
          color: "#b7cffc", //更改坐标轴文字颜色
          fontSize: 12, //更改坐标轴文字大小
        },
      },
    },
    series: [
      {
        name: "Line 2",
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
        data: [120, 282, 111, 234, 220, 340, 310],
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
      top:'15%',
      textStyle: {
        color: '#b7cffc',
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 3, name: '泵站监测' },
          { value: 2, name: '流量监测' },
          { value: 4, name: '水位监测' },
          { value: 3, name: '盐度监测' }
        ],
        itemStyle: {
          normal: {
            label: {
              textStyle: {
                color: '#b7cffc',
                fontWeight: 'bolder'
              }
            },
          }
        },
        left:'20%',
        bottom:'17%',
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

onMounted(() => {
  initWaterChart();
  initSalinityChart();
  gettable();
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
  min-height: 804px;
  background-image: url("../../assets/image/框-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 11%;
  left: 10px;
  padding: 20px;
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
</style>
