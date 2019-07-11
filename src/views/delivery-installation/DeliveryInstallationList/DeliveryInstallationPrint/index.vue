<template>
  <div v-loading="loading" class="op-delivery-installation-print">
    <Card>
      <el-tabs v-model="activeName" @tab-click="handleClick" slot="head">
        <el-tab-pane
          v-for="(list, index) in tableData"
          :label="'送货安装单:' + list.no"
          :name="list.no"
          :key="index">
          <PrintTable :tableData="list.orderVo" :tableInfo="list"></PrintTable>
        </el-tab-pane>
      </el-tabs>
    </Card>
  </div>
</template>
<script>

import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import PrintTable from '../../../delivery-installation/FullInfoTable/components/PrintTable'
import Card from '@/components/Card'
const deliveryInstallationList = namespace('delivery-installation/deliveryInstallationList')

  @Component({
    components: { PrintTable, Card }
  })
export default class DeliveryInstallationPrint extends Vue {
    loading = false
    params = {
    }
    activeName = ''
    tableData = [] // 列表数据

    // 打印送货安装单
    @deliveryInstallationList.Action printInstallList

    // 数据初始化
    initData () {
      this.loading = true
      this.printInstallList({ ids: this.$route.query.ids }).then(res => {
        this.loading = false
        if (res.status && res.data.length) {
          this.tableData = res.data
          this.activeName = res.data[0].no
        } else {
          this.tableData = []
        }
      }).catch(error => {
        this.loading = false
        console.log('获取打印数据error', error)
      })
    }

    handleClick (tab, event) {
      console.log(tab, event)
    }

    created () {
      this.initData()
    }
  }
</script>

<style src="./style.scss" lang="scss"></style>
