<template>
  <el-container class="fix-container" :class="{ 'overlay': isFixedAsideShow }">
    <el-aside
      v-show="!isOuterChain"
      class="fix-aside"
      ref="aside"
      :class="{'isFixed': fixedAside,'isFixedAsideShow': isFixedAsideShow}">
      <SideBar
        title="营销服务平台"
        :logo="logo"
        :menusTree="menusTree"
        :active="currentActive"
        :collapse="isCollapse">
      </SideBar>
    </el-aside>
    <el-container class="el_container_main">
      <el-header v-show="!isOuterChain" class="fix-header">
        <NavBar :collapse="isCollapse" @onCollapse="handleCollapse">
          <Breadcrumb slot="breadcrumb"></Breadcrumb>
          <el-dropdown class="fix-dropdown" slot="main">
            <UserCard :userName="userInfo.userName ? userInfo.userName : '游客'" :avatar="avatar"></UserCard>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleLogout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </NavBar>
      </el-header>
      <!-- 路由导航 -->
      <RouteHistoricalRecord></RouteHistoricalRecord>
      <el-main class="fix-main">
        <transition name="fade-transform" mode="out-in">
          <router-view class="router-view"/>
        </transition>
        <FooterInfo v-if="!isOuterChain"></FooterInfo>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
/**
   * 插件、类、库
   */
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import storage from '@/utils/storage'

/**
   * 基础组件
   */
import UserCard from '@/components/UserCard'
import FooterInfo from '@/components/FooterInfo'

/**
   * 局部组件
   */
import SideBar from './components/SideBar'
import NavBar from './components/NavBar'
import SearchFiled from './components/SearchFlied'
import MessageBox from './components/MessageBox'
import Breadcrumb from './components/Breadcrumb'
import RouteHistoricalRecord from './components/RouteHistoricalRecord'

/**
   * 工具
   */
import { layoutMixin } from '@/utils/mixin'

const moduleUser = namespace('user')

  @Component({
    components: {
      SideBar, NavBar, SearchFiled, UserCard, MessageBox, FooterInfo, Breadcrumb, RouteHistoricalRecord
    },
    mixins: [layoutMixin]
  })
class App extends Vue {
    logo = require('@/assets/images/logo.png')
    currentActive = ''
    isOuterChain = false // 是否是外链接
    isCollapse = false
    preSideBarStatus = ''
    fixedAside = false
    isFixedAsideShow = false

    @moduleUser.Getter userInfo
    @moduleUser.Getter avatar
    @moduleUser.Getter menusTree

    @moduleUser.Action logout
    @moduleUser.Action setUserLogout

    handleCollapse () {
      if (this.preSideBarStatus === 'xs') {
        this.isCollapse = false
        this.isFixedAsideShow = !this.isFixedAsideShow
      } else {
        this.isCollapse = !this.isCollapse
      }
    }

    handleLogout () {
      this.setUserLogout().then((res) => {
        if (res.status) {
          this.logout()
          window.location = res.data
        }
      }).catch(error => {
        console.log('退出登录error', error)
      })
    }
    getOuterChain (isOuterChain) {
      let OuterChain = JSON.parse(storage.getItem(isOuterChain)) || ''
      if (OuterChain === 'YES') {
        this.isOuterChain = true
      } else {
        OuterChain = this.$route.query.isOuterChain || ''
        if (OuterChain === 'YES') {
          this.isOuterChain = true
          storage.setItem('isOuterChain', JSON.stringify(OuterChain))
        }
      }
    }
    created () {
      this.getOuterChain('isOuterChain')
    }
    @Watch('$route', { immediate: true })
    onRouterChange (route) {
      if (route.meta && route.meta.menu) {
        this.currentActive = route.meta.menu
      }
    }
  }
export default App
</script>

<style lang="scss" scoped>
  .fix-container {
    height: 100%;

    &.overlay {
      &::before {
        content: '';
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #5253534b;
        z-index: 998;
      }
    }
  }

  .fix-aside {
    height: 100%;
    /*overflow-y: scroll;*/
    width: unset !important;
    border-right: solid 1px #e6e6e6;
    z-index: 1000;

    &.isFixed {
      position: fixed;
      width: 0;
      height: 100%;
      transform: translateX(-100%);
      z-index: 999;
      transition: transform 0.25s ease-in-out;

      &.isFixedAsideShow {
        transform: translateX(0);
        transition: transform 0.25s ease-in-out;
      }
    }
  }

  .fix-header {
    padding: 0;
    border-bottom: 1px #ebeef5 solid;
  }
  .fix-dropdown {
    margin-left: 25px;
  }
  .router-view{
    min-height: calc(100vh - 120px);
  }
  .fix-main {
    position: relative;
    -webkit-overflow-scrolling: touch;
  }
  .el_container_main{
    height: 100%;
    overflow-y: scroll;
  }
</style>
