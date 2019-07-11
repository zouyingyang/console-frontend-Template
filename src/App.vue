<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

const moduleUser = namespace('user')
const moduleComment = namespace('comment')

@Component()
export default class App extends Vue {
  @moduleUser.Action getCurrentUser
  @moduleUser.Action getMenuList
  @moduleComment.Action getStoreList
  @moduleUser.Getter userInfo

  async created () {
    // 获取用户信息写入到 state.userInfo
    await this.getCurrentUser({ 'platformType': 'MTDS2' }).then(() => {
      // 获取菜单节点，写入到 state.menuList
      this.getMenuList({ 'userId': this.userInfo.globalId, 'platformType': 'MTDS2' }).then(res => {
        if (this.$route.name !== 'warehouse-space') {
          this.getStoreList({ flag: true }) // 获取用户所在商场的仓库，写入到 state
        }
        let targetTo = window.sessionStorage.getItem('targetTo')
        targetTo = JSON.parse(targetTo) || {}
        if (targetTo && targetTo.name !== 'analysis' && targetTo.name !== '403') {
          window.sessionStorage.setItem('targetTo', '')
          this.$router.push({
            name: targetTo.name,
            query: targetTo.query
          })
        }
      })
    })
  }
}
</script>
