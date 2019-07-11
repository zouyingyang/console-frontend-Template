<template>
  <div v-loading="loading" class="op-order-details">
    <Card>
      <el-tabs slot="content" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(list,index) in serviceInfo.orders"
          :key="index"
          v-model="activeName"
          :label="'送货安装单：'+list.installNo"
          :name="list.id"
          :lazy="true">
          <details-show-cards :serviceInfo="serviceInfo" :orderInfo="list"></details-show-cards>
        </el-tab-pane>
      </el-tabs>
    </Card>
  </div>
</template>
<script>

import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import DetailsShowCards from './DetailsShowCards.vue'
import Card from '@/components/Card'
const orderDispatch = namespace('delivery-installation/order-dispatch-list')
  @Component({
    components: { DetailsShowCards, Card }
  })
export default class OrderDetails extends Vue {
    serviceInfo = {}
    activeName = ''
    loading=false
    @orderDispatch.Action detailContent

    // 根据服务号获取订单详情
    getDailByServiceId () {
      if (!this.serviceId || !this.orderId) {
        this.$message.warning('服务单id或订单id为空')
        this.$router.go(-1)
        return
      }
      this.loading = true
      this.detailContent({
        serviceId: this.serviceId,
        orderId: this.orderId
      }).then((res) => {
        console.log('获取订单详情res', res)
        this.loading = false
        if (res.status && res.code === '200') {
          if (res.data.orders.length === 0) {
            this.$message.warning('当前订单详情信息为空！')
            this.$router.go(-1)
          }
          this.serviceInfo = res.data
          // this.activeName = res.data.orders ? res.data.orders[0].id : ''
        }
      }).catch((err) => {
        console.log('获取订单详情err', err)
        this.loading = false
      })
    }
    handleClick (tab, event) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 300)
    }
    created () {
      this.serviceId = this.$route.query.serveNum || ''
      this.orderId = this.$route.query.orderNum || ''
      this.activeName = this.$route.query.orderNum || '无'
      this.getDailByServiceId()
    }
  }
</script>
<style lang="scss">
.op-order-details{
  min-height:500px;
  .card{
    min-height: 300px;
  }
  .el-card__header{
    padding: 10px 20px;
    font-weight: 600;
  }
}
</style>
