<template>
    <div class="page">
        <div class="top-view">
            <span>磨刀门水道咸潮数字孪生</span>
            <div class="title-line-bg"></div>
        </div>
        <div class="top-view-button">
            <div class="top-view-button-style" :class="{ 'active': activeButton === '实时监测' }"
                    @click="setActiveButton('实时监测')">实时监测</div>
            <div style="margin-left: 20px;" class="top-view-button-style"
                    :class="{ 'active': activeButton === '咸潮预测' }" @click="setActiveButton('咸潮预测')">咸潮预测</div>
            <div style="margin-left: 20px;" class="top-view-button-style"
                    :class="{ 'active': activeButton === '智能分析' }" @click="setActiveButton('智能分析')">智能分析</div>
            <div style="margin-left: 20px;" class="top-view-button-style" :class="{ 'active': activeButton === '虚拟仿真' }"
                    @click="setActiveButton('虚拟仿真')">虚拟仿真</div>
        </div>
        <div class="Weather-list-top-left">
            <span>{{ currentDate }}</span>
            <span style="margin-left: 20px;">{{ currentTime }}</span>
        </div>
        <div class="right-tool">
            <el-tooltip class="item" effect="dark" content="场景漫游" placement="left">
                <div class="right-tool-button" :class="{ 'active': activeToolButton === '场景漫游' }">
                    <img @click="setActiveToolButton('场景漫游')" style="width: 30px;height: 30px"
                        :src="activeToolButton === '场景漫游' ? '/src/assets/image/tool_scene_icon_active.png' : '/src/assets/image/tool_scene_icon_default.png'"
                        alt="">
                </div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="空间量测" placement="left">
                <div class="right-tool-button" :class="{ 'active': activeToolButton === '空间量测' }">
                    <img @click="setActiveToolButton('空间量测')" style="width: 30px;height: 30px"
                        :src="activeToolButton === '空间量测' ? '/src/assets/image/tool_space_icon_active.png' : '/src/assets/image/tool_space_icon_default.png'"
                        alt="">
                    <div v-if="showMeasurement" class="right-tool-button-measurement">
                        <img @click="loadlength('长度')" :src="activeButtonright === '长度' ? '/src/assets/image/测量 -3.png' :'/src/assets/image/测量 -2.png'"
                         alt="" style="margin-bottom: 10px;">
                        <img @click="loadarea('面积')" :src="activeButtonright === '面积' ? '/src/assets/image/面积 -2.png' : '/src/assets/image/面积 -1.png'" alt="">
                    </div>
                </div>
            </el-tooltip>
        </div>
        <div v-if="activeButton === '实时监测'">
            <Monitoring />
        </div>
        <div v-if="activeButton === '咸潮预测'">
            <Saltytidesimulation />
        </div>
        <div v-if="activeButton === '智能分析'">
            <Intelligentanalytics />
        </div>
        <div v-if="activeButton === '虚拟仿真'">
            <Virtualsimulation />
        </div>
    </div>
    <background />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Virtualsimulation from './topButton/Virtualsimulation.vue'
import Monitoring from './topButton/Monitoring.vue'
import Saltytidesimulation from './topButton/Saltytidesimulation.vue'
import Intelligentanalytics from './topButton/Intelligentanalytics.vue'
import background from './topButton/background.vue'
import { callUIInteraction } from "../module/webrtcVideo/webrtcVideo.js";
import axios from 'axios'

const currentTime = ref('');
const currentDate = ref('');
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

const activeButton = ref('')
const activeButtonright = ref('')
const activeToolButton = ref('')
const showMeasurement = ref(false)
const showVisualangle = ref(false)
const setActiveButton = (button) => {
    if (activeButton.value !== button) {
        callUIInteraction({
            function: button,
        });
        activeButton.value = button;
    }
}

const setActiveToolButton = (button) => {
    if (activeToolButton.value === button) {
        activeToolButton.value = '';
        showMeasurement.value = false;
        showVisualangle.value = false;
        callUIInteraction({
            function: button + '/false'
        });
    } else {
        activeToolButton.value = button;
        if (button === '空间量测') {
            showMeasurement.value = true; activeButtonright.value = '';
        } else {
            showMeasurement.value = false;
        }
        callUIInteraction({
            function: button + '/true'
        });
    }
}
const loadarea = (button) => {
    if (activeButtonright.value !== button) {
        callUIInteraction({
            function: '空间测量' + button + '/true'
        });
        activeButtonright.value = button;
    }
}
const loadlength = (button) => {
    if (activeButtonright.value !== button) {
        callUIInteraction({
            function: '空间测量' + button + '/true'
        });
        activeButtonright.value = button;
    }
}
onMounted(() => {
    setActiveButton('实时监测')
    callUIInteraction({
        function: '实时监测'
    });
    // axios.get('/api/get_raster_value?lat=113.427139&lon=22.151838').then((res)=>{
    //     console.log(res);
    // })
})
</script>

<style scoped>
.page {
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
    z-index: 1;
}

.page>div {
    pointer-events: auto;
}

.top-view {
    width: 100%;
    height: 80px;
    background-image: url('../assets/image/图层 668.png');
    background-repeat: no-repeat;
    background-size: 100% 180%;
    display: flex;
    justify-content: start;
    align-items: center;
}

.top-view span {
    position: relative;
    float: left;
    left: 40px;
    width: auto;
    line-height: 85px;
    text-align: justify;
    -moz-text-align-last: justify;
    text-align-last: justify;
    text-justify: inter-character;
    color: #FFFFFF;
    background: linear-gradient(0deg, #a2d4ff 1000%, #FFFFFF 0%);
    font-size: 44px;
    font-family: YouSheBiaoTiHei;
    font-weight: 400;
    color: #D4E1FF;
    background: linear-gradient(0deg, #7EC0FF 0%, #FFFFFF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 10px;
}
.title-line-bg {
    background: url('../assets/image/title-横.png');
    width: 98vw;
    margin: 0 1vw;
    background-size: 100%;
    background-repeat: no-repeat;
    position: absolute;
    z-index: 99;
    height: 10px;
    top: 70px;
}

.top-view-button {
    position: absolute;
    top: 17px;
    left: 750px;
    display: flex;
}

.top-view-button-style {
    width: 180px;
    height: 41px;
    background-image: url('../assets/image/按钮-默认.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: YouSheBiaoTiHei;
    font-size: 22px;
    color: #FFFFFF;
    font-weight: 400;
    color: #D4E1FF;
    cursor: pointer;
    letter-spacing: 5px;
}

.top-view-button-style.active {
    background-image: url('../assets/image/按钮-变.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #D4E1FF;
}
.Weather-list-top-left{
    color: #D4E1FF;
    font-size: 20px;
    position: absolute;
    right: 50px;
    top: 25px;
}
.right-tool {
    position: absolute;
    right: 20px;
    top: 198px;
}

.right-tool-button {
    width: 55px;
    height: 55px;
    cursor: pointer;
    border-radius: 50%;
    /* background-color: #4e5657; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
}

.right-tool-button.active {
    /* background-color: #0dc9e2; */
}

.right-tool-button-measurement {
    position: absolute;
    right: 12px;
    top: 108px;
    display: flex;
    flex-direction: column;
    color: #FFFFFF;
}

.right-tool-button-measurement-area,
.right-tool-button-measurement-length {
    width: 65px;
    height: 32px;
    background-image: url('../assets/img/title_next_back_default.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-family: PangMenZhengDao;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.right-tool-button-measurement-area.active,
.right-tool-button-measurement-length.active {
    width: 65px;
    height: 32px;
    background-image: url('../assets/img/title_next_back_active.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-family: PangMenZhengDao;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.right-tool-button-Visualangle {
    position: absolute;
    right: 60px;
    top: 140px;
    display: flex;
    flex-direction: column;
    color: #FFFFFF;
}

.right-tool-button-Visualangle-Bigpicture,
.right-tool-button-Visualangle-filigree {
    width: 85px;
    height: 32px;
    background-image: url('../assets/img/title_next_back_default.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-family: PangMenZhengDao;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.right-tool-button-Visualangle-Bigpicture.active,
.right-tool-button-Visualangle-filigree.active {
    width: 85px;
    height: 32px;
    background-image: url('../assets/img/title_next_back_active.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-family: PangMenZhengDao;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

:deep(.el-date-editor.el-input) {
    width: 130px !important;
}
</style>
