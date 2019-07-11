<template>
  <div class="acceptance-dialog" v-loading.fullscreen.lock="loading">
    <el-dialog
      title="评价信息"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :close="acceptanceDialogClose"
      width="55%"
      v-if="acceptanceVisible"
      :visible.sync="acceptanceVisible">
      <el-form :model="params" ref="acceptanceRef" :inline="true" label-width="100px" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="验收项目" size="mini" prop="acceptanceItem">
              <el-radio-group v-model="params.acceptanceItem">
                <el-radio label="process">过程验收</el-radio>
                <el-radio label="quality">质量验收</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="验收结果" size="mini" prop="isPass">
              <el-radio-group v-model="params.isPass">
                <el-radio label="1">通过</el-radio>
                <el-radio label="0">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" size="mini" class="acceptance-remark">
              <el-input type="textarea" v-model="params.remark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件上传" size="mini">
              <Upload class="fix-upload" ref="upload" accept="*" @onUploadChange="handleUpload" :on-remove='onRemoveHandle'>
                <template slot="content">
                  <i class="el-icon-plus avatar-uploader-icon" style="font-size:20px;"></i>
                </template>
              </Upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-collapse v-if="acceptanceRecords && acceptanceRecords.length">
        <el-collapse-item
          v-for="(list,index) in acceptanceRecords"
          :key="index + 'deliveryRecords'"
          :name="index+1">
          <template slot="title">
            验收记录{{(index + 1) | toChinesNum}}
            <!--&nbsp;&nbsp;&nbsp;&nbsp;{{list.createTime | format('yyyy-M-d HH:mm:s')}}-->
            <!--&nbsp;&nbsp;&nbsp;&nbsp;-->
            <!--<span style="color: #fead7e;">{{list.deliveryOwner ? list.deliveryOwner : '暂无数据'}}</span>-->
            <!--<span> / {{list.deliveryFacilitator ? list.deliveryFacilitator : '暂无数据'}}</span>-->
          </template>
            <el-col :span="12" class="acceptanceList">
              <span class="itemLable">验收时间: </span>
              <span v-if="list.createTime">{{list.createTime | format('yyyy-M-d HH:mm:s')}}</span>
              <span v-else>暂无数据</span>
            </el-col>
            <el-col :span="12" class="acceptanceList">
              <span class="itemLable">验收人: </span>
              <span>{{list.createBy ? list.createBy : '暂无数据'}}</span>
            </el-col>
            <el-col :span="12" class="acceptanceList">
              <span class="itemLable">验收项目: </span>
              <el-radio disabled v-model="list.acceptanceItem" label="process">过程验收</el-radio>
              <el-radio disabled v-model="list.acceptanceItem" label="quality">质量验收</el-radio>
            </el-col>
            <el-col :span="12" class="acceptanceList">
              <span class="itemLable">验收结果: </span>
              <el-radio disabled v-model="list.isPass" label="1">通过</el-radio>
              <el-radio disabled v-model="list.isPass" label="0">不通过</el-radio>
            </el-col>
            <el-col :span="24" class="acceptanceList">
              <span class="itemLable">上传附件: </span>
              <span v-if="!list.attachmentList || !list.attachmentList.length">暂无数据</span>
            </el-col>
            <el-col :span="24">
              <span style="margin-left:5px" class="op-inline-block op-vertical-top">
                <img-preview
                  v-if="list.attachmentList && list.attachmentList.length"
                  :deleteRequired="false"
                  :imgList='filterImg(list.attachmentList)'>
                </img-preview>
              </span>
            </el-col>
            <el-col :span="24">
              <span class="itemLable">备注: </span>
              <span>{{list.remark ? list.remark : "暂无数据"}}</span>
            </el-col>
        </el-collapse-item>
      </el-collapse>
      <div slot="footer" class="dialog-footer op-text-center">
        <el-button @click="acceptanceVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAcceptanceData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { postTypeFilter, toChinesNum, format } from '@/utils/filter'
import CURRENT_ENV_PATH from '@/services/baseUrl'
import Upload from '@/components/UploadImg'
import ImgPreview from '@/components/ImgPreview'
const moduleUser = namespace('user')
const acceptancePort = namespace('delivery-installation/acceptance')

  @Component({
    components: { Upload, ImgPreview },
    filters: { postTypeFilter, toChinesNum, format }
  })
export default class ReturnVisitDialig extends Vue {
    @Prop({ type: Object, default: {} }) acceptanceData
    loading = false
    acceptanceVisible = false
    commentDate = '' // 客户评价时间
    params = {
      acceptanceItem: '', // 验收项目
      ids: '', // 订单id组合
      isPass: '', // 验收结果
      positionList: [], // 定位签到信息
      remark: '', // 备注
      uploadAttachmentJson: [], // 附件
      serviceOrderId: ''
    }
    acceptanceTableData = {} // 订单验收数据
    acceptanceRecords = [] // 验收记录
    rules = {// 验收表单校验
      acceptanceItem: [
        { required: true, message: '请选择验收项目', trigger: 'change' }
      ],
      isPass: [
        { required: true, message: '请选择验收结果', trigger: 'change' }
      ]
    }

    @moduleUser.Getter permission // 权限控制
    @moduleUser.Getter userInfo // 用户信息
    @acceptancePort.Action acceptanceRecord // 获取验收记录
    @acceptancePort.Action finishAcceptance // 完成验收
    @Watch('acceptanceData', { immediate: true })
    acceptanceDataWatch (value) {
      // console.log('验收详情数据', JSON.parse(JSON.stringify(value)))
      this.acceptanceDialogClose()
      this.acceptanceTableData = JSON.parse(JSON.stringify(value))
      value && value.serviceId && this.acceptanceRecord({ serviceOrderId: value.serviceId }).then(res => {
        this.params.serviceOrderId = value.serviceId
        // console.log('获取验收记录res', JSON.parse(JSON.stringify(res))
        if (res.status) {
          this.acceptanceRecords = res.data
        }
      })
    }

    /*
    * 文件上传成功，返回上传文件数据
    * file
    * */
    handleUpload (file, files) {
      let suffixArr = file.filename.split('.')
      let fileObj = {
        'name': file.filename,
        'path': file.name,
        'size': file.file.file.size,
        'suffix': '.' + suffixArr[suffixArr.length - 1],
        'type': file.file.file.type
      }
      this.params.uploadAttachmentJson.push(JSON.stringify(fileObj))
    }

    /*
    * 移除文件
    * */
    onRemoveHandle (file, fileList) {
      let uploadAttachmentJson = []
      if (this.params.uploadAttachmentJson.length) {
        this.params.uploadAttachmentJson.forEach(list => {
          if (list.name !== file.filename) {
            uploadAttachmentJson.push(JSON.stringify(list))
          }
        })
      }
      this.params.uploadAttachmentJson = uploadAttachmentJson
    }

    /*
    * 完成验收
    * */
    saveAcceptanceData () {
      this.$refs['acceptanceRef'].validate((valid) => {
        if (valid) {
          let params = {
            acceptanceItem: this.params.acceptanceItem, // 验收项目
            ids: (this.acceptanceTableData.orders.map(list => { return list.id })).join(','), // 订单id组合
            serviceOrderId: this.params.serviceOrderId, // 服务单id
            isPass: this.params.isPass, // 验收结果
            positionList: [], // 定位签到信息
            remark: this.params.remark, // 备注
            uploadAttachmentJson: (this.params.uploadAttachmentJson).join('|') // 附件
          }
          this.loading = true
          this.finishAcceptance({ ...params }).then(res => {
            this.loading = false
            res = JSON.parse(JSON.stringify(res))
            if (res.status) {
              this.$emit('initData')
              this.$message.success('保存成功')
              this.acceptanceVisible = false
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }

    acceptanceDialogClose () {
      let params = {
        acceptanceItem: '', // 验收项目
        ids: '', // 订单id组合
        isPass: '', // 验收结果
        positionList: [], // 定位签到信息
        remark: '', // 备注
        uploadAttachmentJson: [], // 附件
        serviceOrderId: this.params.serviceOrderId // 附件
      }
      this.params = params
    }

    filterImg (arr, type = '') {
      if (Array.isArray(arr)) {
        let newArr = []
        for (const list of arr) {
          let picPath = list.picPath || list.path
          picPath = picPath.substr(0, 4).toLowerCase() === 'http' ? picPath : CURRENT_ENV_PATH.ossPath + picPath
          if (list.businessType === type || !type) {
            newArr.push({ url: picPath })
          }
        }
        return newArr
      }
      return []
    }
  }
</script>

<style lang="scss">
  .acceptance-dialog{
    .acceptance-remark{
      width: 100%;
      .el-form-item__content{
        width: 70%;
      }
    }
    .acceptanceList{
      margin-bottom: 10px;
    }
  }
</style>
