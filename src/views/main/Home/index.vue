<template>
    <div class="op-analysis">
      <img class="op-analysis-bg" src="../../../assets/images/homeBg.png">
    </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({})
class Analysis extends Vue {
  created () {
  }
}
export default Analysis
</script>
<style lang="scss" scoped>
  .el-container{
    background-color: #fff;
  }
  .op-analysis-bg{
    width: 100%;
    object-fit: cover;
  }
</style>
