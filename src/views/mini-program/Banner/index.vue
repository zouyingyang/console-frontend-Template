<template>
  <div v-loading="loading" class="loading-wrap">
    <Card class="fix-card">
      <template slot="head">
        <span></span>
        <div>
          <el-button @click="handleBannerContent()" type="primary" size="mini" icon="el-icon-plus">添加新广告</el-button>
        </div>
      </template>
      <template v-if="tableData" slot="content">
        <div v-if="tableData.records.length">
          <el-table
              border
              :data="tableData.records"
              style="width: 100%">
              <el-table-column
                  label="发布日期"
                  width="180">
                  <template slot-scope="scope">
                      <span v-if="scope.row.publishDate">{{ dateFormat.format(scope.row.publishDate, 'yyyy-MM-dd HH:mm:ss') }}</span>
                      <span v-else>--</span>
                  </template>
              </el-table-column>
              <el-table-column
                  label="广告图"
                  width="180">
                  <template slot-scope="scope">
                    <div class="img-wrap">
                      <img :src="ossPath + scope.row.bannerImg" :alt="scope.row.bannerImg">
                    </div>
                  </template>
              </el-table-column>
              <el-table-column
                  label="跳转链接">
                  <template slot-scope="scope">
                      <a :href="scope.row.goUrl" class="goUrl-text">{{scope.row.goUrl}}</a>
                      <p>发布人：{{scope.row.publishBy}}</p>
                  </template>
              </el-table-column>
              <el-table-column
                  label="状态">
                  <template slot-scope="scope">
                      <p>{{statusList[scope.row.status]}}</p>
                  </template>
              </el-table-column>
              <el-table-column
                  label="操作"
                  width="280">
                  <template slot-scope="scope">
                    <div v-if="scope.row.status !== 2">
                      <!-- 需求：已上架的广告不能编辑 -->
                      <el-button
                          size="mini"
                          :disabled="scope.row.status === 1"
                          @click="handleBannerContent(scope.$index, scope.row)">编辑</el-button>
                      <el-popover
                          placement="top"
                          width="190"
                          v-model="scope.row.visibleOfDelete"
                          class="f-margin">
                          <p style="text-align: center;margin-bottom: 10px;">是否删除此banner？</p>
                          <p>删除后，此广告将不再显示！且无法恢复！</p>
                          <div style="text-align: right; margin: 0">
                              <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row, 0)">取消</el-button>
                              <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row, 1)">确认删除</el-button>
                          </div>
                          <el-button
                              slot="reference"
                              size="mini"
                              type="danger"
                              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                      </el-popover>
                      <el-button
                          size="mini"
                          :type="scope.row.status ? 'info' : 'primary'"
                          @click="handleStatus(scope.$index, scope.row)">
                          {{scope.row.status ? '下架' : '上架'}}
                      </el-button>
                    </div>
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
    <el-dialog title="广告上传" :visible.sync="dialogForm.isVisible" :close-on-click-modal="false">
      <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="100px" class="bannerForm">
        <el-form-item label="上传图片" prop="bannerImg">
          <upload class="fix-upload" ref="upload" @onUploadChange="handleBannerChange">
            <template slot="content">
              <img v-if="dialogForm.bannerImg" :src="ossPath + dialogForm.bannerImg">
              <i v-else class="el-icon-plus"></i>
            </template>
          </upload>
          <p>支持gif/jpg/png格式</p>
        </el-form-item>
        <el-form-item label="跳转链接" prop="goUrl">
          <el-input v-model="dialogForm.goUrl" :placeholder="baseUrl.appUrl">
            <!-- <template slot="prepend">Https://</template> -->
          </el-input>
          <p class="help-block">必须以https://开头且在小程序关联域名下的链接</p>
        </el-form-item>
        <!-- <el-form-item>
            <el-button type="primary" @click="submitForm('dialogForm')">立即创建</el-button>
            <el-button @click="resetForm('dialogForm')">重置</el-button>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancle()">取 消</el-button>
        <el-button type="primary" @click="submitForm('dialogForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import CURRENT_ENV_PATH from '../../../services/baseUrl'
import dateFormat from 'element-ui/lib/utils/date'

import Card from '@/components/Card'
import Upload from '@/components/Upload'
import NonData from '@/components/NonData'

const moduleBanner = namespace('banner')
const moduleUser = namespace('user')

@Component({
  components: { Card, Upload, NonData }
})
export default class Banner extends Vue {
  isSubmit = false
  loading = true
  ossPath = CURRENT_ENV_PATH.ossPath
  baseUrl = CURRENT_ENV_PATH
  dateFormat = dateFormat
  banner = ''
  currentPage = 1
  currentSize = 10
  dialogForm = {
    isVisible: false,
    bannerImg: '',
    goUrl: ''
  }
  tableData = null
  statusList = ['已下架', '已上架', '已删除']

  validateGoUrl = (rule, value, callback) => {
    const reURL = /^(https?|http):\/\/.+$/
    if (value === '') {
      callback(new Error('请输入跳转链接'))
    } else if (!reURL.test(value)) {
      callback(new Error('必须以https://开头!'))
    } else if (!value.includes(CURRENT_ENV_PATH.appUrl)) {
      callback(new Error('请输入小程序关联域名下的链接!'))
    } else {
      callback()
    }
  }

  rules = {
    goUrl: [
      { validator: this.validateGoUrl, required: true, trigger: 'blur' }
    ],
    bannerImg: [
      { required: true, message: '未上传图片', trigger: 'change' }
    ]
  }

  @moduleBanner.Action getBannerList
  @moduleBanner.Action getBannerDetail
  @moduleBanner.Action addBannerDetail
  @moduleBanner.Action updateBannerDetail
  @moduleUser.Getter userInfo

  handleBannerContent (index, row) {
    this.dialogForm.isVisible = !this.dialogForm.isVisible
    if (row) {
      // reset form
      // this.banner = ''
      this.dialogForm = Object.assign(this.dialogForm, row)
    } else {
      // this.$refs.dialogForm.resetFields()
      this.dialogForm = {
        isVisible: true,
        bannerImg: '',
        goUrl: ''
      }
    }
  }

  handleStatus (index, row) {
    this.updateBannerDetail({ id: row.id, status: +!this.tableData.records[index].status }).then(res => {
      // console.log(res)
      if (res.status) {
        // this.tableData.records[index].status = +!this.tableData.records[index].status
        this.$message.success(`操作成功，已${this.tableData.records[index].status ? '上架' : '下架'}`)
        this.renderTableData()
      }
    })
  }

  handleDelete (index, row, isDelete) {
    if (isDelete) {
      // 删除操作
      this.updateBannerDetail({ id: row.id, status: 2 }).then(res => {
        // console.log(res)
        if (res.status) {
          // this.tableData.records.splice(index, 1)
          this.$message.success('删除成功')
          this.renderTableData()
        }
      })
    } else {
      console.log(this.tableData.records[index])
      this.tableData.records[index].visibleOfDelete = !this.tableData.records[index].visibleOfDelete
    }
  }

  handleSizeChange (val) {
    console.log(`每页 ${val} 条`)
    this.currentSize = val
    this.renderTableData()
  }

  handleCurrentChange (val) {
    console.log(`当前页: ${val}`)
    this.currentPage = val
    this.renderTableData()
  }

  onCancle () {
    this.dialogForm.isVisible = false
  }

  submitForm (formName) {
    this.$refs.dialogForm.validate((valid) => {
      if (valid) {
        this.dialogForm.isVisible = false
        // alert('submit!');
        this.isSubmit = true
        console.log(this.dialogForm)
        let postData
        if (this.dialogForm.id) {
          postData = {
            id: this.dialogForm.id,
            goUrl: this.dialogForm.goUrl,
            bannerImg: this.dialogForm.bannerImg
          }
          this.updateBannerDetail(postData).then((res) => {
            if (res.status) {
              this.$message.success('成功更新广告')
              this.isSubmit = false
              this.renderTableData()
              this.$refs.dialogForm.resetFields()
            }
          })
        } else {
          postData = {
            goUrl: this.dialogForm.goUrl,
            bannerImg: this.dialogForm.bannerImg
          }
          this.addBannerDetail(postData).then((res) => {
            if (res.status) {
              this.$message.success('成功添加新广告')
              this.isSubmit = false
              this.renderTableData()
              this.$refs.dialogForm.resetFields()
            }
          })
        }
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  handleBannerChange (file) {
    console.log(file)
    this.dialogForm.bannerImg = file.url
    // this.banner = file.url
    // this.dialogForm.banner = file.raw

    // 触发表单验证
    // this.$refs.dialogForm.validateField('bannerImg')
  }

  renderTableData (params = {}) {
    const sortData = {
      SortType: 'DESC',
      sortColumn: 'create_dt',
      pageNo: this.currentPage || 1,
      pageSize: this.currentSize || 10
    }
    this.loading = true
    this.getBannerList(Object.assign(params, sortData)).then(res => {
      console.log(res)
      this.loading = false
      if (res.status) {
        this.tableData = res.data
        this.tableData.records.map(record => {
          this.$set(record, 'visibleOfDelete', false)
        })
      } else {
        this.$message('请求失败或者数据结构发生变化，请联系开发人员。')
      }
    })
  }

  created () {
    // console.log('createdddddd', this.userInfo, JSON.parse(sessionStorage.getItem('userInfo')))
    this.renderTableData()
  }
}
</script>

<style src="./style.scss" lang="scss" scoped></style>
