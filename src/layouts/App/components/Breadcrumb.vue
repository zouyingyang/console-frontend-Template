<template>
  <el-breadcrumb class="op-breadcrumb" separator="/" v-show="levelList.length > 0">
    <!--<transition-group name="breadcrumb">-->
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="index + 'breadcrumb'">
        <span v-if='item.redirect==="noredirect" || index===levelList.length-1' class="no-redirect">{{ item.meta.name }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.name }}</a>
      </el-breadcrumb-item>
    <!--</transition-group>-->
  </el-breadcrumb>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import LogoWrap from '@/components/LogoWrap'

@Component({
  components: { LogoWrap }
})
export default class Breadcrumb extends Vue {
  levelList = ''
  @Prop({ type: String }) logo
  @Prop({ type: String }) title
  @Prop({ type: String }) active
  @Prop({ default: false, type: Boolean }) collapse
  @Prop({ type: Array }) menusTree
  @Watch('$route', { immediate: true })
  onRouterChange () {
    this.getBreadcrumb()
  }
  /*
  * 获取面包屑信息
  * */
  getBreadcrumb () {
    let matched = this.$route.matched.filter(item => item.name)
    // const first = matched[0]
    // if (first && first.path !== '/dashboard/analysis') {
    //   matched = [{ path: '/dashboard/analysis', meta: { title: '首页' } }].concat(matched)
    // }
    this.levelList = matched.filter(item => item.meta && item.name && item.meta.title)
  }

  handleLink (item) {
    this.$router.push({
      name: item.name
    })
  }

  created () {
    this.getBreadcrumb()
  }
}
</script>

<style lang="scss" scoped>
</style>
