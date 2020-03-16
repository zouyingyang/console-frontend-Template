<template>
  <div v-if="crumbsList.length" class="op-clear op-route-historical-record">
    <el-tag
      type="warning"
      v-for="(item,index) in crumbsList"
      :key="index + 'breadcrumb'"
      class="op-left op-crumbsList-list"
      :class="{ active: currentRouteName === item.name}">
      <span @click="handleLink(item)">{{item.meta.name}}</span>
      <i class="el-icon el-icon-close" @click="closeLink(item)"></i>
    </el-tag>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import LogoWrap from '@/components/LogoWrap'

@Component({
  components: { LogoWrap }
})
class Breadcrumb extends Vue {
  crumbsList = ''
  @Prop({ type: String }) logo
  @Prop({ type: String }) title
  @Prop({ type: String }) active
  @Prop({ default: false, type: Boolean }) collapse
  @Prop({ type: Array }) menusTree
  @Watch('$route', { immediate: true })
  onRouterChange () {
    this.getCrumbsList()
  }

  /*
  * 获取路由历史记录
  * */
  getCrumbsList () {
    this.currentRouteName = this.$router.currentRoute.name
    let crumbsList = sessionStorage.getItem('crumbsList')
    if (crumbsList && crumbsList.length) {
      this.crumbsList = JSON.parse(crumbsList)
    }
  }

  /*
  * 跳转路由
  * */
  handleLink (item) {
    this.$router.push({
      name: item.name,
      query: item.query
    })
  }

  /*
  * 删除路由记录
  * */
  closeLink (item) {
    let crumbsList = []
    for (let list of this.crumbsList) {
      list.name !== item.name && crumbsList.push(list)
    }
    this.crumbsList = crumbsList
    sessionStorage.setItem('crumbsList', JSON.stringify(crumbsList))
    let lastPath = crumbsList.length ? crumbsList[crumbsList.length - 1].path : '/'
    this.$route.name === item.name && this.$router.push(lastPath)
  }

  created () {
    this.getCrumbsList()
  }
}
export default Breadcrumb
</script>

<style lang="scss" scoped>
  .op-route-historical-record{
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    padding: 5px;
    box-sizing: border-box;
    .op-crumbsList-list{
      border-radius: 0;
      margin-right: 10px;
      font-size: 14px;
      padding: 3px 8px;
      line-height: 7px;
      &:hover{
        cursor: pointer;
        background-color: #fc9153;
        color: #fff;
        .el-icon-close{
          color: #fff;
        }
      }
      &.active{
        background-color: #fc9153;
        color: #fff;
        .el-icon-close{
          color: #fff;
        }
      }
      .el-icon-close:hover{
        border-radius: 100%;
        background-color: #fff;
        color: #fc9153;
      }
    }
  }
</style>
