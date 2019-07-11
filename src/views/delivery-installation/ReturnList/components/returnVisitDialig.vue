<template>
  <div class="return-visit-dialig" v-loading="loading">
    <el-dialog
      title="评价信息"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="55%"
      v-if="returnVisitVisible && scoringTableData"
      :visible.sync="returnVisitVisible">
      <el-form :inline="true" label-width="100px">
        <el-row>
          <!--<el-col :span="8">-->
            <!--<el-form-item label="客户评价时间" size="mini">-->
              <!--<el-date-picker-->
                <!--style="width:158px"-->
                <!--v-model="commentDate"-->
                <!--size="mini"-->
                <!--placeholder="选择客户评价时间"-->
                <!--type="datetime">-->
              <!--</el-date-picker>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="8">
            <el-form-item label="评价类型" size="mini">
              <el-input disabled v-model="params.servicetypeIdNoId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="回访人" size="mini">
              <el-input disabled v-model="userInfo.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="客户评价结果" size="mini">
            <el-table header-align="center" :data="scoringTableData.feedbacks" border style="width: 100%">
              <el-table-column align="center" prop="postType" label="岗位">
                <template slot-scope="props">
                  {{props.row.postType | postTypeFilter}}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="commentedName" label="姓名"></el-table-column>
              <el-table-column align="center" prop="commentScore" label="5分">
                <template slot-scope="props">
                  <el-radio v-model="props.row.commentScore" :label="5">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="commentScore" label="4分">
                <template slot-scope="props">
                  <el-radio v-model="props.row.commentScore" :label="4">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="commentScore" label="3分">
                <template slot-scope="props">
                  <el-radio v-model="props.row.commentScore" :label="3">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="commentScore" label="2分">
                <template slot-scope="props">
                  <el-radio v-model="props.row.commentScore" :label="2">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="commentScore" label="1分">
                <template slot-scope="props">
                  <el-radio v-model="props.row.commentScore" :label="1">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="commentScore" label="不评分">
                <template slot-scope="props">
                  <el-radio v-model="props.row.commentScore" label=""></el-radio>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="commentType" label="评价类型"></el-table-column>
              <el-table-column align="center" prop="remark" label="客服表扬或意见" min-width="150px">
                <template slot-scope="props">
                  <el-input type="textarea" v-model="props.row.remark"></el-input>
                </template>
              </el-table-column>
            </el-table>
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
      <div slot="footer" class="dialog-footer op-text-center">
        <el-button @click="returnVisitVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveReturnVisitData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { postTypeFilter } from '@/utils/filter'
import Upload from '@/components/UploadImg'
const moduleUser = namespace('user')
const returnListPort = namespace('delivery-installation/returnList')

  @Component({
    components: { Upload },
    filters: { postTypeFilter }
  })
export default class ReturnVisitDialig extends Vue {// 列表数据
    @Prop({ type: Object, default: {} }) scoringData
    loading = false
    returnVisitVisible = false
    commentDate = '' // 客户评价时间
    scoringTableData = {}
    params = {
      attachmentsInfo: [], // 上传附件
      comments: [], // 评价
      serviceNoId: '', // 服务号id
      servicetypeIdNoId: '客服回访', // 评价类型
      userId: '', // 回访用户id
      userName: '' // 回访用户名称
    }
    @moduleUser.Getter permission // 权限控制
    @moduleUser.Getter userInfo // 用户信息
    @returnListPort.Action saveReturnVisit // 提交回访

    @Watch('scoringData', { immediate: true })
    scoringDataWatch (value) {
      this.scoringTableData = JSON.parse(JSON.stringify(value))
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
        'type': '.' + suffixArr[suffixArr.length - 1]
      }
      this.params.attachmentsInfo.push(fileObj)
    }

    /*
    * 移除文件
    * */
    onRemoveHandle (file, fileList) {
      let attachmentsInfo = []
      if (this.params.attachmentsInfo.length) {
        this.params.attachmentsInfo.forEach(list => {
          if (list.name !== file.filename) {
            attachmentsInfo.push(list)
          }
        })
      }
      this.params.attachmentsInfo = attachmentsInfo
    }

    /*
    * 提交评价
    * */
    saveReturnVisitData (file, fileList) {
      let params = {
        attachmentsInfo: this.params.attachmentsInfo,
        comments: this.scoringTableData.feedbacks.map(list => {
          return {
            id: list.id,
            remark: list.remark,
            postType: list.postType,
            commentScore: list.commentScore,
            commentedId: list.commentedId
          }
        }),
        serviceNoId: this.scoringTableData.serviceNoId,
        userId: this.userInfo.id,
        userName: this.userInfo.name
      }
      this.saveReturnVisit({ ...params }).then(res => {
        this.loading = false
        res = JSON.parse(JSON.stringify(res))
        if (res.status) {
          this.$emit('initData', '')
          this.$message.success('保存成功')
          this.returnVisitVisible = false
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
</script>

<style lang="scss">
  .return-visit-dialig{

  }
</style>
