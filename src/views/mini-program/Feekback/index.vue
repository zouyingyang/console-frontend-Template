<template>
  <div v-loading="loading" class="loading-wrap">
    <!-- <Card>
      <template slot="head">
        <span>客户反馈</span>
      </template>
    </Card> -->

    <Card class="fix-card">
      <template slot="content">
        <!-- 4 -->
        <h3>量尺设计评价</h3>
        <div>
          <el-table v-if="feekbackData.measureList.length" border :data="feekbackData.measureList" style="width: 100%">
            <el-table-column label="设计师" width="100">
              <template slot-scope="scope">
                <!-- <i class="el-icon-time"></i> -->
                <span style="text-align:center;">{{ scope.row.commentedName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系方式" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.commentedMobile }}</span>
              </template>
            </el-table-column>
            <el-table-column label="评价星级" width="170">
              <template slot-scope="scope">
                <el-rate
                  v-model="scope.row.commentScore"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
                </el-rate>
              </template>
            </el-table-column>
            <el-table-column label="评价时间" width="100">
              <template slot-scope="scope">
                <p v-if="scope.row.commentDate">{{ dateFormat.format(scope.row.commentDate, 'yyyy-MM-dd HH:mm:ss') }}</p>
                <p v-else>--</p>
              </template>
            </el-table-column>
            <el-table-column label="评价标签">
              <template slot-scope="scope">
                <div class="tags-wrap">
                  <el-tag v-for="(item, index) in handleTags(scope.row.commentFlag)" :key="index"> {{item}}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="更多信息">
              <template slot-scope="scope">
                <p>{{ scope.row.commentMore }}</p>
              </template>
            </el-table-column>
          </el-table>
          <non-data v-else></non-data>
        </div>
        <h3>安装评价</h3>
        <div>
          <el-table v-if="feekbackData.installList.length" border :data="feekbackData.installList" style="width: 100%">
            <el-table-column label="安装师傅" width="100">
              <template slot-scope="scope">
                <!-- <i class="el-icon-time"></i> -->
                <span style="text-align:center;">{{ scope.row.commentedName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系方式" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.commentedMobile }}</span>
              </template>
            </el-table-column>
            <el-table-column label="评价星级" width="170">
              <template slot-scope="scope">
                <el-rate
                  v-model="scope.row.commentScore"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
                </el-rate>
              </template>
            </el-table-column>
            <el-table-column label="评价时间" width="100">
              <template slot-scope="scope">
                <p v-if="scope.row.commentDate">{{ dateFormat.format(scope.row.commentDate, 'yyyy-MM-dd HH:mm:ss') }}</p>
                <p v-else>--</p>
              </template>
            </el-table-column>
            <el-table-column label="评价标签">
              <template slot-scope="scope">
                <div class="tags-wrap">
                  <el-tag v-for="(item, index) in handleTags(scope.row.commentFlag)" :key="index"> {{item}}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="更多信息">
              <template slot-scope="scope">
                <p>{{ scope.row.commentMore }}</p>
              </template>
            </el-table-column>
          </el-table>
          <non-data v-else></non-data>
        </div>
        <h3>验收评价</h3>
        <div>
          <el-table v-if="feekbackData.acceptCheckList.length" border :data="feekbackData.acceptCheckList" style="width: 100%">
            <el-table-column label="产品质量" width="100">
              <template slot-scope="scope">
                <!-- <i class="el-icon-time"></i> -->
                <span style="text-align:center;">{{ scope.row.productQuality }}</span>
              </template>
            </el-table-column>
            <el-table-column label="服务质量" width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.serviceQuality }}</span>
              </template>
            </el-table-column>
            <el-table-column label="评价星级" width="170">
              <template slot-scope="scope">
                <el-rate
                  v-model="scope.row.commentScore"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
                </el-rate>
              </template>
            </el-table-column>
            <el-table-column label="评价时间" width="100">
              <template slot-scope="scope">
                <p v-if="scope.row.commentDate">{{ dateFormat.format(scope.row.commentDate, 'yyyy-MM-dd HH:mm:ss') }}</p>
                <p v-else>--</p>
              </template>
            </el-table-column>
            <el-table-column label="更多信息">
              <template slot-scope="scope">
                <p>{{ scope.row.commentMore }}</p>
              </template>
            </el-table-column>
          </el-table>
          <non-data v-else></non-data>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import dateFormat from 'element-ui/lib/utils/date'

import Card from '@/components/Card'
import NonData from '@/components/NonData'

const moduleOrder = namespace('order')

@Component({
  components: { Card, NonData }
})
export default class BasicForm extends Vue {
  dateFormat = dateFormat // 日期格式化
  loading = true
  feekbackData = {
    measureList: [],
    installList: [],
    acceptCheckList: []
  }

  @moduleOrder.Action getFeekbackList

  handleTags (val) {
    if (val) {
      return val.split(',')
    }
    return []
  }

  renderFeekBackList () {
    const params = {
      serviceOrderNo: this.$route.params.id
    }
    this.getFeekbackList(params).then(res => {
      // console.log(res.data)
      this.loading = false
      if (res.status) {
        res.data.dataList.map(item => {
          if (item.typeId === 5) {
            this.feekbackData.installList.push(item)
          } else if (item.typeId === 4) {
            this.feekbackData.measureList.push(item)
          } else if (item.typeId === 7) {
            this.feekbackData.acceptCheckList.push(item)
          }
        })
      }
    })
  }

  created () {
    this.renderFeekBackList()
  }
}
</script>
<style src="./style.scss" lang="scss" scoped></style>
