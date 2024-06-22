<template>
    <div class="page">
        <div class="top-view">
            <span>磨刀门河道咸潮数字孪生</span>
        </div>
        <div class="top-view-button">
            <div class="top-view-button-left">
                <div class="top-view-button-style" :class="{ 'active': activeButton === '监测预警' }"
                    @click="setActiveButton('监测预警')">监测预警</div>
                <div style="margin-left: 10px;" class="top-view-button-style"
                    :class="{ 'active': activeButton === '咸潮模拟' }" @click="setActiveButton('咸潮模拟')">咸潮模拟</div>
            </div>
            <div class="top-view-button-right">
                <div style="margin-right: 10px;" class="top-view-button-style"
                    :class="{ 'active': activeButton === '智能分析' }" @click="setActiveButton('智能分析')">智能分析</div>
                <div class="top-view-button-style" :class="{ 'active': activeButton === '虚拟仿真' }"
                    @click="setActiveButton('虚拟仿真')">
                    虚拟仿真
                </div>
            </div>
        </div>
        <div class="right-tool">
            <el-tooltip class="item" effect="dark" content="倾斜摄影" placement="bottom">
                <div class="right-tool-button" :class="{ 'active': activeToolButton === '倾斜摄影' }">
                    <img @click="setActiveToolButton('倾斜摄影')"
                        :src="activeToolButton === '倾斜摄影' ? '/src/assets/img/tool_isobath_icon_active.png' : '/src/assets/img/tool_isobath_icon_default.png'"
                        alt="">
                </div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="空间量测" placement="bottom">
                <div class="right-tool-button" :class="{ 'active': activeToolButton === '空间量测' }"
                    style="margin-top: 17px;">
                    <img @click="setActiveToolButton('空间量测')"
                        :src="activeToolButton === '空间量测' ? '/src/assets/img/tool_space_icon_active.png' : '/src/assets/img/tool_space_icon_default.png'"
                        alt="">
                    <div v-if="showMeasurement" class="right-tool-button-measurement">
                        <div class="right-tool-button-measurement-area" @click="loadarea('面积')"
                            :class="{ 'active': activeButtonright === '面积' }">
                            <span>面积</span>
                        </div>
                        <div class="right-tool-button-measurement-length" @click="loadlength('长度')"
                            :class="{ 'active': activeButtonright === '长度' }">
                            <span>长度</span>
                        </div>
                    </div>
                </div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="多固定视角" placement="bottom">
                <div class="right-tool-button" :class="{ 'active': activeToolButton === '多固定视角' }"
                    style="margin-top: 17px;">
                    <img @click="setActiveToolButton('多固定视角')"
                        :src="activeToolButton === '多固定视角' ? '/src/assets/img/tool_angle_icon_active.png' : '/src/assets/img/tool_angle_icon_default.png'"
                        alt="">
                    <div v-if="showVisualangle" class="right-tool-button-Visualangle">
                        <div class="right-tool-button-Visualangle-Bigpicture" @click="loadBigpicture('全局视角')"
                            :class="{ 'active': activeButtonright === '全局视角' }">
                            <span>全局视角</span>
                        </div>
                        <div class="right-tool-button-Visualangle-filigree" @click="loadfiligree('精细化视角')"
                            :class="{ 'active': activeButtonright === '精细化视角' }">
                            <span>精细化视角</span>
                        </div>
                    </div>
                </div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="场景漫游" placement="bottom">
                <div class="right-tool-button" :class="{ 'active': activeToolButton === '场景漫游' }"
                    style="margin-top: 17px;">
                    <img @click="setActiveToolButton('场景漫游')"
                        :src="activeToolButton === '场景漫游' ? '/src/assets/img/tool_scene_icon_active.png' : '/src/assets/img/tool_scene_icon_default.png'"
                        alt="">
                </div>
            </el-tooltip>
        </div>
        <div v-if="activeButton === '监测预警'">
            <Monitoring />
        </div>
        <div v-if="activeButton === '咸潮模拟'">
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
        if (button === '多固定视角') {
            showVisualangle.value = true;
            activeButtonright.value = '';
        } else {
            showVisualangle.value = false;
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
const loadBigpicture = (button) => {
    if (activeButtonright.value !== button) {
        callUIInteraction({
            function: '空间测量' + button + '/true'
        });
        activeButtonright.value = button;
    }
}
const loadfiligree = (button) => {
    if (activeButtonright.value !== button) {
        callUIInteraction({
            function: '空间测量' + button + '/true'
        });
        activeButtonright.value = button;
    }
}
onMounted(() => {
    setActiveButton('监测预警')
    callUIInteraction({
        function: '监测预警'
    });
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
    background-image: url('../assets/img/header_back.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.top-view span {
    width: 612px;
    height: 54px;
    font-weight: 600;
    font-size: 42px;
    font-family: SourceHanSansCN, SourceHanSansCN;
    background: linear-gradient(to bottom, #f8fafe, #b0ccf4);
    -webkit-background-clip: text;
    color: transparent;
    line-height: 54px;
    text-align: center;
    font-style: normal;
}

.top-view-button-left {
    position: absolute;
    top: 38px;
    left: 10%;
    display: flex;
}

.top-view-button-right {
    position: absolute;
    top: 38px;
    right: 10%;
    display: flex;
}

.top-view-button-style {
    width: 180px;
    height: 41px;
    background-image: url('../assets/img/header_tabback.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PangMenZhengDao;
    font-size: 22px;
    color: #1F9DA7;
    font-style: normal;
    cursor: pointer;
}

.top-view-button-style.active {
    background-image: url('../assets/img/header_tabback_active.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #FFFFFF;
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
    right: 60px;
    top: 68px;
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
