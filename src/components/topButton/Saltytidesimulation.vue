<template>
    <div>
        <div class="top-leftbox">
            <div class="top-leftbox-top" :class="{ active: activeTab === 'top' }" @click="toggleBox('top')">
                <img :src="activeTab === 'top' ? '/src/assets/image/表层渲染-浅蓝.png' : '/src/assets/image/表层渲染-深蓝.png'"
                    alt="" class="top-leftbox-img">
                <span class="top-span">表层渲染</span>
            </div>
            <div class="top-leftbox-middle" :class="{ active: activeTab === 'middle' }" @click="toggleBox('middle')">
                <img :src="activeTab === 'middle' ? '/src/assets/image/断面分析-浅蓝.png' : '/src/assets/image/断面分析-深蓝.png'"
                    alt="" class="top-leftbox-img2">
                <span class="top-span">断面分析</span>
            </div>
            <div class="top-leftbox-bottom" :class="{ active: activeTab === 'bottom' }" @click="toggleBox('bottom')">
                <img :src="activeTab === 'bottom' ? '/src/assets/image/体渲染-浅蓝.png' : '/src/assets/image/体渲染-深蓝.png'"
                    alt="" class="top-leftbox-img3">
                <span>体渲染</span>
            </div>
            <div class="top-leftbox-middle-content" v-show="showtransversals">
                <span>断面选择</span>
                <div class="top-leftbox-middle-content-div">
                    <el-select v-model="transversalsvalue" placeholder="Select" style="width: 160px"
                        @change="getselect">
                        <el-option v-for="item in transversalsoptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <div style="width:100%;display: flex;align-items: center;justify-content: center;margin-top: 20px;">
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
                        <el-slider v-model="Zaxis" style="width: 120px;margin-left: 10px;" @change="getZaxis" :min="0"
                            :max="1" :step="0.01" />
                    </div>
                    <div class="top-leftbox-middle-content-div-2-content">
                        <span class="top-leftbox-middle-content-div-2-span">特征阈值</span>
                        <el-slider v-model="threshold" style="width: 120px;margin-left: 10px;" @change="getthreshold"
                            :min="0" :max="1" :step="0.01" />
                    </div>
                </div>
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
                    <img class="closeimg" src="../../assets/image/close.png" alt="" @click="closeEcharts">
                </div>
                <div id="transversalsEcharts">
                    <img :src="transversalsEchartsimg" alt="" style="width: 100%;height:98%;">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import * as echarts from "echarts";
import { callUIInteraction, addResponseEventListener } from "../../module/webrtcVideo/webrtcVideo.js";

const timePick = ref(new Date());
const timePlay = ref(dayjs().startOf('day').valueOf())
const activeTab = ref('middle')
const activePlay = ref('')
const showEcharts = ref(false)
const showtransversals = ref(true)
const Zaxis = ref(0)
const threshold = ref(0)
const transversalsEchartsimg = ref('/src/assets/dataImg/1aa4dcbb0bdeecd96083f41e35f910e.png')
const transversalsvalue = ref('河道中心断面')
const transversalsoptions = [
    {
        value: '河道中心断面',
        label: '河道中心断面',
    },
    {
        value: '自定义绘制断面',
        label: '自定义绘制断面',
    }
]
let lastClickedTab = '';
const toggleBox = (tab) => {
    if (activeTab.value === tab) {
        activeTab.value = '';
        if (tab === 'top') {
            callUIInteraction({
                function: '咸潮模拟_表层渲染/false',
            });
            console.log('咸潮模拟_表层渲染/false');
        } else if (tab === 'middle') {
            callUIInteraction({
                function: '咸潮模拟_断面分析/false',
            });
            console.log('咸潮模拟_断面分析/false');
        } else if (tab === 'bottom') {
            callUIInteraction({
                function: '咸潮模拟_体渲染/false',
            });
            console.log('咸潮模拟_体渲染/false');
        }
    } else {
        activeTab.value = tab;
        let tabName = '';
        if (tab === 'top') {
            tabName = '表层渲染';
            showEcharts.value = false;
            showtransversals.value = false;
        } else if (tab === 'middle') {
            tabName = '断面分析';
            showtransversals.value = true;
        } else if (tab === 'bottom') {
            tabName = '体渲染';
            showEcharts.value = false;
            showtransversals.value = false;
        }
        callUIInteraction({
            function: '咸潮模拟_' + tabName + '/true',
        });
        console.log('咸潮模拟_' + tabName + '/true');
    }
    lastClickedTab = tab;
}
const getselect = (e) => {
    callUIInteraction({
        function: e,
    });
}
const imagePaths = [
    '/src/assets/dataImg/89414d47203f8e5fd56cf15b9520970.png',
    '/src/assets/dataImg/f11baccb8e23beb13656810a1757a87.png',
    '/src/assets/dataImg/1aa4dcbb0bdeecd96083f41e35f910e.png'
];
let currentImagePathIndex = 0;
const updateImage = () => {
    transversalsEchartsimg.value = imagePaths[currentImagePathIndex];
}
const Backoff = () => {
    const previousTime = timePlay.value;
    timePlay.value = dayjs(previousTime).subtract(3, 'hour').valueOf();
    callUIInteraction({
        function: '咸潮模拟时间轴/' + dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'),
    });
    // console.log("倒退:", dayjs(timePlay.value).format('YYYY-MM-DD HH:mm:ss'));
    transversalsEchartsimg.value = imagePaths[currentImagePathIndex];
    currentImagePathIndex = (currentImagePathIndex - 1 + imagePaths.length) % imagePaths.length;
    updateImage()
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
    transversalsEchartsimg.value = imagePaths[currentImagePathIndex];
    currentImagePathIndex = (currentImagePathIndex + 1) % imagePaths.length;
    updateImage()
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
    if (activePlay.value = 'play') {
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
    if (transversalsvalue.value === '河道中心断面') {
        callUIInteraction({
            function: '河道中心断面_重新绘制',
        });
        console.log('河道');
    } else {
        callUIInteraction({
            function: '自定义绘制断面_重新绘制',
        });
        console.log('自定义');
    }
}
const finishtop = () => {
    if (transversalsvalue.value === '河道中心断面') {
        showEcharts.value = true;
        firstSpanText.value = '河道中心断面';
        secondSpanText.value = 'river center section';
        callUIInteraction({
            function: '河道中心断面_完成',
            // init();
        });
        console.log('河道');
    } else {
        callUIInteraction({
            function: '自定义绘制断面_完成',
        });
        console.log('自定义');
    }
}

const closeEcharts = () => {
    showEcharts.value = false;
}
const getZaxis = (e) => {
    callUIInteraction({
        function: 'Z轴剖切_' + e,
    });
    console.log(e);
}
const getthreshold = (e) => {
    callUIInteraction({
        function: '特征阈值' + e,
    });
    console.log(e);
}
const showVolumerendering = computed(() => {
    return activeTab.value === 'bottom';
});
// let waterdata = null;
// const init = () => {
//     const waterChartElement = document.getElementById("transversalsEcharts");
//     if (waterdata) {
//         waterdata.dispose();
//     }
//     waterdata = echarts.init(waterChartElement);
//     const options = {
//         
//     };
//     waterdata.setOption(options);
// }
const myHandleResponseFunction = (data) => {
    console.log(data);
}
onMounted(() => {
    // init();
    addResponseEventListener("handle_responses", myHandleResponseFunction);
    callUIInteraction({
        function: '咸潮模拟_断面分析/true',
    });
});
onBeforeUnmount(() => {
    // if (waterdata) {
    //     waterdata.dispose();
    // }
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
    background-image: url('../../assets/image/二级按钮.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-size: 24px;
    font-family: YouSheBiaoTiHei;
    font-weight: 400;
    color: #D4E1FF;
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
    background-image: url('../../assets/image/二级按钮-选中.png');
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
    background-image: url('../../assets/image/弹框.png');
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
    background-image: url('../../assets/image/弹框.png');
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
}

:deep(.el-input__suffix-inner) {
    display: none !important;
}

.bottombox-Backoff {
    background-image: url('../../assets/img/Backoff.png');
    background-repeat: no-repeat;
    background-color: #42AEFF;
    background-position: center;
    border-radius: 100%;
    border: 0;
    width: 30px;
    height: 30px;
}

.bottombox-play {
    background-image: url('../../assets/img/Timeout.png');
    background-repeat: no-repeat;
    background-color: #42AEFF;
    background-position: 55% 50%;
    border-radius: 100%;
    border: 0;
    width: 40px;
    height: 40px;
}

.bottombox-play.active {
    background-image: url('../../assets/img/Play.png');
    background-repeat: no-repeat;
    background-color: #42AEFF;
    background-position: center;
    background-size: 70% 70%;
    border-radius: 100%;
    border: 0;
    width: 40px;
    height: 40px;
}

.bottombox-Fastforward {
    background-image: url('../../assets/img/Fastforward.png');
    background-repeat: no-repeat;
    background-color: #42AEFF;
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
    background-color: #42AEFF;
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
    background-color: #42AEFF;
}

.topbutton {
    border-radius: 0;
    background-color: #0a6adf;
    border: 0;
}

#transversalsEcharts {
    display: flex;
    align-items: center;
    width: 860px;
    height: 430px;
}

.leftbox-middle {
    width: 900px;
    height: 500px;
    background-image: url('../../assets/image/框-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-top: 20px;
    padding: 20px;
    box-sizing: border-box;
}

.leftbox-top-title {
    width: 930px;
    height: 33px;
    background-image: url('../../assets/image/title.png');
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
    right: 24px;
    top: 35px;
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
    background-color: #00A8D2;
}

.top-leftbox-middle-content-2:deep(.el-slider__bar) {
    height: 2px;
    background-color: #00A8D2;
}

.top-leftbox-middle-content-2:deep(.el-slider__button) {
    background-color: transparent;
    border: 0;
    background-image: url('../../assets/img/slipPoint_icon.png');
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

</style>
