<template>
    <div class="op-analysis">
      <img class="op-analysis-bg" src="../../../assets/images/homeBg.png">
    </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { namespace } from 'vuex-class'

import ChartCard from './components/ChartCard'
import MapCard from './components/MapCard'
import { toThousands } from '@/utils/filter'
import chartConfig from './config'

const moduleCharts = namespace('charts')

@Component({
  components: { ChartCard, MapCard },
  filters: { toThousands }
})
export default class Analysis extends Vue {
  datePick = [new Date(), new Date()]
  chartConfig = chartConfig
  pickerOptions = {
    disabledDate: date => date.getTime() > Date.now()
  }
  bgurl = '@/assets/images/homeBg.png'

  @moduleCharts.State chartCardDate
  @moduleCharts.State mapCardData

  @moduleCharts.Action getAllChartsDate
  @moduleCharts.Action getMapDate

  created () {
    // this.getAllChartsDate()
  }

  fetchMapDate () {
    // this.getMapDate()
  }
}
</script>
<style lang="scss" scoped>
  .el-container{
    background-color: #fff;
  }
  .op-analysis-bg{
    width: 100%;
    object-fit: cover;
  }
</style>
