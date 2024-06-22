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
                    style="position: relative; z-index: 1;width:1600px;">
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
import { callUIInteraction } from "../../module/webrtcVideo/webrtcVideo.js";

const timePick = ref(new Date());
const timePlay = ref(dayjs().startOf('day').valueOf())
const activeTab = ref('')
const activePlay = ref('')
const showEcharts = ref(false)
let lastClickedTab = '';

const toggleBox = (tab) => {
    let tabName = '';
    if (activeTab.value === tab && lastClickedTab === tab) {
        activeTab.value = '';
    } else {
        activeTab.value = tab;
        if (tab === 'top') {
            tabName = '河道中心断面';
        } else if (tab === 'bottom') {
            tabName = '自定义绘制断面';
        }
        callUIInteraction({
            function: '咸潮模拟/' + tabName,
        });
        console.log(tabName);
    }
    lastClickedTab = tab;
}



const Backoff = () => {
    timePlay.value = dayjs(timePlay.value).subtract(3, 'hour').valueOf();
}
const togglePlay = () => {
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
    timePlay.value = dayjs(timePlay.value).add(3, 'hour').valueOf();
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
    min.value = selectedDate.startOf('day').valueOf();
    max.value = selectedDate.endOf('day').valueOf();
    timePlay.value = selectedDate.startOf('day').valueOf();
});
const firstSpanText = ref('');
const secondSpanText = ref('');

const anewtop = () => {

}
const finishtop = () => {
    showEcharts.value = true;
    firstSpanText.value = '河道中心断面';
    secondSpanText.value = 'river center section';
}
const anewbottom = () => {

}
const finishbottom = () => {
    showEcharts.value = true;
    firstSpanText.value = '自定义绘制断面';
    secondSpanText.value = 'Customize section';
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
        grid: { x: 10, y: 10, x2: 10, y2: 1, containLabel: true },
        title: {
            text: '平岗站24盐度预报结果',//平岗站24盐度预报结果
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
            bottom: '10%',
            top: '15%',
            right: '8%',
            left: '12%',
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
                zlevel: 1
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
            },
            {
                name: '盐度',
                type: 'bar',
                data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 250.0, 0.0, 0.0, 0.0],
                symbolSize: 0,
                lineStyle: {
                    color: 'rgba(255, 0, 0,0.5)',
                    type: 'dashed',
                    width: 2,
                    dashPattern: [20, 40] // 增加虚线的虚实间隔
                },
                itemStyle: {
                    normal: {
                        color: 'rgba(178, 164, 34,1)'
                    }
                },
                zlevel: 1
            },
        ],
    };
    waterdata.setOption(options);
}
onMounted(() => {
    init();
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
