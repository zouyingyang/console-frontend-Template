<template functional>
  <div class="footerInfo">
    <div class="footerInfo__main">
      <slot>
        Copyright <i class="el-icon-icon-copyright"></i> 2018 oppein.com.cn(欧派集团系统公共平台) All Rights Reserved. 粤ICP备11072976号
      </slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class FooterInfo extends Vue {

}
</script>

<style src="./style.scss" lang="scss" scoped></style>
