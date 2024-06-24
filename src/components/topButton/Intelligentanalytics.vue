<template>
    <div class="leftbox">
        <div class="leftbox-middle" v-show="showEcharts">
            <div class="leftbox-top-title">
                <span>取水辅助</span>
                <span>Intake aid</span>
                <img class="closeimg" src="../../assets/image/close.png" alt="" @click="closeEcharts">
            </div>
            <div id="leftbox-content"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount} from 'vue';
import * as echarts from "echarts";

const showEcharts = ref(true)
let waterdata = null;
const init = () => {
    const waterChartElement = document.getElementById("leftbox-content");
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
const closeEcharts = () => {
    showEcharts.value = false;
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
.leftbox {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.leftbox-middle {
    width: 1000px;
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

#leftbox-content {
    width: 100%;
    height: 430px;
}

.closeimg {
    position: absolute;
    right: 20px;
    top: 35px;
    cursor: pointer;
}
</style>
