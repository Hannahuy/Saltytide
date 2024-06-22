<template>
    <div class="top-leftbox">
        <div class="top-leftbox-title">
            <span>设备列表</span>
            <span>A list of devices</span>
        </div>
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: 'transparent' }">
            <el-table-column prop="date" label="Date" width="120" />
            <el-table-column prop="name" label="Name" width="120" />
            <el-table-column prop="name" label="Name" width="110" />
        </el-table>
    </div>
    <div class="top-leftbox1">
        <div class="top-leftbox-title">
            <span>水位监测</span>
            <span>Water level monitori</span>
        </div>
        <div id="WaterCharts"></div>
    </div>
    <div class="top-leftbox2">
        <div class="top-leftbox-title">
            <span>盐度监测</span>
            <span>Salinity monitoring</span>
        </div>
        <div id="SalinityCharts"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from "echarts";

const tableData = ref([
    { date: '2016-05-03', name: 'Tom' },
    { date: '2016-05-02', name: 'Tom' },
    { date: '2016-05-04', name: 'Tom' },
    { date: '2016-05-01', name: 'Tom' },
    { date: '2016-05-05', name: 'Tom' },
]);

let waterChartInstance = null;
let salinityChartInstance = null;

const initWaterChart = () => {
    const waterChartElement = document.getElementById("WaterCharts");
    if (waterChartInstance) {
        waterChartInstance.dispose();
    }
    waterChartInstance = echarts.init(waterChartElement);
    const options = {
        grid: { x: 10, y: 10, x2: 10, y2: 1, containLabel: true },
        xAxis: [{ type: 'category', boundaryGap: false, data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }],
        yAxis: { splitLine: { show: false } },
        series: [
            {
                name: 'Line 2',
                type: 'line',
                stack: 'Total',
                smooth: true,
                lineStyle: { width: 0 },
                showSymbol: false,
                areaStyle: {
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#28F2E6' },
                        { offset: 1, color: '#28F2E6' }
                    ])
                },
                emphasis: { focus: 'series' },
                data: [120, 282, 111, 234, 220, 340, 310]
            },
        ]
    };
    waterChartInstance.setOption(options);
};

const initSalinityChart = () => {
    const salinityChartElement = document.getElementById("SalinityCharts");
    if (salinityChartInstance) {
        salinityChartInstance.dispose();
    }
    salinityChartInstance = echarts.init(salinityChartElement);
    const options = {
        xAxis: { data: ["03/25", "03/26", "03/27", "03/28", "03/29", "03/30", "03/31"] },
        yAxis: { splitLine: { show: false } },
        series: [
            {
                name: "单位",
                type: "line",
                data: [110, 75, 135, 175, 100, 10, 90],
                lineStyle: { color: '#28F2E6' },
                symbol: 'rect',
                symbolSize: 8,
                itemStyle: { color: '#28F2E6', borderColor: '#000000' }
            },
        ],
        grid: { x: 50, y: 25, x2: 30, y2: 35 },
    };
    salinityChartInstance.setOption(options);
};

onMounted(() => {
    initWaterChart();
    initSalinityChart();
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
.top-leftbox,
.top-leftbox1,
.top-leftbox2 {
    background-image: url('../../assets/img/module_back.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 30px;
    padding: 20px;
}

.top-leftbox {
    top: 120px;
    width: 400px;
    height: 255px;
}

.top-leftbox1 {
    top: 440px;
    width: 400px;
    height: 195px;
}

.top-leftbox2 {
    top: 700px;
    width: 400px;
    height: 195px;
}

.top-leftbox-title {
    width: 100%;
    height: 33px;
    background-image: url('../../assets/img/module_titleback.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.top-leftbox-title span {
    font-family: PangMenZhengDao;
    font-size: 20px;
    color: #B7CFFC;
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

:deep(.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell) {
    background-color: transparent;
}

/* 去掉中间数据的分割线 */
:deep(.el-table__row>td) {
    border: none;
}

/* 去掉上面的线 */
:deep(.el-table th.is-leaf) {
    border: none;
}

:deep(.el-table__inner-wrapper:before) {
    display: none;
}

#WaterCharts,
#SalinityCharts {
    width: 100%;
    height: calc(100% - 33px - 20px);
    margin-top: 20px;
}
</style>
