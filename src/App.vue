<template>
  <a-config-provider :locale="zhCN">
    <router-view></router-view>
  </a-config-provider>
</template>
<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
</script>
<style>
* {
  margin: 0;
  padding: 0;
}

/* 禁止鼠标选中文字 */
div {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.el-popper.is-light.blueBack {
  background-color: #254277 !important;
  border: 1px solid #254277 !important;
}

.blueBack.el-popper[data-popper-placement^=bottom] .el-popper__arrow::before {
  background: #254277 !important;
  border: 1px solid #254277 !important;
}

.blueBack.el-popper[data-popper-placement^=top] .el-popper__arrow::before {
  background: #254277 !important;
  border: 1px solid #254277 !important;
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: #2A77C6 !important;
}

.el-select-dropdown__item {
  color: #b7cffc !important;
}

.el-select-dropdown__item.selected {
  background: #2A77C6 !important;
}

.el-select-dropdown__item.is-hovering {
  background-color: #2A77C6 !important;
}

.el-picker__popper.el-popper {
  inset: 490px auto auto 15px !important;
}

/* .el-popper__arrow {
  position: absolute;
  top: 336px !important;
  left: 75px !important;
} */
.el-popper__arrow::before {
  display: none;
}

.ant-tooltip .ant-tooltip-inner {
  text-align: center;
}

.ant-slider:hover .ant-slider-rail {
  background-color: #91caff !important;
}

.ant-slider-vertical .ant-slider-rail {
  background-color: #91caff !important;
}

.ant-slider .ant-slider-rail {
  background-color: #91caff !important;
}

:where(.css-dev-only-do-not-override-19iuou).ant-picker-range {
  border-radius: 0;
}
:where(.css-dev-only-do-not-override-19iuou).ant-picker{
  border: 1px solid #2A77C6;
}
:where(.css-dev-only-do-not-override-19iuou).ant-picker .ant-picker-input >input:placeholder-shown{
  text-align: center;
}
</style>