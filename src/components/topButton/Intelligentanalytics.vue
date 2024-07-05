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
          <el-select v-model="selectValue" placeholder="请选择站点" style="width: 380px" popper-class="blueBack"
            @change="getselect">
            <el-option v-for="item in selectoptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="leftbox-middle-content-top-raido">
          <span>预测范围：</span>
          <el-radio-group v-model="dayradio" class="ml-4" @change="getdayradio">
            <el-radio value="1天(逐时预报)" size="large" :disabled="disable1Day"
              style="width: 115px;margin: 0">1天(逐时预报)</el-radio>
            <el-radio value="3天(逐日预报)" size="large" style="width: 115px;margin: 0">3天(逐日预报)</el-radio>
            <el-radio value="7天(逐日预报)" size="large" style="width: 115px;margin: 0">7天(逐日预报)</el-radio>
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
            <tr v-show="dayradio === '1天(逐时预报)'" v-for="(item, index) in tableHeaders.day1" :key="index">
              <td>{{ item }}</td>
              <td v-if="!editing">{{ tableData[index] }}</td>
              <td v-else><el-input v-model="tableData[index]" /></td>
            </tr>
            <tr v-show="dayradio === '3天(逐日预报)' || dayradio === '7天(逐日预报)'"
              v-for="(item, index) in tableHeaders.day2or3" :key="index">
              <td>{{ item }}</td>
              <td v-if="!editing">{{ tableData[index] }}</td>
              <td v-else><el-input v-model="tableData[index]" /></td>
            </tr>
          </table>
          <div>
            <div v-if="editing" style="margin-top: 20px;">
              <el-button class="buttonstyle" type="primary" @click="addData">保存</el-button>
              <el-button style="margin-left: 20px" class="buttonstyle" type="primary" @click="closeData">取消</el-button>
            </div>
            <el-button class="buttonstyles" type="primary" @click="drive">驱动模型</el-button>
          </div>
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
      <div style="display: flex;align-items: center;justify-content: center;margin-top: 26px;">
        <el-button class="uploadbuttonstyle" type="primary" @click="downloadChart">下载图表</el-button>
        <div id="leftbox-content"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts";
import * as XLSX from "xlsx";
import axios from "axios";
import { ElMessage } from 'element-plus'
import { ElLoading } from 'element-plus'
import { callUIInteraction, addResponseEventListener, } from "../../module/webrtcVideo/webrtcVideo.js";

const selectValue = ref("");
const selectoptions = [
  { value: "平岗泵站", label: "平岗泵站" },
  { value: "广昌泵站", label: "广昌泵站" },
  { value: "竹洲头泵站", label: "竹洲头泵站" },
  { value: "灯笼山水闸", label: "灯笼山水闸" },
  { value: "全禄水厂", label: "全禄水厂" },
];
const tableData = ref(["", "", "", "", "", "", ""]);
const originalTableData = ref([...tableData.value]);
const dayradio = ref("1天(逐时预报)");
const yesDayradio = ref('')
const showEcharts = ref(false)
const disable1Day = ref(false);
const editing = ref(false);
const tableHeaders = {
  day1: ["实时盐度", "前1小时盐度", "前2小时盐度", "提前24小时三灶潮位", "提前48小时马口径流", "提前24小时u方向风速", "提前24小时v方向风速"],
  day2or3: ["今日最大盐度", "昨日最大盐度", "前日最大盐度", "今日三灶日最低潮位", "今日澳门风速", "今日马口平均流量", "今日潮波不对称性因子"]
};
// 监听选择的预测范围
watch(selectValue, (newValue) => {
  if (newValue === "平岗泵站" || newValue === "广昌泵站") {
    dayradio.value = "1天(逐时预报)";
    yesDayradio.value = "1天(逐时预报)";
    disable1Day.value = false;
  } else if (newValue === "竹洲头泵站" || newValue === "灯笼山水闸" || newValue === "全禄水厂") {
    dayradio.value = "3天(逐日预报)";
    yesDayradio.value = "3天(逐日预报)";
    disable1Day.value = true;
  }
});
// 监听选择的站点
const selectmessage = ref()
const getselect = (e) => {
  tableData.value = ["", "", "", "", "", "", ""];
  selectmessage.value = e;
  callUIInteraction({
    function: "智能分析_站点/" + e,
  });
}
// 初始盐度超标线的值
const markLineYAxis = ref(250);
const showWidth = ref(2000);
// echarts图表数据
let waterdata = null;
const init = (data) => {
  const now = new Date();
  let newAxisData;
  let seriesData;
  if (dayradio.value === '1天(逐时预报)') {
    const currentHour = now.getHours();
    const nextHour = (currentHour + 1) % 24;
    newAxisData = Array.from({ length: 24 }, (_, i) => `${(nextHour + i) % 24}:00`);
    seriesData = data;
  } else if (dayradio.value === '3天(逐日预报)') {
    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1; // getMonth() 返回值范围为 0-11
    newAxisData = Array.from({ length: 3 }, (_, i) => {
      const date = new Date(now);
      date.setDate(currentDay + i + 1);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    });
    seriesData = data.slice(0, 3);
  }
  const waterChartElement = document.getElementById("leftbox-content");
  if (waterdata) {
    waterdata.dispose();
  }
  waterdata = echarts.init(waterChartElement);

  let markAreaData = [];
  let start = null;
  for (let i = 0; i < seriesData.length; i++) {
    if (seriesData[i] < markLineYAxis.value) {
      if (start === null) {
        start = i;
      }
    } else {
      if (start !== null) {
        markAreaData.push([{ xAxis: `${newAxisData[start]}` }, { xAxis: `${newAxisData[i - 1]}` }]);
        start = null;
      }
    }
  }
  if (start !== null) {
    markAreaData.push([{ xAxis: `${newAxisData[start]}` }, { xAxis: `${newAxisData[newAxisData.length - 1]}` }]);
  }

  const minValue = Math.min(...seriesData);
  const maxValue = Math.max(...seriesData);

  const options = {
    title: {
      text: selectValue.value + yesDayradio.value,
      left: 'center',
      textStyle: {
        color: '#b7cffc',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: [
      {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#b7cffc'
          }
        },
        axisLabel: {
          textStyle: {
            color: "#b7cffc",
            fontSize: 14,
          },
        },
        axisTick: { show: false },
        boundaryGap: false,
        data: newAxisData,
      }
    ],
    yAxis: [
      {
        id: '2',
        type: 'value',
        min: minValue - 10,
        max: maxValue + 10,
        axisLabel: {
          show: true,
          textStyle: {
            color: "#b7cffc",
            fontSize: 14,
          },
          formatter: function (value, index) {
            return value.toFixed(0);
          }
        },
        splitLine: {
          show: false
        },
        axisLine: {
          show: true
        },
        nameLocation: 'end',
        nameTextStyle: {
          color: '#b7cffc',
          fontFamily: 'FZLTHK--GBK1-0',
          fontSize: '14'
        },
        name: 'mg/L',
        splitNumber: 5
      }
    ],
    series: [
      {
        id: 'bbb',
        name: '预测盐度',
        type: 'line',
        smooth: false,
        label: {
          show: false,
          color: '#11d932',
          fontWeight: 'bolder',
          fontSize: '16',
          position: 'top',
          fontFamily: 'DIN Condensed'
        },
        emphasis: {
          focus: 'series'
        },
        data: seriesData,
        symbolSize: 3,
        itemStyle: {
          normal: {
            color: '#1E90FF'
          }
        },
        lineStyle: {
          width: 5
        },
        zlevel: 1,
        markArea: {
          itemStyle: {
            color: 'rgba(255, 173, 177, 0.4)'
          },
          data: markAreaData
        }
      },
      {
        id: 'aaa',
        name: '盐度超标线',
        type: 'line',
        markLine: {
          animation: false,
          symbol: ['none', 'none'],
          label: {
            show: true,
            color: '#FF0000',
            formatter: (params) => { return "" + params.value.toFixed(0) },
            fontSize: 16,
            fontWeight: 600
          },
          lineStyle: {
            color: '#FF0000',
            width: 2,
            type: 'dashed',
            dashPattern: [20, 40]
          },
          data: [{ yAxis: markLineYAxis.value }]
        },
        symbolSize: 0,
        itemStyle: {
          normal: {
            color: 'rgba(178, 34, 34,1)'
          }
        },
        zlevel: 1
      }
    ],
    grid: {
      bottom: 40,
      top: 40,
      right: 40,
      left: 40
    },
  };

  waterdata.setOption(options);
  showWidth.value = window.innerWidth || document.documentElement.clientWidth;
  const option2 = {
    graphic: {
      type: 'rect',
      z: 100,
      shape: {
        width: showWidth.value,
        height: 0
      },
      position: [0, waterdata.convertToPixel({ yAxisId: '2' }, markLineYAxis.value)],
      draggable: true,
      style: {
        fill: 'rgba(0,0,0,0)',
        stroke: 'rgba(0,0,0,0)',
        lineWidth: 10
      },
      cursor: 'move',
      ondrag: onPointDragging
    }
  };
  waterdata.setOption(option2);

  function onPointDragging() {
    let yAxis = waterdata.convertFromPixel({ yAxisId: '2' }, this.position[1]);
    markLineYAxis.value = yAxis;
    markAreaData = [];
    start = null;
    for (let i = 0; i < seriesData.length; i++) {
      if (seriesData[i] < markLineYAxis.value) {
        if (start === null) {
          start = i;
        }
      } else {
        if (start !== null) {
          markAreaData.push([{ xAxis: `${newAxisData[start]}` }, { xAxis: `${newAxisData[i - 1]}` }]);
          start = null;
        }
      }
    }
    if (start !== null) {
      markAreaData.push([{ xAxis: `${newAxisData[start]}` }, { xAxis: `${newAxisData[newAxisData.length - 1]}` }]);
    }
    waterdata.setOption({
      series: [{
        id: 'aaa',
        markLine: {
          data: [{ yAxis: yAxis }],
        }
      }, {
        id: 'bbb',
        markArea: {
          data: markAreaData
        }
      }]
    });
  }
}
// 关闭驱动模型的图表
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
// 上传文件并读取显示到表格中
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
    tableData.value = rows;
    // 清空文件输入元素
    event.target.value = "";
  };
  reader.readAsArrayBuffer(file);
};
// 监听选择的预测范围
const getdayradio = (e) => {
  yesDayradio.value = e
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
  originalTableData.value = [...tableData.value];
  editing.value = true;
}
// 手动输入保存
const addData = () => {
  ElMessage({
    message: '保存成功',
    type: 'success',
  })
  editing.value = false;
};
// 手动输入取消
const closeData = () => {
  tableData.value = [...originalTableData.value];
  editing.value = false;
};
// 驱动模型
const drive = () => {
  showEcharts.value = false;
  const isTableDataEmpty = tableData.value.some(item => item === "");
  if (isTableDataEmpty) {
    ElMessage({
      message: '表格数据不能为空，请填写完整',
      type: 'warning',
    })
    return
  } else if (editing.value) {
    ElMessage({
      message: '请保存后驱动模型',
      type: 'warning',
    })
    return
  } else {
    const loading = ElLoading.service({
      lock: true,
      text: '正在努力生成中...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    if (dayradio.value == '1天(逐时预报)') {
      axios.get( window.VITE_APP_BASE_API + `PG_24h?s1=${tableData.value[0]}&s2=${tableData.value[1]}&s3=${tableData.value[2]}&sanzao=${tableData.value[3]}&makou=${tableData.value[4]}&macao_u=${tableData.value[5]}&macao_v=${tableData.value[6]}`).then((res) => {
        showEcharts.value = true;
        init(res.data.forecast_values);
        loading.close()
      })
    } else if (dayradio.value == '3天(逐日预报)') {
      let selectname;
      if (selectmessage.value === '平岗泵站') {
        selectname = 'PG';
      } else if (selectmessage.value === '广昌泵站') {
        selectname = 'GC';
      } else if (selectmessage.value === '竹洲头泵站') {
        selectname = 'ZZT';
      } else if (selectmessage.value === '灯笼山水闸') {
        selectname = 'DLS';
      } else if (selectmessage.value === '全禄水厂') {
        selectname = 'QL';
      }
      axios.get( window.VITE_APP_BASE_API + `${selectname}_3d?s1=${tableData.value[0]}&s2=${tableData.value[1]}&s3=${tableData.value[2]}&sanzao=${tableData.value[3]}&macao=${tableData.value[4]}&makou=${tableData.value[5]}&sk=${tableData.value[6]}`).then((res) => {
        showEcharts.value = true;
        init(res.data.forecast_values);
        loading.close()
      })
    } else if (dayradio.value == '7天(逐日预报)') {
      console.log(7);
    }
  }
}
// 下载图表
const downloadChart = () => {
  if (!waterdata) {
    ElMessage({
      message: '图表未生成',
      type: 'warning',
    });
    return;
  }
  const url = waterdata.getDataURL({
    type: 'png',
    backgroundColor: '#1c446e',
  });
  const a = document.createElement('a');
  a.href = url;
  a.download = selectValue.value + yesDayradio.value + '.png';
  a.click();
};

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
  left: 20px;
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

.buttonstyles {
  margin-top: 20px;
  margin-left: 372px;
  border-radius: 0;
  background-color: #0a6adf;
  border: 0;
  position: absolute;
  right: 20px;
  bottom: 24px;
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

:deep(.el-input__wrapper) {
  background-color: #041831;
  border-radius: 0;
  box-shadow: 0 0 0 1px #416491 inset;
}

:deep(.el-input__inner) {
  color: #b7cffc;
  text-align: center;
}

.active {
  margin-left: 238px;
}

.uploadbuttonstyle {
  border-radius: 0;
  background-color: #0a6adf;
  border: 0;
  position: absolute;
  top: 20px;
  right: 100px;
}
</style>
