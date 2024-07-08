<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script setup>

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
:where(.css-dev-only-do-not-override-19iuou).ant-tooltip .ant-tooltip-inner{
  text-align: center;
}
:where(.css-dev-only-do-not-override-19iuou).ant-slider:hover .ant-slider-rail{
  background-color: #91caff;
  width: 4px;
}
:where(.css-dev-only-do-not-override-19iuou).ant-slider-vertical .ant-slider-rail{
  background-color: #91caff;
  width: 4px;
}
</style>