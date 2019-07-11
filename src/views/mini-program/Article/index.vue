<template>
  <div v-loading="loading" class="loading-wrap">
    <Card class="fix-card">
      <template slot="head">
        <span></span>
        <div>
          <el-button @click="handleArticleContent()" type="primary" size="mini" icon="el-icon-plus">添加新文章</el-button>
        </div>
      </template>
      <template v-if="tableData" slot="content">
        <div v-if="tableData.records.length">
          <el-table border :data="tableData.records" style="width: 100%">
            <el-table-column label="修改日期" width="180">
              <template slot-scope="scope">
                <!-- <i class="el-icon-time"></i> -->
                <span v-if="scope.row.lastUpdateDt" style="margin-left: 10px">{{ dateFormat.format(scope.row.lastUpdateDt, 'yyyy-MM-dd HH:mm:ss') }}</span>
                <span v-else style="margin-left: 10px">--</span>
              </template>
            </el-table-column>
            <el-table-column label="内容">
              <template slot-scope="scope">
                <div class="article-content">
                  <div class="img-wrap">
                    <img v-if="scope.row.picture" :src="ossPath + scope.row.picture" :alt="scope.row.picture">
                    <span v-else>暂无图片</span>
                  </div>
                  <div class="content-wrap">
                    <h3 class="elips">{{scope.row.shortTitle}}</h3>
                    <p>阅读量: {{scope.row.searchQty || 0}}</p>
                    <p class="elips">发布人: {{scope.row.creator}}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="280">
              <template slot-scope="scope">
                <el-button size="mini" :disabled="scope.row.status === 1" @click="handleArticleContent(scope.$index, scope.row)">编辑</el-button>
                <el-popover placement="top" width="190" v-model="scope.row.visibleOfDelete" class="f-margin">
                  <p style="text-align: center;margin-bottom: 10px;">是否删除此文章？</p>
                  <p>删除后，此文章将不再显示！且无法恢复！</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row, 0)">取消</el-button>
                    <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row, 1)">确认删除</el-button>
                  </div>
                  <el-button slot="reference" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </el-popover>
                <el-popover placement="top" width="190" v-model="scope.row.visibleOfStatus">
                  <p>是否{{scope.row.status ? '下架' : '上架'}}此文章？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="handleStatus(scope.$index, scope.row, 0)">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleStatus(scope.$index, scope.row, 1)">确认{{scope.row.status ? '下架' : '上架'}}</el-button>
                  </div>
                  <el-button slot="reference" size="mini" :type="scope.row.status ? 'info' : 'primary'" @click="handleStatus(scope.$index, scope.row)">
                    {{scope.row.status ? '下架' : '上架'}}
                  </el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[10, 20, 50]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.total">
            </el-pagination>
          </div>
        </div>
        <non-data v-else></non-data>
      </template>
    </Card>
  </div>
</template>

<script>
// import Vue from 'vue'
// import Component from 'vue-class-component'
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import Card from '@/components/Card'
import NonData from '@/components/NonData'
import CURRENT_ENV_PATH from '../../../services/baseUrl'
import dateFormat from 'element-ui/lib/utils/date'

const moduleArticle = namespace('article')

@Component({
  components: { Card, NonData }
})
export default class BasicForm extends Vue {
  ossPath = CURRENT_ENV_PATH.ossPath
  isSubmit = false
  loading = true
  article = ''
  dateFormat = dateFormat
  paramsOfTable = {
    isXiaoAi: true
    // categoryId: '938025bb009f4cf0a379f9affb9d1913'
  }
  currentPage = 1
  currentSize = 10
  tableData = null
  @moduleArticle.Action getArticleList
  @moduleArticle.Action articleUpdateStatus
  @moduleArticle.Action deleteArticleDetail

  handleDelete (index, row, isDelete) {
    if (isDelete) {
      // 删除操作
      // this.tableData.records.splice(index, 1)
      this.deleteArticleDetail({ id: row.id }).then(res => {
        this.$message.success('删除成功')
        this.renderTabelData(this.paramsOfTable)
      })
    }
    this.tableData.records[index].visibleOfDelete = !this.tableData.records[index].visibleOfDelete
  }

  handleArticleContent (index, row) {
    // console.log(index, row)
    // 跳转页面
    this.$router.push({ name: 'article-detail', query: { articleId: row ? row.id : '' } })
  }

  handleStatus (index, row, isUpdate) {
    if (isUpdate) {
      // 更新状态
      this.articleUpdateStatus({ id: row.id, status: +!row.status }).then(res => {
        if (res.status) {
          this.$message.success(`${row.status ? '下架' : '上架'}成功`)
          this.renderTabelData(this.paramsOfTable)
          this.tableData.records[index].status = +!this.tableData.records[index].status
        }
      })
    }
    this.tableData.records[index].visibleOfStatus = !this.tableData.records[index].visibleOfStatus
  }

  handleSizeChange (val) {
    console.log(`每页 ${val} 条`)
    this.currentSize = val
    this.renderTabelData(this.paramsOfTable)
  }

  handleCurrentChange (val) {
    console.log(`当前页: ${val}`)
    this.currentPage = val
    this.renderTabelData(this.paramsOfTable)
  }

  handleArticleChange (file) {
    this.article = file.url
    this.articleForm.article = file.raw

    // 触发表单验证
    this.$refs.articleForm.validateField('article')
  }

  renderTabelData (params) {
    const postData = {
      pageNo: this.currentPage,
      pageSize: this.currentSize
    }
    this.loading = true
    this.getArticleList(Object.assign(params, postData)).then(res => {
      console.log(res)
      this.loading = false
      if (res.status) {
        this.tableData = res.data
      }
    })
  }

  created () {
    this.renderTabelData(this.paramsOfTable)
  }
}
</script>

<style src="./style.scss" lang="scss" scoped></style>
