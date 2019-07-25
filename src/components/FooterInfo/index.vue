<template functional>
  <div class="footerInfo">
    <div class="footerInfo__main">
      <slot>
        Copyright <i class="el-icon-icon-copyright"></i> 2019 ***.com(****系统公共平台) All Rights Reserved. 粤ICP备***号
      </slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
class FooterInfo extends Vue {

}
export default FooterInfo
</script>

<style src="./style.scss" lang="scss" scoped></style>
