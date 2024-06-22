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
</style>