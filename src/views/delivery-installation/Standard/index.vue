<template>
  <div>
    <Card>
      <div class="toolbar" slot="head">
        <div>
          <!-- <el-button style="margin-right:15px;" type="primary" size="mini" @click="showForm(true)">新增标准品</el-button>
          <el-button style="margin-right:15px;" type="primary" size="mini" @click="dialogImport=true">批量导入</el-button> -->
          <!-- <a
            class="download-link"
            href="http://opyx-mtds-test.oss-cn-shenzhen.aliyuncs.com/2018/10/30/1540889710474-57845703-a9f7d0709b050a6b/%E6%A0%87%E5%87%86%E5%93%81%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF%20.xlsx"
            download="productTemplate.xlsx"
            target="_blank"
          >下载导入模板</a> -->
        </div>
        <div class="search-form">
          <el-input
            size="mini"
            placeholder="合同自编号/显示名称/产品型号"
            clearable
            @clear="getData"
            v-model="searchKeyword"
            @keyup.enter.native="getData"
          >
          </el-input>
          <el-button
            type="primary"
            size="mini"
            @click="getData"
          >搜索</el-button>
        </div>
      </div>
      <div class="product-table" slot="content">
        <el-table
          :max-height="tableHeight"
          size='mini'
          :data="productTable"
          border
          v-loading="loading"
        >
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="marketName"
            label="商场名称">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="marketCode"
            label="商场编号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="105"
            align="center"
            prop="factoryContractNo"
            label="合同自编号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="productName"
            label="显示名称"
            >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="productCode"
            label="产品型号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="size"
            label="规格">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="level1Dir"
            label="一级目录">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="level2Dir"
            label="二级目录">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="level3Dir"
            label="三级目录">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="level4Dir"
            label="四级目录">
          </el-table-column>
          <el-table-column
            align="center"
            prop="quantity"
            label="产品数量">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="productUnit"
            label="单位">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="createBy"
            label="创建人">
          </el-table-column>
          <el-table-column
            align="center"
            width="135px"
            label="出库时间">
            <template slot-scope="scope">
              <span>{{ format(scope.row.stockTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="135px"
            label="创建时间">
            <template slot-scope="scope">
              <span>{{ format(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="updateBy"
            label="最后修改人">
          </el-table-column>
          <el-table-column
            width="135px"
            align="center"
            label="最后修改时间">
            <template slot-scope="scope">
              <span>{{ format(scope.row.updateTime) }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            align="center"
            fixed="right"
            label="操作"
            width="110">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="showForm(false, scope.row)"
                size="mini">
                编辑
              </el-button>
              <el-button
                type="text"
                @click="delProduct(scope.row)"
                size="mini">
                删除
              </el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <el-pagination
        slot="foot"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSize">
      </el-pagination>
    </Card>
    <el-dialog
      :title="isNew?'新增标准品':'编辑标准品'"
      :visible.sync="dialogFormVisible"
      width="920px"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form :model="dialogform">
        <div class="form-info1">
          <el-form-item label="产品名称" label-width='110px' size='mini'
                        :rules="[
                            { required: true, message: '请输入产品名称', trigger: ['blur', 'change'] }
                        ]"
          >
            <el-input maxlength="20" v-model="dialogform.productName" auto-complete="off" placeholder="请输入产品名称"></el-input>
          </el-form-item>
          <el-form-item label="产品编码" label-width='110px' size='mini'>
            <el-input maxlength="20" v-model="dialogform.productCode" auto-complete="off" placeholder="请输入产品编码"></el-input>
          </el-form-item>
          <el-form-item label="单位" label-width='110px' size='mini'>
            <el-input maxlength="50" v-model="dialogform.productUnit" auto-complete="off" placeholder="请输入单位"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini">取 消</el-button>
        <el-button type="primary" @click="newProduct" size="mini" v-if="isNew" :disabled="isDisable">确 定</el-button>
        <el-button type="primary" @click="editItemProduct" size="mini" v-else-if="!isNew" :disabled="isDisable2">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      @close="closeDialog2"
      title="批量导入"
      :visible.sync="dialogImport"
      width="50%"
      :close-on-click-modal="false">
      <el-steps
        :active="activeStep"
        finish-status="success"
        align-center
      >
        <el-step title="选择文件" :status="step1"></el-step>
        <el-step title="数据导入校验" :status="step2"></el-step>
      </el-steps>
      <el-form :model="dialogform" v-show="activeStep === 0">
        <el-form-item
          label-width='100px' size='mini'
        >
          <p style="margin-bottom: 0;">文件类型：</p>
          <el-select v-model="selectValue" placeholder="请选择" size="mini">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label-width='100px' size='mini'
        >
          <p style="margin: 0;">选择导入文件：</p>
          <div class="upload">
            <upload
              class="fix-upload"
              ref="upload"
              accept=".xls, .xlsx,.jpg"
              :limit="1"
              :before-upload="beforeUpload"
              @onUploadChange="handleChange"
              :on-exceed="handleExceed"
              :on-remove='handleRemove'>
              <template slot="content">
                <i class="el-icon-plus avatar-uploader-icon" style="font-size:20px;"></i>
              </template>
            </upload>
          </div>
        </el-form-item>
      </el-form>
      <div v-show="activeStep === 1">
        <div class="setp2"
          v-loading="checkLoading"
          element-loading-text="校验数据中..."
        >
          <p style="margin-left:1px;">验证结果：</p>
          <p class="successTips">{{importTips}}</p>
          <p class="errorTips">{{errorTips?"错误："+ errorTips: ""}}</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="stepChange(-1)" size="mini" :disabled="isPre">上一步</el-button>
        <el-button type="primary" @click="stepChange(1)" size="mini" v-if="activeStep === 0" :disabled="isNext">下一步</el-button>
        <el-button type="primary" @click="stepChange('ok')" size="mini" v-if="activeStep === 1" :disabled="isOk">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import Upload from '@/components/UploadImg/index'
import { namespace } from 'vuex-class'
import Card from '@/components/Card'
import { format } from '@/utils/filter'
const standardModule = namespace('delivery-installation/standard')
@Component({
  components: { Card, Upload }
})
export default class Standard extends Vue {
  tableHeight = 0
  loading = false
  isDisable = false
  isDisable2 = false
  name = 'standard'
  productTable = []
  dialogFormVisible = false
  dialogform = {
    productCode: '',
    productName: '',
    productUnit: ''
  }
  dialogImport = false
  options = [{ value: 'excel', label: 'EXCEL文件(.xls,.xlsx)' }]
  selectValue = 'excel'
  totalSize = 0
  activeStep = 0
  isNew = true
  currentPage = 1
  searchKeyword = ''
  activeItem = null
  @standardModule.Action addProduct
  @standardModule.Action deleteProduct
  @standardModule.Action updateProduct
  @standardModule.Action productList
  @standardModule.Action importProductExcel
  uploadImgList = []
  isPre = true
  isNext = true
  isOk = true
  step1 = ''
  step2 = ''
  excelFile = ''
  importTips = ''
  errorTips = ''
  checkLoading = false
  test () {
    // console.log('test')
    this.$refs.upload.clearFiles()
    // this.checkData()
    // console.log(this.selectValue)
  }
  format (timestamp, fmt) {
    return format(timestamp, 'yyyy-M-d HH:mm:s')
  }
  fileList = []
  beforeUpload (file) {
    return true
  }
  handleChange (file, fileList) {
    this.isNext = false
    this.step1 = 'success'
    // console.log('handleChange', fileList)
    this.excelFile = fileList[0].url
  }
  handleRemove (file, fileList) {
    // console.log('delete', file)
    this.step1 = ''
    this.excelFile = ''
    this.isNext = true
    this.isPre = true
  }
  handlePreview (file) {
    // console.log(file)
  }
  handleExceed (files, fileList) {
    this.$message.warning(`只能导入单个文件`)
  }
  beforeRemove (file, fileList) {
    return this.$confirm(`确定移除 ${file.name}？`)
  }
  closeDialog () {
    this.dialogform = {
      productCode: '',
      productName: '',
      productUnit: ''
    }
    this.dialogFormVisible = false
  }
  closeDialog2 () {
    this.$refs.upload.clearFiles()
    this.dialogImport = false
    this.activeStep = 0
    this.step1 = ''
    this.step2 = ''
    this.isNext = true
    this.isPre = true
    this.isOk = true
  }
  showForm (bool, data) {
    // console.log('datra >> ', data)
    this.isNew = bool
    this.dialogFormVisible = true
    if (!bool && data) {
      this.activeItem = data
      this.dialogform.productCode = data.productCode
      this.dialogform.productName = data.productName
      this.dialogform.productUnit = data.productUnit
    }
  }
  delProduct (item) {
    this.$confirm('是否删除该标准品?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.deleteProduct({
        id: item.id
      }).then((result) => {
        // console.log('getData result :', result)
        if (result.code === '200') {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success',
            duration: 1500
          })
          this.getData('')
        }
      }).catch((err) => {
        this.$message({
          duration: 2000,
          type: 'error',
          message: err.message
        })
      })
    }).catch(() => {
      // this.$message({
      //   type: 'info',
      //   message: '已取消删除',
      //   duration: 2000
      // })
    })
  }
  async editItemProduct () {
    if (!this.dialogform.productName) {
      this.$message({
        showClose: true,
        message: '产品名称不能为空',
        type: 'warning',
        duration: 1500
      })
      return
    }
    if (this.dialogform.productUnit.length > 8) {
      this.$message({
        showClose: true,
        message: '产品单位最多为八位',
        type: 'warning',
        duration: 1500
      })
      return
    }

    this.isDisable2 = true
    await this.updateProduct({
      productCode: this.dialogform.productCode,
      productName: this.dialogform.productName,
      productUnit: this.dialogform.productUnit,
      id: this.activeItem.id
    }).then((result) => {
      // console.log('result :', result)
      if (result.code === '200') {
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success',
          duration: 1500
        })
        this.dialogFormVisible = false
        this.getData()
      }
    }).catch(() => {})
    this.isDisable2 = false
  }
  async newProduct () {
    if (!this.dialogform.productName) {
      this.$message({
        showClose: true,
        message: '产品名称不能为空',
        type: 'warning',
        duration: 1500
      })
      return
    }

    if (this.dialogform.productUnit.length > 8) {
      this.$message({
        showClose: true,
        message: '产品单位最多为八位',
        type: 'warning',
        duration: 1500
      })
      return
    }

    // 发送请求
    this.isDisable = true
    await this.addProduct({
      productCode: this.dialogform.productCode,
      productName: this.dialogform.productName,
      productUnit: this.dialogform.productUnit
    }).then((result) => {
      // console.log('result :', result)
      if (result.code === '200') {
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success',
          duration: 1500
        })
        this.dialogFormVisible = false
        this.dialogform = {}
        this.getData()
      }
    }).catch(() => {})
    this.isDisable = false
  }
  async getData () {
    this.loading = true
    await this.productList({
      pageNum: this.currentPage,
      searchKeyword: this.searchKeyword
    }).then((result) => {
      if (result.code === '200') {
        this.productTable = result.data.list
        this.totalSize = result.data.total
      }
    }).catch(() => {
      // console.log('error:', err)
    })
    this.loading = false
  }
  handleCurrentChange (val) {
    this.currentPage = val
    this.getData()
    // console.log('val :', val)
  }
  checkData () {
    this.checkLoading = true
    this.importTips = ''
    this.errorTips = ''
    this.importProductExcel({
      filePath: this.excelFile
    }).then((result) => {
      this.importTips = result.data
      this.checkLoading = false
      this.isNext = false
      this.isPre = true
      this.step2 = 'success'
      this.isOk = false
      this.getData()
      // console.log(result)
    }).catch((err) => {
      // console.log(err)
      this.isOk = false
      this.isPre = false
      this.step2 = 'error'
      this.checkLoading = false
      this.errorTips = err.message
    })
  }
  stepChange (arg) {
    if (arg === 1) {
      this.activeStep += 1
      if (this.activeStep === 1) {
        this.isNext = true
        this.checkData()
      }
    }
    if (arg === -1 && this.activeStep > 0) {
      this.isOk = true
      this.step2 = ''
      this.isNext = false
      this.isPre = true
      this.activeStep -= 1
    }
    if (arg === 'ok') {
      this.step1 = ''
      this.step2 = ''
      this.isNext = true
      this.isPre = true
      this.isOk = true
      this.dialogImport = false
      this.$refs.upload.clearFiles()
      setTimeout(() => {
        this.activeStep = 0
      }, 10)
    }
  }
  created () {
    this.tableHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 250
  }
  mounted () {
    this.getData()
  }
}
</script>

<style src="./style.scss" lang="scss" scoped></style>
