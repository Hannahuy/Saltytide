<template>
    <div class="leftbox">
        <div class="leftbox-top">
            <div class="Weather-list-top">
                <div class="Weather-list-top-left">
                    <span>{{ currentTime }}</span>
                    <span>{{ currentDate }}</span>
                </div>
                <div class="Weather-list-top-right">
                    <span>是否实时</span>
                    <el-switch style="margin-left: 20px;" v-model="swtichvalue" inline-prompt active-text="ON"
                        inactive-text="OFF" @change="handleswtich" />
                </div>
            </div>
            <div class="leftbox-top-title" style="margin-top: 20px;">
                <span>天气模拟</span>
                <span>Weather simulation</span>
            </div>
            <div class="Weather-type-icon">
                <img src="../../assets/img/weather_sunny_icon.png" alt="Sunny"
                    :class="{ 'selected': selectedIcon === 'sunny', 'disabled': swtichvalue }"
                    @click="selectIcon('sunny')" />
                <img src="../../assets/img/heavyrain.png" alt="Heavy Rain"
                    :class="{ 'selected': selectedIcon === 'heavyrain', 'disabled': swtichvalue }"
                    @click="selectIcon('heavyrain')" />
                <img src="../../assets/img/Mediumfog.png" alt="Medium Fog"
                    :class="{ 'selected': selectedIcon === 'fog', 'disabled': swtichvalue }"
                    @click="selectIcon('fog')" />
            </div>
            <div class="Weather-type-icon-detailed">
                <img :src="weatherone" alt=""
                    :class="{ 'selected': selectedIconDetail === 'sunnyDetail', 'disabled': swtichvalue }"
                    @click="selectDetailIcon('sunnyDetail')" />
                <img :src="weathertwo" alt=""
                    :class="{ 'selected': selectedIconDetail === 'heavyrainDetail', 'disabled': swtichvalue }"
                    @click="selectDetailIcon('heavyrainDetail')" />
                <img :src="weatherthree" alt=""
                    :class="{ 'selected': selectedIconDetail === 'fogDetail', 'disabled': swtichvalue }"
                    @click="selectDetailIcon('fogDetail')" />
            </div>
            <div class="leftbox-top-content">
                <span>风强度</span>
                <img src="../../assets/img/small_icon.png" alt="" :class="{ 'disabled': swtichvalue }" class="imgbutton"
                    @click="decreaseintensity">
                <el-slider v-model="Windintensity" :disabled="swtichvalue" style="width: 240px;margin-left: 20px;"
                    @change="getWindintensity" />
                <img src="../../assets/img/big_icon.png" :class="{ 'disabled': swtichvalue }" alt="" class="imgbutton"
                    @click="addintensity">
            </div>
            <div class="leftbox-top-content">
                <span style="margin-left: 12px;">风向</span>
                <img src="../../assets/img/small_icon.png" :class="{ 'disabled': swtichvalue }" alt="" class="imgbutton"
                    @click="decreasedirection">
                <el-slider v-model="Winddirection" :disabled="swtichvalue" style="width: 240px;margin-left: 20px;"
                    @change="getWinddirection" />
                <img src="../../assets/img/big_icon.png" :class="{ 'disabled': swtichvalue }" alt="" class="imgbutton"
                    @click="adddirection">
            </div>
        </div>
        <div class="leftbox-middle">
            <div class="leftbox-top-title">
                <span>时间模拟</span>
                <span>Time simulation</span>
            </div>
            <div class="leftbox-middle-title">
                <span>1:00h</span>
                <span>6:00h</span>
                <span>12:00h</span>
                <span>18:00h</span>
                <span>24:00h</span>
            </div>
            <div class="leftbox-middle-content">
                <img src="../../assets/img/small_icon.png" :class="{ 'disabled': swtichvalue }" alt="" class="imgbutton"
                    @click="decreasetime">
                <el-slider v-model="timevalue" :disabled="swtichvalue" style="width: 320px;margin-left: 20px;" :min="1"
                    :max="86400" :step="1" @input="updateTimeDisplay" @change="gettimevalue" :show-tooltip="false" />
                <img src="../../assets/img/big_icon.png" :class="{ 'disabled': swtichvalue }" alt="" class="imgbutton"
                    @click="addtime">
            </div>
            <div class="leftbox-middle-bottom">
                <div class="leftbox-middle-bottom-content">
                    <img src="../../assets/img/morning_icon.png" alt="">
                    <span>早晨</span>
                </div>
                <div class="leftbox-middle-bottom-content">
                    <img src="../../assets/img/noon_icon.png" alt="">
                    <span>中午</span>
                </div>
                <div class="leftbox-middle-bottom-content">
                    <img src="../../assets/img/night_icon.png" alt="">
                    <span>傍晚</span>
                </div>
                <div class="leftbox-middle-bottom-content">
                    <img src="../../assets/img/evening_icon.png" alt="">
                    <span>晚上</span>
                </div>
            </div>
        </div>
        <div class="leftbox-bottom">
            <div class="leftbox-top-title">
                <span>海浪模拟</span>
                <span>Ocean wave simulation</span>
            </div>
            <div class="leftbox-bottom-content">
                <span>海浪高度</span>
                <img src="../../assets/img/small_icon.png" alt="" class="imgbutton" @click="decreaseoceanWave">
                <el-slider v-model="oceanWavevalue" style="width: 240px;margin-left: 20px;"
                    @change="getoceanWavevalue" />
                <img src="../../assets/img/big_icon.png" alt="" class="imgbutton" @click="addoceanWave">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { callUIInteraction } from "../../module/webrtcVideo/webrtcVideo.js";
import sunnyday from '../../assets/img/weather_sunny_icon.png';
import sunnycloudyday from '../../assets/img/sunnycloudy.png';
import cloudyday from '../../assets/img/cloudy.png';
import lightrainday from '../../assets/img/lightrain.png';
import heavyrainday from '../../assets/img/heavyrain.png';
import rainstormday from '../../assets/img/rainstorm.png';
import Lightfogday from '../../assets/img/Lightfog.png';
import Mediumfogday from '../../assets/img/Mediumfog.png';
import Fogday from '../../assets/img/Fog.png';

const currentTime = ref('');
const currentDate = ref('');
const timevalue = ref(sessionStorage.getItem('timevalue') ? parseInt(sessionStorage.getItem('timevalue')) : 1);
const Windintensity = ref(sessionStorage.getItem('Windintensity') ? parseInt(sessionStorage.getItem('Windintensity')) : 0);
const Winddirection = ref(sessionStorage.getItem('Winddirection') ? parseInt(sessionStorage.getItem('Winddirection')) : 0);
const oceanWavevalue = ref(sessionStorage.getItem('oceanWavevalue') ? parseInt(sessionStorage.getItem('oceanWavevalue')) : 0);
// 时间模拟时间轴
const updateTimeDisplay = (value) => {
    timevalue.value = value;
    sessionStorage.setItem('timevalue', value);
};
// 获取当前时间
const updateTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTime.value = `${hours}:${minutes}:${seconds}`;

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    currentDate.value = `${year}/${month}/${day}`;
};

updateTime();
setInterval(updateTime, 1000);
// 是否实时
const swtichvalue = ref(false);
let intervalId;
const handleswtich = (e) => {
    callUIInteraction({
        function: '是否实时/' + e,
    });
    if (e) {
        const now = new Date();
        const totalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        timevalue.value = totalSeconds;
        callUIInteraction({
            function: '虚拟仿真时间模拟/' + timevalue.value,
        });
        intervalId = setInterval(() => {
            timevalue.value++;
        }, 1000);
    } else {
        clearInterval(intervalId);
    }
}
// 根据图片路径判断对应天气内容
const weatherIcons = {
    [sunnyday]: '晴天',
    [sunnycloudyday]: '多云',
    [cloudyday]: '阴天',
    [lightrainday]: '小雨',
    [heavyrainday]: '中雨',
    [rainstormday]: '暴雨',
    [Lightfogday]: '小雾',
    [Mediumfogday]: '中雾',
    [Fogday]: '大雾'
};

const weatherone = ref(sunnyday);
const weathertwo = ref(sunnycloudyday);
const weatherthree = ref(cloudyday);
const selectedIcon = ref(sessionStorage.getItem('selectedIcon') || 'sunny');
const selectedIconDetail = ref(sessionStorage.getItem('selectedIconDetail') || 'sunnyDetail');
// 选择第一层天气图标
const selectIcon = (icon) => {
    selectedIcon.value = icon;
    sessionStorage.setItem('selectedIcon', icon);
    updateWeatherDetails(icon);
};
// 选择第二层天气图标
const selectDetailIcon = (icon) => {
    selectedIconDetail.value = icon;
    sessionStorage.setItem('selectedIconDetail', icon);
    let selectedWeatherIcon = '';
    switch (icon) {
        case 'sunnyDetail':
            selectedWeatherIcon = weatherIcons[weatherone.value];
            break;
        case 'heavyrainDetail':
            selectedWeatherIcon = weatherIcons[weathertwo.value];
            break;
        case 'fogDetail':
            selectedWeatherIcon = weatherIcons[weatherthree.value];
            break;
        default:
            break;
    }
    callUIInteraction({
        function: '选中的天气详情图标/' + selectedWeatherIcon,
    });
};

const updateWeatherDetails = (icon) => {
    switch (icon) {
        case 'sunny':
            weatherone.value = sunnyday;
            weathertwo.value = sunnycloudyday;
            weatherthree.value = cloudyday;
            selectedIconDetail.value = 'sunnyDetail';
            callUIInteraction({
                function: '选中的天气详情图标/晴天'
            });
            break;
        case 'heavyrain':
            weatherone.value = lightrainday;
            weathertwo.value = heavyrainday;
            weatherthree.value = rainstormday;
            selectedIconDetail.value = 'heavyrainDetail';
            callUIInteraction({
                function: '选中的天气详情图标/中雨'
            });
            break;
        case 'fog':
            weatherone.value = Lightfogday;
            weathertwo.value = Mediumfogday;
            weatherthree.value = Fogday;
            selectedIconDetail.value = 'fogDetail';
            callUIInteraction({
                function: '选中的天气详情图标/大雾'
            });
            break;
        default:
            break;
    }
    sessionStorage.setItem('weatherone', weatherone.value);
    sessionStorage.setItem('weathertwo', weathertwo.value);
    sessionStorage.setItem('weatherthree', weatherthree.value);
};
// 时间模拟时间轴增加
const addtime = () => {
    timevalue.value += 3600;
    sessionStorage.setItem('timevalue', timevalue.value);
    callUIInteraction({
        function: '虚拟仿真时间模拟/' + timevalue.value,
    });
};
// 时间模拟时间轴减少
const decreasetime = () => {
    timevalue.value -= 3600;
    sessionStorage.setItem('timevalue', timevalue.value);
    callUIInteraction({
        function: '虚拟仿真时间模拟/' + timevalue.value,
    });
};
// 风强度增加
const addintensity = () => {
    Windintensity.value++;
    sessionStorage.setItem('Windintensity', Windintensity.value);
    callUIInteraction({
        function: '虚拟仿真风强度/' + Windintensity.value,
    });
};
// 风强度减少
const decreaseintensity = () => {
    Windintensity.value--;
    sessionStorage.setItem('Windintensity', Windintensity.value);
    callUIInteraction({
        function: '虚拟仿真风强度/' + Windintensity.value,
    });
};
// 风向增加
const adddirection = () => {
    Winddirection.value++;
    sessionStorage.setItem('Winddirection', Winddirection.value);
    callUIInteraction({
        function: '虚拟仿真风向/' + Winddirection.value,
    });
};
// 风向增加
const decreasedirection = () => {
    Winddirection.value--;
    sessionStorage.setItem('Winddirection', Winddirection.value);
    callUIInteraction({
        function: '虚拟仿真风向/' + Winddirection.value,
    });
};
// 海浪模拟增加
const addoceanWave = () => {
    oceanWavevalue.value++;
    sessionStorage.setItem('oceanWavevalue', oceanWavevalue.value);
    callUIInteraction({
        function: '虚拟仿真海浪高度/' + oceanWavevalue.value,
    });
};
// 海浪模拟减少
const decreaseoceanWave = () => {
    oceanWavevalue.value--;
    sessionStorage.setItem('oceanWavevalue', oceanWavevalue.value);
    callUIInteraction({
        function: '虚拟仿真海浪高度/' + oceanWavevalue.value,
    });
};
// 监听最后拖动的风强度
const getWindintensity = (e) => {
    sessionStorage.setItem('Windintensity', e);
    callUIInteraction({
        function: '虚拟仿真风强度/' + e,
    });
};
// 监听最后拖动的风向
const getWinddirection = (e) => {
    sessionStorage.setItem('Winddirection', e);
    callUIInteraction({
        function: '虚拟仿真风向/' + e,
    });
};
// 监听最后拖动的时间模拟
const gettimevalue = (e) => {
    sessionStorage.setItem('timevalue', e);
    callUIInteraction({
        function: '虚拟仿真时间模拟/' + e,
    });
};
// 监听最后拖动的海浪强度
const getoceanWavevalue = (e) => {
    sessionStorage.setItem('oceanWavevalue', e);
    callUIInteraction({
        function: '虚拟仿真海浪高度/' + e,
    });
};

onMounted(() => {
    if (sessionStorage.getItem('weatherone')) {
        weatherone.value = sessionStorage.getItem('weatherone');
    }
    if (sessionStorage.getItem('weathertwo')) {
        weathertwo.value = sessionStorage.getItem('weathertwo');
    }
    if (sessionStorage.getItem('weatherthree')) {
        weatherthree.value = sessionStorage.getItem('weatherthree');
    }
    if (!sessionStorage.getItem('selectedIconDetail')) {
        const iconPath = selectedIconDetail.value === 'sunnyDetail' ? weatherone.value
            : selectedIconDetail.value === 'heavyrainDetail' ? weathertwo.value
                : selectedIconDetail.value === 'fogDetail' ? weatherthree.value
                    : '';

        if (iconPath && weatherIcons[iconPath]) {
            callUIInteraction({
                function: '选中的天气详情图标/' + weatherIcons[iconPath],
            });
        }
    } else {
        const iconPath = selectedIconDetail.value === 'sunnyDetail' ? weatherone.value
            : selectedIconDetail.value === 'heavyrainDetail' ? weathertwo.value
                : selectedIconDetail.value === 'fogDetail' ? weatherthree.value
                    : '';
        if (iconPath && weatherIcons[iconPath]) {
            callUIInteraction({
                function: '选中的天气详情图标/' + weatherIcons[iconPath],
            });
        }
    }
});
</script>



<style scoped>
.leftbox {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 20px;
    top: 120px;
}

.leftbox-top {
    width: 460px;
    height: 410px;
    background-image: url('../../assets/image/框-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: 20px;
    box-sizing: border-box;
}

.leftbox-top-title {
    width: 418px;
    height: 33px;
    background-image: url('../../assets/image/title.png');
    background-repeat: no-repeat;
    background-size: 150% 100%;
    display: flex;
    align-items: center;
}

.leftbox-top-title span {
    font-family: PangMenZhengDao;
    font-size: 20px;
    color: #B7CFFC;
    margin-left: 40px;
}

.leftbox-top-title span:nth-child(2) {
    font-size: 12px;
}

.leftbox-top-content {
    /* width: 100%; */
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #E6E6E6;
    font-size: 14px;
    margin-top: 20px;
}

.leftbox-middle {
    width: 460px;
    height: 228px;
    background-image: url('../../assets/image/框-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-top: 20px;
    padding: 20px;
    box-sizing: border-box;
}

.leftbox-middle-title {
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-top: 20px;
    font-size: 14px;
    /* padding: 0 10px 0 30px; */
}

.leftbox-middle-content {
    /* width: 100%; */
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #E6E6E6;
    font-size: 14px;
    margin-top: 5px;
}

.leftbox-middle-bottom {
    /* width: 100%; */
    color: white;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-top: 5px;
}

.leftbox-middle-bottom-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.leftbox-bottom {
    width: 460px;
    height: 128px;
    background-image: url('../../assets/image/框-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-top: 20px;
    padding: 20px;
    box-sizing: border-box;
}

.Weather-list-top {
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
}

.Weather-list-top-left span:first-child {
    color: #B7CFFC;
    font-size: 20px;
}

.Weather-list-top-left span:last-child {
    color: #B7CFFC;
    font-size: 14px;
    margin-left: 10px;
}

.Weather-list-top-right {
    margin-left: 95px;
    display: flex;
    align-items: center;
}

.Weather-list-top-right span {
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: 500;
    font-size: 16px;
    color: #B7CFFC;
}

.Weather-list-top-right :deep(.el-switch__core) {
    border-radius: 0;
    border: 1px solid #42AEFF;
}

.Weather-list-top-right :deep(.el-switch__core .el-switch__action) {
    border-radius: 0;
    background-color: #42AEFF;
}

.Weather-list-top-right :deep(.el-switch.is-checked .el-switch__core .el-switch__inner) {
    background-color: #08415c;
}

.Weather-list-top-right :deep(.el-switch__core .el-switch__inner) {
    border: 1px solid #08415c;
    background-color: #08415c;
}

.Weather-list-top-right :deep(.el-switch.is-checked .el-switch__core) {
    background-color: #08415c;
}

.Weather-list-top-right :deep(.el-switch__core .el-switch__inner .is-text) {
    color: #AFDFFD;
}

.Weather-type-icon,
.Weather-type-icon-detailed {
    padding-left: 40px;
    padding-right: 40px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

.Weather-type-icon img,
.Weather-type-icon-detailed img {
    cursor: pointer;
}

.selected {
    filter: invert(0.4) sepia(1) saturate(20) hue-rotate(180deg) brightness(1.01);
}

.leftbox-bottom-content {
    /* width: 100%; */
    height: calc(108px - 33px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #E6E6E6;
    font-size: 14px;
}

.imgbutton {
    margin-left: 20px;
    cursor: pointer;
}

:deep(.el-slider__runway) {
    height: 2px;
    background-color: #00A8D2;
}

:deep(.el-slider__bar) {
    height: 2px;
    background-color: #00A8D2;
}

:deep(.el-slider__button) {
    background-color: transparent;
    border: 0;
    background-image: url('../../assets/img/slipPoint_icon.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-bottom: 4px;
}

.disabled {
    pointer-events: none;
    /* 禁用鼠标事件 */
    opacity: 0.6;
    /* 使元素半透明 */
}
</style>