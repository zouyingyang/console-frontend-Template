<template>
  <div v-loading="loading" class="my-case-index">
    <Card>
      <el-col :span="24" slot="head">
        <el-form size="mini" ref="formResidual" :model="formResidual" :rules="formResidualRules" label-width="100px" class="demo-form-inline">
          <div class="form-title">
            <h3>基本信息</h3>
          </div>
          <!-- <el-form-item class="oneThird" label="申请单号">
            <el-input v-model="formResidual.orderId" disabled></el-input>
          </el-form-item> -->
          <el-form-item class="oneThird" label="合同自编号">
            <el-input v-model="formResidual.factoryContractNo" disabled></el-input>
          </el-form-item>
          <el-form-item class="oneThird" label="单据类型">
            <el-input value="遗留申报" disabled></el-input>
          </el-form-item>
          <div class="form-title">
            <h3>遗留申报信息</h3>
            <div class="form-title__right">
              <el-button type="primary" size="mini" @click="onAddApplyInfo">添加</el-button>
            </div>
          </div>
          <div v-for="(list, index) in formResidual.applyInfo" v-bind:key="index" class="info-list">
            <el-form-item class="aHalf" label="申请原因" :prop="`applyInfo.${index}.reason`" :rules="[
              { required: true, message: '请选择申请原因', trigger: 'change' }
            ]">
              <el-select v-model="list.reason" placeholder="申请原因">
                <el-option v-for="item in applyReasonList" v-bind:key="item.labelCode" :label="item.labelName" :value="item.labelCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="aHalf" label="板件条码" :prop="`applyInfo.${index}.barcode`" :rules="[
              { max: 30, message: '板件条码长度在 30 个字符内', trigger: 'blur' }
            ]">
              <el-input v-model="list.barcode"></el-input>
            </el-form-item>
            <br>
            <el-form-item class="aHalf" label="合同自编号" :prop="`applyInfo.${index}.platesContractNo`">
              <el-input v-model="list.platesContractNo" disabled></el-input>
            </el-form-item>
            <el-form-item class="aHalf" label="规格" :prop="`applyInfo.${index}.size`">
              <el-input v-model="list.size" disabled></el-input>
            </el-form-item>
            <el-form-item class="aHalf" label="名称" :prop="`applyInfo.${index}.name`">
              <el-input v-model="list.name" disabled></el-input>
            </el-form-item>
            <el-form-item class="aHalf" label="颜色" :prop="`applyInfo.${index}.color`">
              <el-input v-model="list.color" disabled></el-input>
            </el-form-item>
            <el-form-item class="aHalf" label="材料" :prop="`applyInfo.${index}.material`">
              <el-input v-model="list.material" disabled></el-input>
            </el-form-item>
            <div class="aHalf text-right" v-if="index !== 0">
              <el-button type="info" size="mini" @click="onDeleteApplyInfo(index)">删除</el-button>
            </div>
          </div>
          <div class="form-title">
            <h3>遗留申报附件</h3>
          </div>
          <el-form-item label="备注" prop="desc" :rules="[
            { max: 100, message: '备注长度在 100 个字符内', trigger: 'blur' }
          ]">
            <el-input type="textarea" v-model="formResidual.desc"></el-input>
          </el-form-item>
          <el-form-item label="上传附件" size='mini' label-width="100px" prop="attachment">
            <div class="upload-item">
              <upload class="fix-upload" ref="upload" :multiple="true" @onUploadChange="handleUpload" :on-remove='onRemoveHandle'>
                <template slot="content">
                  <i class="el-icon-plus avatar-uploader-icon" style="font-size:20px;"></i>
                </template>
              </upload>
            </div>
          </el-form-item>
          <div class="form-title">
            <h3>审核人信息</h3>
          </div>
          <!-- <el-form-item label="审核人" prop="checkedBy">
            <el-select v-model="formResidual.checkedBy" placeholder="请选择审核人">
              <el-option label="本人" value="shanghai"></el-option>
              <el-option label="某某某" value="beijing"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="审核人" prop="checkedBy">
            <el-tag type="info" class="checkTag" v-if="formResidual.checkedBy.length===0">暂未选择</el-tag>
            <el-tag v-else v-for="(item,index) in formResidual.checkedBy" :key="index">
              {{item.name}}
            </el-tag>
            <el-button type="text" @click="onChooseCheckedBy">选择</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :loading="isSubmitting">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </Card>
    <el-dialog
      title="审核人选择"
      :visible.sync="isShowChecker"
      width="52%"
      height="45%"
      :close-on-click-modal="false"
      center
      append-to-body>
      <DeliveryAndSetter :type="null"
                         @choseDeliveryInstallStaff="onClose"
                         :changeState="isShowChecker"></DeliveryAndSetter>
    </el-dialog>
  </div>
</template>
<script>

import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Card from '@/components/Card'
import Upload from '@/components/UploadImg/index'
import DeliveryAndSetter from '@/views/delivery-installation/DeliveryInstallationList/components/DeliveryAndSetter'
const residual = namespace('delivery-installation/residual')

  @Component({
    components: { Card, Upload, DeliveryAndSetter }
  })
export default class AddResidual extends Vue {
    loading = false
    small = '?x-oss-process=style/small'
    isShowChecker = false
    isSubmitting = false
    formResidual = { // 遗留申报表单数据结构
      orderId: '',
      orderNo: '',
      factoryContractNo: '',
      applyInfo: [
        {
          reason: '',
          barcode: '',
          platesContractNo: '',
          size: '',
          name: '',
          color: '',
          material: ''
        }
      ],
      desc: '',
      attachment: [],
      checkedBy: []
    }
    applyReasonList = [] // 申请原因列表

    formResidualRules = {
      attachment: [
        { required: true, message: '请上传附件', trigger: 'change' }
      ],
      checkedBy: [
        { required: true, message: '请选择审核人', trigger: 'change' }
      ]
    }

    @residual.Action getReasonList // 获取原因列表
    @residual.Action submitleaveDeclareInfo // 提交遗留单申请

    onAddApplyInfo () {
      this.formResidual.applyInfo.push({
        reason: '',
        barcode: '',
        platesContractNo: '',
        size: '',
        name: '',
        color: '',
        material: ''
      })
    }

    onDeleteApplyInfo (i) {
      if (i === 0) {
        this.$message.error('至少有一个遗留申报信息')
        return false
      }
      this.formResidual.applyInfo.splice(i, 1)
    }

    handleUpload (item) { // 附件上传操作
      // console.log('handleUpload', item)
      this.formResidual.attachment.push({
        name: item.filename,
        suffix: item.filename.substring(item.filename.lastIndexOf('.')),
        size: item.file.size,
        path: item.name,
        url: item.name,
        type: item.file.type
      })
    }

    onRemoveHandle (item) { // 附件删除
      // console.log('onRemoveHandle', item)
      const index = this.formResidual.attachment.findIndex(x => { return item.url === x.url })
      this.formResidual.attachment.splice(index, 1)
    }

    onChooseCheckedBy () {
      this.isShowChecker = true
    }

    // 选择审核人关闭
    onClose (data) {
      // this.dimOwner = []
      // this.dimOwner.push(data)
      // console.log(data, 'close')
      this.formResidual.checkedBy = []
      this.formResidual.checkedBy.push(data)
      this.isShowChecker = false
    }

    onSubmit () {
      this.$refs['formResidual'].validate((valid) => {
        if (valid) {
          // console.log(this.formResidual)
          const attachment = []
          this.formResidual.attachment.map(item => {
            attachment.push(JSON.stringify(item))
          })
          const postData = {
            attachmentIds: attachment.join('|'),
            checkedBy: this.formResidual.checkedBy[0].sourceUserId,
            declareInfoList: this.formResidual.applyInfo,
            factoryContractNo: this.formResidual.factoryContractNo,
            orderNo: this.formResidual.orderNo,
            orderId: this.formResidual.orderId,
            orderType: '遗留单',
            remark: this.formResidual.desc
          }
          // console.log(postData)
          this.isSubmitting = true
          this.submitleaveDeclareInfo(postData).then(res => {
            if (res.status) {
              this.isSubmitting = false
              this.$message.success('遗留申报提交成功')
              this.$router.go(-1) // 返回前一页
            }
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    }

    renderReasonList (paramas = {}) {
      this.getReasonList(paramas).then(res => {
        if (res.status) {
          this.applyReasonList = res.data.sort((a, b) => {
            const aCode = a.labelCode
            const bCode = b.labelCode
            if (aCode > bCode) {
              return 1
            } else if (aCode < bCode) {
              return -1
            } else {
              return 0
            }
          })
        }
      })
    }

    // // 监听添加送货安装弹窗更新订单总数
    // @Watch('isShowBatchJoin')
    // isShowBatchJoinChange (isShowBatchJoin) {
    //   if (!isShowBatchJoin) {
    //     this.initData()
    //   } else {
    //     this.getTotalNum()
    //   }
    // }

    created () {
      this.renderReasonList()
    }
    mounted () {
      this.formResidual.orderId = this.$route.query.id
      this.formResidual.orderNo = this.$route.query.orderNo
      this.formResidual.factoryContractNo = decodeURIComponent(this.$route.query.factoryContractNo) // factoryContractNo 包含中文
    }
  }
</script>

<style src="./style.scss" scoped lang="scss"></style>
