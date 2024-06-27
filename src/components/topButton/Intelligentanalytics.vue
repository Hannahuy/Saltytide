<template>
  <div class="leftbox">
    <div class="leftbox-middle">
      <div class="leftbox-top-title">
        <span>智能分析</span>
        <span>Intelligent analytics</span>
      </div>
      <div class="leftbox-middle-content">
        <div class="leftbox-middle-content-top">
          <span>站点选择：</span>
          <el-select v-model="selectValue" placeholder="请选择站点" style="width: 380px" popper-class="blueBack">
            <el-option v-for="item in selectoptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="leftbox-middle-content-top-raido">
          <span>预测范围：</span>
          <el-radio-group v-model="dayradio" class="ml-4" @change="getdayradio">
            <el-radio value="1" size="large" :disabled="disable1Day" style="width: 115px;margin: 0">1天(逐时预报)</el-radio>
            <el-radio value="2" size="large" style="width: 115px;margin: 0">3天(逐日预报)</el-radio>
            <el-radio value="3" size="large" style="width: 115px;margin: 0">7天(逐日预报)</el-radio>
          </el-radio-group>
        </div>
        <div class="leftbox-middle-content-middle">
          <span>数据选择：</span>
          <div class="buttonbox">
            <el-button class="buttonstyle" type="primary" @click="Realtimedata">实时数据</el-button>
            <el-button class="buttonstyle" type="primary" @click="uploadSampleData">样例数据</el-button>
            <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" />
            <el-button class="buttonstyle" type="primary" @click="Manualentry">手动输入</el-button>
          </div>
        </div>
        <div class="leftbox-table">
          <table class="custom-table">
            <tr v-if="dayradio === '1'">
              <td>实时盐度</td>
              <td>{{ tableData[0] }}</td>
            </tr>
            <tr v-if="dayradio === '1'">
              <td>前1小时盐度</td>
              <td>{{ tableData[1] }}</td>
            </tr>
            <tr v-if="dayradio === '1'">
              <td>前2小时盐度</td>
              <td>{{ tableData[2] }}</td>
            </tr>
            <tr v-if="dayradio === '1'">
              <td>提前24小时三灶潮位</td>
              <td>{{ tableData[3] }}</td>
            </tr>
            <tr v-if="dayradio === '1'">
              <td>提前48小时马口径流</td>
              <td>{{ tableData[4] }}</td>
            </tr>
            <tr v-if="dayradio === '1'">
              <td>提前24小时u方向风速</td>
              <td>{{ tableData[5] }}</td>
            </tr>
            <tr v-if="dayradio === '1'">
              <td>提前24小时v方向风速</td>
              <td>{{ tableData[6] }}</td>
            </tr>
            <tr v-if="dayradio === '2' || dayradio === '3'">
              <td>今日最大盐度</td>
              <td>{{ tableData[0] }}</td>
            </tr>
            <tr v-if="dayradio === '2' || dayradio === '3'">
              <td>昨日最大盐度</td>
              <td>{{ tableData[1] }}</td>
            </tr>
            <tr v-if="dayradio === '2' || dayradio === '3'">
              <td>前日最大盐度</td>
              <td>{{ tableData[2] }}</td>
            </tr>
            <tr v-if="dayradio === '2' || dayradio === '3'">
              <td>今日三灶日最低潮位</td>
              <td>{{ tableData[3] }}</td>
            </tr>
            <tr v-if="dayradio === '2' || dayradio === '3'">
              <td>今日马口平均流量</td>
              <td>{{ tableData[4] }}</td>
            </tr>
            <tr v-if="dayradio === '2' || dayradio === '3'">
              <td>今日澳门风速</td>
              <td>{{ tableData[5] }}</td>
            </tr>
            <tr v-if="dayradio === '2' || dayradio === '3'">
              <td>今日潮波不对称性因子</td>
              <td>{{ tableData[6] }}</td>
            </tr>
          </table>
          <el-button style="margin-top: 20px; margin-left: 372px" class="buttonstyle" type="primary"
            @click="drive">驱动模型</el-button>
        </div>
      </div>
    </div>
  </div>
  <div id="leftbox-echarts">
    <div class="leftbox-echarts-middle" v-show="showEcharts">
      <div class="leftbox-echarts-top-title">
        <span>取水辅助</span>
        <span>Intake aid</span>
        <img class="closeimg" src="../../assets/image/close.png" alt="" @click="closeEcharts">
      </div>
      <div id="leftbox-content"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts";
import * as XLSX from "xlsx";
import { ElMessage } from 'element-plus'

const selectValue = ref("");
const selectoptions = [
  {
    value: "平岗",
    label: "平岗",
  },
  {
    value: "广昌",
    label: "广昌",
  },
  {
    value: "竹洲头",
    label: "竹洲头",
  },
  {
    value: "灯笼山",
    label: "灯笼山",
  },
  {
    value: "全禄水厂",
    label: "全禄水厂",
  },
];
const tableData = ref(["", "", "", "", "", "", ""])
const dayradio = ref("1");
const showEcharts = ref(false)
const disable1Day = ref(false);
watch(selectValue, (newValue) => {
  if (newValue === "平岗" || newValue === "广昌") {
    dayradio.value = "1";
    disable1Day.value = false;
  } else if (newValue === "竹洲头" || newValue === "灯笼山" || newValue === "全禄水厂") {
    dayradio.value = "2";
    disable1Day.value = true;
  }
});
let waterdata = null;
const init = () => {
  const waterChartElement = document.getElementById("leftbox-content");
  if (waterdata) {
    waterdata.dispose();
  }
  waterdata = echarts.init(waterChartElement);
  const options = {
    title: {
      text: '',//平岗站24盐度预报结果
      left: 'center',
      top: '3%',
      textStyle: {
        color: '#fff',
        fontSize: 20,
        padding: [0, 0, 0, 0] // 在这里设置间距，例如上边距为10px，其余为0
      }
    },

    grid: {
      // height: "72%",
      bottom: '5%',
      top: '12%',
      right: '1%',
      left: '10%',
    },

    tooltip: {
      trigger: 'axis'
    },
    xAxis: [
      {
        type: 'category',
        axisLine: {
          //这是x轴文字颜色
          lineStyle: {
            color: '#fff'
          }
        },
        axisLabel: {
          color: '#fff', //刻度线标签颜色
          fontSize: '14'
        },
        axisTick: { show: false }, //隐藏刻度
        boundaryGap: true,
        data: ["2022/11/1 0:00", "2022/11/1 1:00", "2022/11/1 2:00", "2022/11/1 3:00", "2022/11/1 4:00", "2022/11/1 5:00", "2022/11/1 6:00", "2022/11/1 7:00", "2022/11/1 8:00", "2022/11/1 9:00", "2022/11/1 10:00", "2022/11/1 11:00", "2022/11/1 12:00", "2022/11/1 13:00", "2022/11/1 14:00", "2022/11/1 15:00", "2022/11/1 16:00", "2022/11/1 17:00", "2022/11/1 18:00", "2022/11/1 19:00", "2022/11/1 20:00", "2022/11/1 21:00", "2022/11/1 22:00", "2022/11/1 23:00", "2022/11/2 0:00", "2022/11/2 1:00", "2022/11/2 2:00", "2022/11/2 3:00", "2022/11/2 4:00", "2022/11/2 5:00", "2022/11/2 6:00", "2022/11/2 7:00", "2022/11/2 8:00", "2022/11/2 9:00", "2022/11/2 10:00", "2022/11/2 11:00", "2022/11/2 12:00", "2022/11/2 13:00", "2022/11/2 14:00", "2022/11/2 15:00", "2022/11/2 16:00", "2022/11/2 17:00", "2022/11/2 18:00", "2022/11/2 19:00", "2022/11/2 20:00", "2022/11/2 21:00", "2022/11/2 22:00", "2022/11/2 23:00", "2022/11/3 0:00", "2022/11/3 1:00", "2022/11/3 2:00", "2022/11/3 3:00", "2022/11/3 4:00", "2022/11/3 5:00", "2022/11/3 6:00", "2022/11/3 7:00", "2022/11/3 8:00", "2022/11/3 9:00", "2022/11/3 10:00", "2022/11/3 11:00", "2022/11/3 12:00", "2022/11/3 13:00", "2022/11/3 14:00", "2022/11/3 15:00", "2022/11/3 16:00", "2022/11/3 17:00", "2022/11/3 18:00", "2022/11/3 19:00", "2022/11/3 20:00", "2022/11/3 21:00", "2022/11/3 22:00", "2022/11/3 23:00"]
      }
    ],
    yAxis: [
      {
        type: 'value',
        max: 1000,  // 设置Y轴的最大值
        axisLabel: {
          color: '#fff',
          fontSize: '14'
        },
        splitLine: {
          show: false
        },
        axisLine: {
          show: true
        },
        nameLocation: 'end',
        nameTextStyle: {
          color: '#fff',
          fontFamily: 'FZLTHK--GBK1-0',
          fontSize: '14'
        },
        name: '',//单位
        splitNumber: 5  // 这里可以调整网格线的数量，使得网格更加适合新的最大值
      }
    ],

    series: [
      {
        name: '实际盐度',
        type: 'line',
        smooth: false,
        //areaStyle: {},
        // stack: 'Total',
        label: {
          show: false,
          // 标签的文字。
          color: '#11d932',
          fontWeight: 'bolder',
          fontSize: '16',
          position: 'top',
          fontFamily: 'DIN Condensed'
        },
        emphasis: {
          focus: 'series'
        },
        data: [661.34753, 716.72003, 938.495, 595.92749, 525.23755, 315.64502, 183.12671, 95.10004, 56.98248, 39.02509, 33.92499, 34.04004, 34.04004, 34.16003, 34.30756, 34.48004, 34.57001, 34.53998, 34.63, 34.53998, 24.815, 34.51007, 57.39258, 152.98755, 461.60004, 486.88501, 609.33337, 665.57001, 427.82254, 258.10754, 151.37756, 79.04498, 62.08252, 51.85498, 49.76331, 45.93756, 45.96759, 45.96759, 46.935, 45.94006, 46.99005, 45.995, 42.01001, 30.0, 30.02997, 34.26007, 35.245, 92.11005, 361.4675, 449.15002, 533.40753, 892.82251, 502.035, 382.44003, 196.20001, 96.76001, 52.91248, 50.77002, 45.84753, 45.94006, 45.96759, 42.30499, 46.29004, 46.40747, 47.57751, 42.53748, 38.46753, 33.57501, 30.29004, 30.20258, 30.12006, 163.21002],
        symbolSize: 3,
        lineStyle: {
          color: 'rgba(255, 140, 0,1)'
        },
        itemStyle: {
          normal: {
            color: 'rgba(255, 140, 0,1)'
          }
        },
        zlevel: 1
      },
      {
        name: '预测盐度',
        type: 'line',
        smooth: false,
        //areaStyle: {},
        // stack: 'Total',
        label: {
          show: false,
          // 标签的文字。
          color: '#11d932',
          fontWeight: 'bolder',
          fontSize: '16',
          position: 'top',
          fontFamily: 'DIN Condensed'
        },
        emphasis: {
          focus: 'series'
        },
        data: [877.54291, 933.50397, 840.12378, 806.06818, 782.95337, 720.2605, 556.44458, 404.59348, 285.25775, 233.6972, 202.38214, 188.18805, 198.52448, 227.90582, 241.13812, 242.86279, 230.59729, 202.49054, 177.03827, 162.42139, 160.92407, 168.11206, 218.63275, 349.23148, 588.104, 650.55493, 737.52258, 630.90863, 573.86792, 512.75708, 374.17767, 259.77283, 203.1933, 177.30414, 166.60608, 164.08923, 164.68695, 162.55719, 161.39233, 149.69397, 148.51019, 149.7876, 148.30737, 148.66431, 147.22144, 151.75067, 159.95807, 206.24738, 392.86716, 502.96021, 527.84631, 519.22168, 484.23203, 447.5687, 326.5542, 232.74506, 192.69904, 178.78363, 174.22192, 171.237, 170.6427, 169.41473, 169.67725, 162.92188, 159.48962, 157.95636, 155.23071, 148.8689, 147.59332, 148.05933, 149.31854, 174.37885],
        symbolSize: 3,
        lineStyle: {
          color: 'rgba(30, 144, 255,1)'
        },
        itemStyle: {
          normal: {
            color: 'rgba(30, 144, 255,1)'
          }
        },
        zlevel: 1,
        markArea: {
          itemStyle: {
            color: 'rgba(255, 191, 0, 0.4)'
          },
          data: [
            [
              {
                name: '取水时间',
                xAxis: '2022/11/1 9:00'
              },
              {
                xAxis: '2022/11/1 22:00'
              }
            ],
            [
              {
                name: '取水时间',
                xAxis: '2022/11/2 8:00'
              },
              {
                xAxis: '2022/11/2 23:00'
              }
            ],
            [
              {
                name: '取水时间',
                xAxis: '2022/11/3 7:00'
              },
              {
                xAxis: '2022/11/3 23:00'
              }
            ]
          ]
        }
      },
      {
        name: '盐度超标线',
        type: 'line',
        data: [250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0],
        symbolSize: 0,
        lineStyle: {
          color: 'rgba(255, 0, 0,0.5)',
          type: 'dashed',
          width: 2,
          dashPattern: [20, 40] // 增加虚线的虚实间隔
        },
        itemStyle: {
          normal: {
            color: 'rgba(178, 34, 34,1)'
          }
        },
        zlevel: 1
      }

    ]
  };
  waterdata.setOption(options);
}
const closeEcharts = () => {
  showEcharts.value = false;
}
// 实时数据
const Realtimedata = () => {
  if (selectValue.value == '') {
    ElMessage({
      message: '请选择站点',
      type: 'warning',
    })
    return
  }
}
// 样例数据
const fileInput = ref(null);
const uploadSampleData = () => {
  if (selectValue.value == '') {
    ElMessage({
      message: '请选择站点',
      type: 'warning',
    })
    return
  }
  fileInput.value.click();
};
// 上传文件
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = jsonData[0];
    const rows = jsonData.slice(1)[0];
    console.log(headers);
    console.log(rows);
    tableData.value = rows;
  };
  reader.readAsArrayBuffer(file);
};
// 选择预测范围
const getdayradio = () => {
  tableData.value = ["", "", "", "", "", "", ""];
}
// 手动输入
const Manualentry = () => {
  if (selectValue.value == '') {
    ElMessage({
      message: '请选择站点',
      type: 'warning',
    })
    return
  }
}
// 驱动模型
const drive = () => {
  const isTableDataEmpty = tableData.value.some(item => item === "");
  if (isTableDataEmpty) {
    ElMessage({
      message: '表格数据不能为空，请填写完整',
      type: 'warning',
    })
    return
  } else {
    showEcharts.value = true;
    init();
  }
}
onMounted(() => {

});
onBeforeUnmount(() => {
  if (waterdata) {
    waterdata.dispose();
  }
});
</script>

<style scoped>
.leftbox {
  position: absolute;
  top: 100px;
  left: 30px;
}

.leftbox-middle {
  width: 500px;
  height: 705px;
  background-image: url("../../assets/image/框-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;
  padding: 20px;
  box-sizing: border-box;
  color: #b7cffc;
}

.leftbox-top-title {
  width: 100%;
  height: 33px;
  background-image: url("../../assets/image/title.png");
  background-repeat: no-repeat;
  background-size: 140% 100%;
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

.leftbox-echarts-top-title {
  width: 100%;
  height: 33px;
  background-image: url("../../assets/image/title.png");
  background-repeat: no-repeat;
  background-size: 80% 100%;
}

.leftbox-echarts-top-title span {
  font-family: PangMenZhengDao;
  font-size: 20px;
  color: #b7cffc;
  margin-left: 80px;
}

.leftbox-echarts-top-title span:nth-child(2) {
  font-size: 12px;
}

.leftbox-middle-content-top {
  display: flex;
  align-items: center;
  height: 32px;
  margin-top: 20px;
  color: #b7cffc;
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

:deep(.el-radio.el-radio--large) {
  height: auto;
}

:deep(.el-radio.el-radio--large .el-radio__label) {
  color: #b7cffc;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #0a6adf;
  background: #0a6adf;
}

:deep(.el-radio__inner) {
  border: none;
}

.leftbox-middle-content-top-raido {
  margin-top: 20px;
  color: #b7cffc;
  height: 32px;
  display: flex;
  align-items: center;
}

.ml-4 {
  width: 80%;
  display: flex;
  justify-content: space-evenly;
  height: 32px;
}

.leftbox-middle-content-middle {
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
}

.buttonbox {
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.buttonstyle {
  border-radius: 0;
  background-color: #0a6adf;
  border: 0;
}

.leftbox-table {
  margin-top: 20px;
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

#leftbox-content {
  width: 800px;
  height: 500px;
}

.leftbox-echarts-middle {
  width: 880px;
  height: 600px;
  background-image: url("../../assets/image/框-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  box-sizing: border-box;
}

.closeimg {
  position: absolute;
  width: 20px;
  height: 20px;
  right: 25px;
  top: 20px;
  cursor: pointer;
}

.custom-table {
  border-collapse: collapse;
  width: 100%;
}

.custom-table th,
.custom-table td {
  border: 1px solid #416491;
  padding: 8px;
  text-align: center;
  height: 40px;
  width: 50%;
}
</style>
