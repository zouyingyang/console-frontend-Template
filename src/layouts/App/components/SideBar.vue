<template>
  <el-menu class="fix-menu"
    :default-active="active"
    :collapse="collapse"
    :collapse-transition="true"
    router
    unique-opened>
    <LogoWrap type="dark" :logo="logo"></LogoWrap>
    <template v-for="(item, index) in menusTree" v-if="item.isShow">
      <template v-if="item.children && item.children.length > 0">
        <el-submenu :index="item.route ?item.route :`${index}`" :key="index" v-if="item.isShow===1">
          <template :slot="'title'">
            <i :class="['iconfont',item.icon]"></i>
            <span :slot="'title'">{{ item.name }}</span>
          </template>
          <template v-for="(citem, cindex) in item.children">
            <el-menu-item :index="citem.route ?citem.route :`${cindex}`" :key="cindex" v-if="citem.isShow===1">
              <template v-if="citem.icon && citem.icon">
                <i :class="['iconfont',item.icon]"></i>
              </template>
              {{ citem.name }}
            </el-menu-item>
          </template>
        </el-submenu>
      </template>

      <template v-else>
        <el-menu-item :index="item.route ?item.route :`${index}`" :key="index" v-if="item.isShow===1">
          <i :class="['iconfont',item.icon]"></i>
          <span :slot="'title'">{{ item.name }}</span>
        </el-menu-item>
      </template>

    </template>
  </el-menu>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import LogoWrap from '@/components/LogoWrap'

@Component({
  components: { LogoWrap }
})
class SideBar extends Vue {
  @Prop({ type: String }) logo
  @Prop({ type: String }) title
  @Prop({ type: String }) active
  @Prop({ default: false, type: Boolean }) collapse
  @Prop({ type: Array }) menusTree

  created () {
    console.log('this.menusTree', JSON.parse(JSON.stringify(this.menusTree)))
  }
}
export default SideBar
</script>

<style lang="scss" scoped>
.fix-menu {
  height: 100%;
  border-right: unset;
  /*background-color: #545c64;*/
  background-color: #fef2e5;
  overflow-y: scroll;

  &:not(.el-menu--collapse) {
    width: 220px;
  }

  /deep/ {
    .el-menu--inline {
      background-color: #fce6d0;
    }

    .el-submenu__title {
      color: #333333;
      font-size: 13px!important;

      &:hover {
        color: #f39d47;
        background-color: unset;
      }
      i {
        color: inherit;
      }
    }

    .el-menu-item {
      height: 48px!important;
      line-height: 48px!important;
      font-size: 13px!important;
      color: #333333;
      cursor: pointer;
      &:focus,
      &:hover,
      &.is-active {
        color: white;
        background-color: rgb(254, 173, 126);
        .iconfont{
          color: white;
        }
      }
    }
  }
}
</style>
