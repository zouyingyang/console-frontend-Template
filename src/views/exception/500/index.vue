<template>
  <div class="nofind">
    <div class="nofind__main">
      <p class="font--focus">500</p>
      <p class="font--helper">抱歉，服务器出错了</p>
      <el-button type="primary" @click="onclick" plain>返回首页</el-button>
      <el-button type="primary" @click="onclick">重新请求</el-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
class ServerError extends Vue {
  onclick () {
    this.$router.push('/')
  }
}
export default ServerError
</script>

<style lang="scss" scoped>
@import '~@nn-yy/css-flex/flex';

.nofind {
  @include flex-column(center, middle);
  height: 80vh;
}

.font {
  &--focus {
    margin: 10px 0;
    color: #606266;
    font-size: 72px;
    font-weight: 600;
  }

  &--helper {
    margin: 20px 0;
    color: #909399;
    font-size: 18px;
  }
}
</style>
