<template>
  <div class="IProgress" :style="{width: value+'%'}">
  </div>
</template>

<script>
export default {
  name: 'IProgress',
  props:['value'],  
}
</script>

<style scoped>
.IProgress{
  height: 2px;
  background: #F64344;
  transition: width .3s ease;
}
</style>
