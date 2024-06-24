<template>
    <div>
        <div class="top-leftbox">
            <div class="top-leftbox-top" :class="{ active: activeTab === 'top' }" @click="toggleBox('top')">
                河道中心断面
            </div>
            <div class="top-leftbox-top-set" :style="{ height: activeTab === 'top' ? '53px' : '0' }">
                <el-button type="primary" class="topbutton" @click="anewtop">重新绘制</el-button>
                <el-button type="primary" class="topbutton" @click="finishtop">完成</el-button>
            </div>
            <div class="top-leftbox-bottom" :class="{ active: activeTab === 'bottom' }" @click="toggleBox('bottom')">
                自定义绘制断面
            </div>
            <div class="top-leftbox-bottom-set" :style="{ height: activeTab === 'bottom' ? '53px' : '0' }">
                <el-button type="primary" class="topbutton" @click="anewbottom">重新绘制</el-button>
                <el-button type="primary" class="topbutton" @click="finishbottom">完成</el-button>
            </div>
        </div>
        <div class="bottomCalendar">
            <el-date-picker v-model="timePick" type="date" :editable="false" />
        </div>
        <div class="bottombox-button">
            <el-button type="primary" class="bottombox-Backoff" @click="Backoff"></el-button>
            <el-button type="primary" class="bottombox-play" :class="{ active: activePlay === 'play' }"
                @click="togglePlay"></el-button>
            <el-button type="primary" class="bottombox-Fastforward" @click="Fastforward"></el-button>
        </div>
        <div class="bottombox">
            <div class="bottombox-slider">
                <div :style="style">
                    <span class="bottombox-slider-span">{{ formattedTime }}</span>
                </div>
                <el-slider :step="30" v-model="timePlay" :show-tooltip="false" :min="min" :max="max"
                    style="position: relative; z-index: 1;width:1600px;" @change="gettimePlay">
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
        <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);">
            <div class="leftbox-middle" v-show="showEcharts">
                <div class="leftbox-top-title">
                    <span>{{ firstSpanText }}</span>
                    <span>{{ secondSpanText }}</span>
                    <img class="closeimg" src="../../assets/img/close.png" alt="" @click="closeEcharts">
                </div>
                <div id="transversalsEcharts"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import * as echarts from "echarts";
import { callUIInteraction , addResponseEventListener} from "../../module/webrtcVideo/webrtcVideo.js";

const timePick = ref(new Date());
const timePlay = ref(dayjs().startOf('day').valueOf())
const activeTab = ref('')
const activePlay = ref('')
const showEcharts = ref(false)
let lastClickedTab = '';

const toggleBox = (tab) => {
    if (activeTab.value === tab) {
        activeTab.value = '';
        if (tab === 'top') {
          callUIInteraction({
            function: '咸潮模拟_河道中心断面/false',
          });
          console.log('咸潮模拟_河道中心断面/false');
        } else if (tab === 'bottom') {
          callUIInteraction({
            function: '咸潮模拟_自定义绘制断面/false',
          });
          console.log('咸潮模拟_自定义绘制断面/false');
        }
    } else {
        activeTab.value = tab;
        let tabName = '';
        if (tab === 'top') {
            tabName = '河道中心断面';
        } else if (tab === 'bottom') {
            tabName = '自定义绘制断面';
        }
        callUIInteraction({
            function: '咸潮模拟_' + tabName + '/true',
        });
        console.log('咸潮模拟_' + tabName + '/true');
    }
    lastClickedTab = tab;
}




const Backoff = () => {
    const previousTime = timePlay.value;
    timePlay.value = dayjs(previousTime).subtract(3, 'hour').valueOf();
    callUIInteraction({
        function: '咸潮模拟时间轴/' + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
    });
    // console.log("倒退:", dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'));
}
let previousPlayState = '';
const togglePlay = () => {
    previousPlayState = activePlay.value;
    activePlay.value = activePlay.value === 'play' ? '' : 'play';
    if (activePlay.value === 'play') {
        let interval = setInterval(() => {
            timePlay.value = dayjs(timePlay.value).add(1, 'minute').valueOf();
            if (activePlay.value !== 'play') {
                clearInterval(interval);
            }
        }, 16.6665);
    }
}
const Fastforward = () => {
    const previousTime = timePlay.value;
    timePlay.value = dayjs(previousTime).add(3, 'hour').valueOf();
    callUIInteraction({
        function: '咸潮模拟时间轴/' + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
    });
    // console.log("快进:", dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'));
}

const min = ref(dayjs().startOf('day').valueOf());
const max = ref(dayjs().endOf('day').valueOf());

const formattedTime = computed(() => {
    const time = dayjs(timePlay.value);
    if (time.isSame(dayjs(max.value))) {
        return dayjs(max.value).add(1, 'day').format('YYYY/MM/DD 00:00');
    } else {
        return time.format('YYYY/MM/DD HH:mm');
    }
});

const formattedMinTime = computed(() => {
    return dayjs(min.value).format('YYYY/MM/DD 00:00')
});

const formattedMinTimeAdd6 = computed(() => {
    return dayjs(min.value).add(6, 'hour').format('YYYY/MM/DD HH:mm')
});

const formattedMinTimeAdd12 = computed(() => {
    return dayjs(min.value).add(12, 'hour').format('YYYY/MM/DD HH:mm')
});

const formattedMinTimeAdd18 = computed(() => {
    return dayjs(min.value).add(18, 'hour').format('YYYY/MM/DD HH:mm')
});

const formattedMaxTime = computed(() => {
    return dayjs(max.value).add(1, 'day').format('YYYY/MM/DD 00:00')
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
    const formattedDate = selectedDate.format('YYYY-MM-DD');
    callUIInteraction({
        function: '咸潮模拟选择时间/' + formattedDate,
    });
    min.value = selectedDate.startOf('day').valueOf();
    max.value = selectedDate.endOf('day').valueOf();
    timePlay.value = selectedDate.startOf('day').valueOf();
});
watch(timePlay, (newVal) => {
    const currentTime = dayjs(newVal);
    if (currentTime.minute() === 0 && currentTime.second() === 0) {
        callUIInteraction({
        function: '咸潮模拟时间轴/' + currentTime.format('YYYY-MM-DD HH:mm:ss'),
        });
        // console.log(currentTime.format('YYYY-MM-DD HH:mm:ss'));
    }
});
const gettimePlay = (e) => {
    const clickedTime = dayjs(e).format('YYYY-MM-DD HH:mm:ss');
    if(activePlay.value = 'play'){
        activePlay.value = ''
    }
    callUIInteraction({
        function: '咸潮模拟时间轴/' + clickedTime,
    });
    // console.log(clickedTime);
}
const firstSpanText = ref('');
const secondSpanText = ref('');

const anewtop = () => {
    callUIInteraction({
        function: '河道中心断面_重新绘制',
    });
}
const finishtop = () => {
    showEcharts.value = true;
    firstSpanText.value = '河道中心断面';
    secondSpanText.value = 'river center section';
    callUIInteraction({
        function: '河道中心断面_完成',
    });
    init();
}
const anewbottom = () => {
    callUIInteraction({
        function: '自定义绘制断面_重新绘制',
    });
}
const finishbottom = () => {
    firstSpanText.value = '自定义绘制断面';
    secondSpanText.value = 'Customize section';
    callUIInteraction({
        function: '自定义绘制断面_完成',
    });
}

const closeEcharts = () => {
    showEcharts.value = false;
}
let waterdata = null;
const init = () => {
    const waterChartElement = document.getElementById("transversalsEcharts");
    if (waterdata) {
        waterdata.dispose();
    }
    waterdata = echarts.init(waterChartElement);
    const options = {
        dataset: [
        {
          dimensions: ['distance', '2', '8', '12', '18', '22'],
          source: [
            [0, -1, -0.5, -1, -2, -3],
            [10, -2, -1, -2, -2, -2],
            [20, -3, -1.5, -1.5, -2, -2],
            [30, -6, -3, -2, -1, -1],
            [40, -14, -1, 0, 0, 0],
            [50, -11, -0.3, 0, 0, 0],
            [60, -13, 0, 0, 0, 0],
            [70, -16, 0, 0, 0, 0],
            [75, -14, 0, 0, 0, 0]
          ]
        }
      ],
      color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
      title: {
        text: 'Salinity',
        left: 'center',
        textStyle: {
          fontSize: 30,
          padding: [0, 0, 0, 0] // 在这里设置间距，例如上边距为10px，其余为0
        }
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '2%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            formatter: '{value} km',
            textStyle: {
              fontSize: 15
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value} m',
            textStyle: {
              fontSize: 15
            }
          }
        }
      ],
      series: [
        {
          name: '2',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 3,
            color: "black"
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(55, 162, 255)'
              },
              {
                offset: 1,
                color: 'rgb(116, 21, 219)'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          encode: { x: 0, y: [1] }
        },
        {
          name: '8',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 3,
            color: "black"
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(0, 221, 255)'
              },
              {
                offset: 1,
                color: 'rgb(77, 119, 255)'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          encode: { x: 0, y: [2] }
        },
        {
          name: '12',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 3,
            color: "black"
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(128, 255, 165)'
              },
              {
                offset: 1,
                color: 'rgb(1, 191, 236)'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          encode: { x: 0, y: [3] }
        },
        {
          name: '18',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 3,
            color: "black"
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(255, 191, 0)'
              },
              {
                offset: 1,
                color: 'rgb(224, 62, 76)'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          encode: { x: 0, y: [4] }
        },
        {
          name: '22',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 3,
            color: "black"
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(255, 0, 135)'
              },
              {
                offset: 1,
                color: 'rgb(135, 0, 157)'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          encode: { x: 0, y: [5] }
        }

      ]
    };
    waterdata.setOption(options);
}
const myHandleResponseFunction = (data) => {
  console.log(data);
}
onMounted(() => {
    // init();
    addResponseEventListener("handle_responses", myHandleResponseFunction);
});
onBeforeUnmount(() => {
    if (waterdata) {
        waterdata.dispose();
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
.top-leftbox-bottom {
    width: 227px;
    height: 53px;
    background-image: url('../../assets/img/title02_back_default.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-family: PangMenZhengDao;
    font-size: 22px;
    color: #0093B9;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.active {
    background-image: url('../../assets/img/title01_back_active.png');
    color: #FFCC00;
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
}

:deep(.el-input__suffix-inner) {
    display: none !important;
}

.bottombox-Backoff {
    background-image: url('../../assets/img/Backoff.png');
    background-repeat: no-repeat;
    background-color: #00A8D2;
    background-position: center;
    border-radius: 100%;
    border: 0;
    width: 30px;
    height: 30px;
}

.bottombox-play {
    background-image: url('../../assets/img/Timeout.png');
    background-repeat: no-repeat;
    background-color: #00A8D2;
    background-position: 55% 50%;
    border-radius: 100%;
    border: 0;
    width: 40px;
    height: 40px;
}

.bottombox-play.active {
    background-image: url('../../assets/img/Play.png');
    background-repeat: no-repeat;
    background-color: #00A8D2;
    background-position: center;
    border-radius: 100%;
    border: 0;
    width: 40px;
    height: 40px;
}

.bottombox-Fastforward {
    background-image: url('../../assets/img/Fastforward.png');
    background-repeat: no-repeat;
    background-color: #00A8D2;
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
    background-color: #00A8D2;
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
    background-color: #00A8D2;
}

.top-leftbox-top-set,
.top-leftbox-bottom-set {
    width: 227px;
    height: 0;
    overflow: hidden;
    background-image: url('../../assets/img/title01_back_default.png');
    display: flex;
    align-items: center;
    justify-content: center;
    transition: height 0.5s;
}

.topbutton {
    background: #ffcc00;
    border: 0;
    color: #606266;
}

#transversalsEcharts {
    width: 960px;
    height: 430px;
}

.leftbox-middle {
    width: 1000px;
    height: 500px;
    background-image: url('../../assets/img/module_back_row.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-top: 20px;
    padding: 20px;
    box-sizing: border-box;
}

.leftbox-top-title {
    width: 930px;
    height: 33px;
    background-image: url('../../assets/img/module_titleback.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.leftbox-top-title span {
    font-family: PangMenZhengDao;
    font-size: 20px;
    color: #B7CFFC;
    margin-left: 80px;
}

.leftbox-top-title span:nth-child(2) {
    font-size: 12px;
}

.closeimg {
    position: absolute;
    right: 15px;
    top: 35px;
    cursor: pointer;
}
</style>
