<template>
  <div>
    <div class="AttendantManagement">
      <Card v-loading="loading">
        <div class="header" slot="head">
          <div class="header-toolbar">
            <div class="op-left">
              <el-button @click="addPersonal" type="primary" size="mini" >新增人员</el-button>
              <el-button @click="ShowUpload" type="primary" size="mini" >导入</el-button>
              <el-button @click="exportList" type="primary" size="mini" >导出</el-button>
              <el-button @click="downloadTemplate" type="text"  size="mini" >下载导入模板</el-button>
            </div>
            <div class="search-form op-right">
              <el-input
                maxlength="20"
                size="mini"
                placeholder="姓名/电话"
                v-model="params.searchKeyword"
                clearable
                @clear="initData(search = true)"
                @keyup.enter.native="initData(search = true)"
                class="searchInput">
              </el-input>
              <el-button type="primary" size="mini" @click="initData(search = true)">搜索</el-button>
            </div>
          </div>
        </div>
        <div slot="content">
          <el-table
            class="table-content"
            :max-height="tableHeight"
            :data="tableData"
            :tableHead="tableHead"
            border
            style="width: 100%">
            <div v-for="(list,index) in tableHead" :key="index">
              <template v-if="list.name ==='序号'">
                <el-table-column
                  :prop="list.value"
                  min-width="30"
                  align="center"
                  :label="list.name">
                  <template slot-scope="scope">
                    {{tableData.indexOf(scope.row) * 1 + 1 + no}}
                  </template>
                </el-table-column>
              </template>
              <template v-else-if="list.name ==='操作'">
                <el-table-column
                  align="center"
                  min-width="30"
                  :label="list.name">
                  <template slot-scope="scope">
                    <el-button @click="deleteShow(scope.row)" type="text">删除</el-button>
                  </template>
                </el-table-column>
              </template>
              <template v-else-if="list.name ==='人员类别'">
                <el-table-column
                  :prop="list.value"
                  align="center"
                  min-width="100"
                  :label="list.name">
                  <template slot-scope="scope">
                    {{scope.row[list.value] === 0 ? '内部人员':'外部人员'}}
                  </template>
                </el-table-column>
              </template>
              <template v-else-if="list.name ==='备注'">
                <el-table-column
                  :prop="list.value"
                  align="center"
                  min-width="120"
                  :label="list.name">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row[list.value]" placement="top">
                      <el-input @change="changeContentList(scope.row)" maxlength="50" v-model="scope.row[list.value]"></el-input>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </template>
              <template v-else-if="list.name ==='姓名'">
              <el-table-column
                :prop="list.value"
                align="center"
                min-width="100"
                :label="list.name">
                <template slot-scope="scope">
                  <el-input @change="changeContentList(scope.row)" v-if="scope.row.type !== 0" maxlength="20" v-model="scope.row[list.value]"></el-input>
                  <template v-else>{{scope.row[list.value]}}</template>
                </template>
              </el-table-column>
            </template>
              <template v-else-if="list.name ==='电话号码'">
                <el-table-column
                  :prop="list.value"
                  align="center"
                  min-width="100"
                  :label="list.name">
                  <template slot-scope="scope">
                    <el-input @change="changeContentList(scope.row)" v-if="scope.row.type !== 0" maxlength="11" v-model="scope.row[list.value]"></el-input>
                    <template v-else>{{scope.row[list.value]}}</template>
                  </template>
                </el-table-column>
              </template>
              <template v-else-if="list.name ==='性别'">
                <el-table-column
                  :prop="list.value"
                  align="center"
                  min-width="70"
                  :label="list.name">
                  <template slot-scope="scope">
                    <el-dropdown size="small" trigger="click"  @command="changeContent" placement="bottom-start" v-if="scope.row.type !== 0" class="personal-dropdown">
                      <el-input readonly maxlength="30" v-model="scope.row[list.value]"></el-input>
                      <el-dropdown-menu slot="dropdown" class="personal-menu">
                        <el-dropdown-item :command="{value:'男',item:scope.row}">男</el-dropdown-item>
                        <el-dropdown-item :command="{value:'女',item:scope.row}">女</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <template v-else>{{scope.row[list.value]}}</template>
                  </template>
                </el-table-column>
              </template>
            </div>
          </el-table>
        </div>
        <el-pagination
          slot="foot"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 50]"
          :page-size="20"
          layout="total, sizes, prev, pager, next"
          :total="totalSize">
        </el-pagination>
      </Card>
      <!--确认删除-->
      <el-dialog
        v-loading="deleteLoading"
        title=""
        :visible.sync="isShowDelete"
        width="30%"
        :close-on-click-modal="false"
        center>
          <h3 style="text-align: center">温馨提示</h3>
          <p style="text-align: center">您确认要删除该条名称为: <span class="red">{{deleteCell.name}}</span> 的人员信息吗？</p>
          <span slot="footer" class="dialog-footer">
          <el-button @click="isShowDelete = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="submitDelete" size="mini">确 定</el-button>
        </span>
      </el-dialog>

      <!--上传弹窗-->
      <el-dialog
        v-loading="uploadLoading"
        title=""
        :visible.sync="isShowUpload"
        width="30%"
        class="show-upload"
        :close-on-click-modal="false"
        center>
        <upload class="fix-upload el-upload-dragger" ref="upload" :accept="['xls','xlsx']" :acceptTips="'请使用xls或xlsx格式的表格'" @onUploadChange="handleBannerChange">
          <template slot="content">
            <div>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text"><em>点击选择导入文件</em></div>
            </div>
          </template>
        </upload>
        <ul v-if="uploadcell.requestUrls" class="el-upload-list el-upload-list--text">
          <li tabindex="0" class="el-upload-list__item is-success">
            <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{uploadcell.raw.file.name}}</a>
            <label class="el-upload-list__item-status-label">
              <i class="el-icon-upload-success el-icon-circle-check"></i>
            </label>
            <i class="el-icon-close" @click="deleteUpload"></i>
          </li>
        </ul>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShowUpload = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="submitUpload" size="mini">确定导入</el-button>
        </span>
      </el-dialog>

      <!--新增人员弹窗-->
      <el-dialog title="新增人员"
                 custom-class="newly-dialog"
                 :visible.sync="isNewly"
                 :close-on-click-modal="false"
                 width="25%"
                 center>
        <div class="newly-box">
          <el-form v-loading="oneloading" :model="newlyPersonal" :inline="true">
            <el-row>
              <el-form-item label="人员类别" size="mini" class="must-check">
                <el-radio-group v-model="newlyPersonal.type">
                  <el-radio label="0">内部人员</el-radio>
                  <el-radio label="1">外部人员</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item v-if="newlyPersonal.type === '1'" label="姓名" size="mini" class="must-check">
                <el-input
                  clearable
                  maxlength="20"
                  size="mini"
                  placeholder="请输入姓名"
                  v-model="newlyPersonal.name">
                </el-input>
              </el-form-item>
              <el-form-item v-else label="姓名" size="mini" class="must-check">
              <el-dropdown trigger="click" placement="bottom-start" class="personal-dropdown">
                  <el-input id="Personalname" class="el-dropdown-link" v-model="Personalname" placeholder="请输入姓名" @change="inputNameChange">
                  </el-input>
                  <el-dropdown-menu slot="dropdown" class="personal-menu">
                      <el-tree v-loading="treeLoading" :render-content="renderContent" :filter-node-method="filterNode" ref="viewTree" node-key="id" :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="电话" size="mini" class="must-check">
                <el-input
                  clearable
                  type="age"
                  :readonly="newlyPersonal.type === '0'"
                  maxlength="11"
                  size="mini"
                  placeholder="请输入电话"
                  v-model="newlyPersonal.phonenum">
                </el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="性别" size="mini" class="must-check">
                <el-dropdown v-if="newlyPersonal.type === '1'" @command="handleCommand" placement="bottom-start" class="personal-dropdown">
                  <el-input readonly class="el-dropdown-link" v-model="newlyPersonal.sex" placeholder="请选择性别">
                  </el-input>
                  <el-dropdown-menu slot="dropdown" class="personal-menu">
                    <el-dropdown-item command="男">男</el-dropdown-item>
                    <el-dropdown-item command="女">女</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-input v-else readonly class="el-dropdown-link sex-input" v-model="newlyPersonal.sex" placeholder="请选择性别"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="备注" size="mini">
                <el-input
                  clearable
                  maxlength="50"
                  size="mini"
                  placeholder="请输入备注"
                  v-model="newlyPersonal.remark">
                </el-input>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isNewly = false">取 消</el-button>
          <el-button type="primary" @click="submitNewly">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Component, Watch, Vue } from 'vue-property-decorator'
import Card from '@/components/Card'
import storage from '@/utils/storage'
import axios from 'axios'
import CURRENT_ENV_PATH from '@/services/baseUrl.js'
import Upload from '@/components/Upload'
import { namespace } from 'vuex-class'
import { changeCN } from '@/utils/filter'

const kingnurseModule = namespace('king-nurse/index')

  @Component({
    components: { Card, Upload },
    filters: { changeCN }
  })
export default class AttendantManagement extends Vue {
    loading = false
    totalSize = 0
    currentPage = 1
    tableHeight = 0
    searchKeyword=''
    deleteCell =''
    no = 0
    deleteLoading = false
    uploadLoading = false
    treeLoading = false
    ossPath = CURRENT_ENV_PATH.ossPath
    isShowUpload = false
    uploadcell ={}
    oneloading = false
    isNewly = false // 新增人员弹窗
    chooseCell ='' // 人员信息 -string/object
    Personalname = '' // 内部人员姓名
    isShowDelete=false // 删除行弹窗
    department = {}
    userInfo = ''
    params = {
      pageNum: 1,
      pageSize: 20,
      searchKeyword: ''
    }
    newlyPersonal = {
      type: '0',
      name: '',
      phonenum: '',
      sex: '',
      remark: ''
    }
    data = []
    defaultProps= {
      children: 'children',
      label: 'name'
    }

    tableHead = [
      { name: '备注', value: 'remark' },
      { name: '序号', value: '' },
      { name: '操作', value: '' },
      { name: '姓名', value: 'name' },
      { name: '电话号码', value: 'phonenum' },
      { name: '性别', value: 'sex' },
      { name: '人员类别', value: 'type' }
    ]
    tableData= []
    // 获取组织人员架构树
    @kingnurseModule.Action getOrgChildNodes
    // 根据条件获取金保姆列表
    @kingnurseModule.Action getGoldenHousekeeperList
    // 根据用户id获取用户的信息
    @kingnurseModule.Action getUserById
    // 新增金保姆
    @kingnurseModule.Action saveGoldenHousekeeper
    // 修改金保姆人员
    @kingnurseModule.Action updateGoldenHousekeeper
    // 删除金保姆人员
    @kingnurseModule.Action deleteGoldenHousekeeper
    // 获取导入模板url
    @kingnurseModule.Action getDownloadImportTemplate
    // 根据条件导出金保姆列表
    @kingnurseModule.Action exportGoldenHousekeeperList
    // 导入金保姆人员
    @kingnurseModule.Action importExcel

    initData (search) {
      this.loading = true
      if (search === true) {
        this.params.pageNum = 1
      }
      this.no = (this.params.pageNum - 1) * (this.params.pageSize * 1)
      this.getGoldenHousekeeperList({ ...this.params }).then(res => {
        if (res.code === '200') {
          this.tableData = res.data.list
          this.totalSize = res.data.total
          this.loading = false
          console.log('获取金保姆列表res', res)
        }
      }).catch(error => {
        this.loading = false
        console.log('获取金保姆列表error', error)
      })
    }
    // 新增人员
    addPersonal () {
      this.isNewly = true
    }
    renderContent (h, { node, data, store }) {
      return (<span><i classtype={data.iconSkin} class={data.iconSkin === 'department' ? 'icon--zuzhiguanli iconfont' : (data.iconSkin === 'position' || data.iconSkin === 'team' ? 'icon-huaban iconfont' : (data.iconSkin === 'employee' ? 'icon-gerenyonghutouxiang2 iconfont' : 'icon-xianxiamendian iconfont'))}></i><span class="el-tree-node__label">{node.label}</span></span>)
    }

    // 上传弹窗
    ShowUpload () {
      this.isShowUpload = true
    }
    // 删除上传文件
    deleteUpload () {
      console.log('删除文件成功')
      this.uploadcell = {}
    }
    // 上传回调
    handleBannerChange (file) {
      console.log('name>>>', file.raw.file.name, 'requestUrls>>>', file.requestUrls)
      this.uploadcell = file
    }
    // 确认上传
    submitUpload () {
      if (this.uploadcell.requestUrls) {
        this.uploadLoading = true
        console.log('requestUrls', this.uploadcell.requestUrls[0])
        this.importExcel({ filePath: this.uploadcell.requestUrls[0] }).then(res => {
          if (res.code === '200') {
            this.initData()
            this.uploadLoading = false
            this.isShowUpload = false
            console.log('导入金保姆人员res', res)
          }
        }).catch(error => {
          this.uploadLoading = false
          // this.isShowUpload = false
          console.log('导入金保姆人员error', error)
        })
      } else {
        this.$message.warning('请选择导入的文件')
      }
    }
    // 按条件导出
    exportList () {
      this.loading = true
      axios({
        method: 'get',
        baseURL: CURRENT_ENV_PATH.baseUrl,
        url: '/mtdssales-housekeeper/goldenHousekeeper/exportGoldenHousekeeperList?searchKeyword=' + this.params.searchKeyword,
        responseType: 'blob'
      }).then(res => {
        console.log('导出金保姆列表res', res.data)
        this.loading = false
        let blob = res.data
        let anchor = document.createElement('a')
        anchor.download = '金保姆人员列表.xlsx'
        anchor.href = URL.createObjectURL(blob)
        document.body.appendChild(anchor)
        anchor.click()
        this.$message.success('导出成功')
      }).catch((error) => {
        this.loading = false
        this.$message.error('导出失败,系统出现异常')
        console.log('导出金保姆列表error', error)
      })
    }
    // 下载模板
    downloadTemplate () {
      this.getDownloadImportTemplate().then(res => {
        if (res.code === '200') {
          console.log('下载导出成功res', res)
          window.open(res.data)
        }
      }).catch(error => {
        console.log('下载导出成功error', error)
      })
    }

    // 列表更改
    changeContentList (row) {
      row.name = row.name.replace(/\s+/g, '')
      row.phonenum = row.phonenum.replace(/\s+/g, '')
      row.remark = row.remark.replace(/\s+/g, '')
      if (row.phonenum.length < 11) {
        this.$message.warning('请输入11位手机号码')
        this.initData()
      } else {
        if ((/^[1]([3-9])[0-9]{9}$/.test(row.phonenum))) {
          this.updateKingNurse(row)
        } else {
          this.$message.warning('输入手机号码格式有误')
          this.initData()
        }
      }
    }
    // 列表中性别选择
    changeContent (cell) {
      cell.item.sex = cell.value
      this.updateKingNurse(cell.item)
    }
    // 金保姆信息更改
    updateKingNurse (item) {
      let { id, name, orgid, orgno, phonenum, remark, sex, type, userId } = item
      let params = {}
      if (item.type === 0) {
        params = { id: id, name: name, orgid: orgid, orgno: orgno, phonenum: phonenum, remark: remark, sex: sex, type: type, userId: userId }
      } else {
        params = { id: id, name: name, orgid: orgid, orgno: orgno, phonenum: phonenum, remark: remark, sex: sex, type: type }
      }
      if (params.sex) {
        params.sex === '男' ? params.sex = 'male' : params.sex = 'female'
      }
      this.loading = true
      this.updateGoldenHousekeeper({ ...params }).then(res => {
        if (res.code === '200') {
          this.initData()
          this.loading = false
          console.log('金保姆信息修改res', res)
        } else {
          this.loading = false
          console.log('金保姆信息修改错误', res)
        }
      }).catch(error => {
        this.initData()
        this.loading = false
        console.log('金保姆信息修改error', error)
      })
    }
    // 树结构选择确认
    handleNodeClick (data) {
      // console.log('data.iconSkin', data.iconSkin)
      if (data.iconSkin === 'employee') {
        document.getElementById('Personalname').click()
        this.oneloading = true
        this.chooseCell = JSON.parse(JSON.stringify(data))
        this.getUserById({ userId: data.id }).then(res => {
          this.oneloading = false
          if (res.code === '200') {
            console.log('获取用户的信息res', res)
            this.newlyPersonal.phonenum = res.data.phonenum
            this.newlyPersonal.sex = res.data.sex
          }
        }).catch(error => {
          this.clearData()
          this.oneloading = false
          console.log('获取用户的信息error', error)
        })
      }
    }
    // 树结构筛选
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
    // 输入名字改变时触发
    inputNameChange () {
      this.chooseCell = this.Personalname
      this.newlyPersonal.phonenum = ''
      this.newlyPersonal.sex = ''
      this.newlyPersonal.remark = ''
    }
    // 性别选择
    handleCommand (cell) {
      this.newlyPersonal.sex = cell
    }
    // 提交
    submitNewly () {
      if (this.newlyPersonal.type) {
        this.newlyPersonal.name = this.newlyPersonal.name.replace(/\s+/g, '')
        this.newlyPersonal.phonenum = this.newlyPersonal.phonenum.replace(/\s+/g, '')
        this.newlyPersonal.sex = this.newlyPersonal.sex.replace(/\s+/g, '')
        this.newlyPersonal.remark = this.newlyPersonal.remark.replace(/\s+/g, '')
        let params = JSON.parse(JSON.stringify(this.newlyPersonal))
        if (this.newlyPersonal.type === '0') {
          if (typeof (this.chooseCell) === 'object') {
            params.name = this.chooseCell.name
            params.userId = this.chooseCell.id
            if (this.newlyPersonal.phonenum.length < 11) {
              this.$message.warning('请输入11位手机号码')
            } else {
              if ((/^[1]([3-9])[0-9]{9}$/.test(this.newlyPersonal.phonenum))) {
                if (this.newlyPersonal.sex !== '') {
                  this.oneloading = true
                  let goldgarams = { ...params, orgid: this.department.departmentId, orgno: this.department.departmentNo }
                  if (params.sex) {
                    params.sex === '男' ? goldgarams.sex = 'male' : goldgarams.sex = 'female'
                  }
                  console.log('goldgarams', goldgarams)
                  this.saveGoldenHousekeeper({ ...goldgarams }).then(res => {
                    this.oneloading = false
                    this.isNewly = false
                    if (res.code === '200') {
                      console.log('新增金保姆res', res)
                      this.clearData()
                      this.clearParams()
                      this.initData()
                    } else {
                      console.log('新增金保姆错误', res)
                    }
                  }).catch(error => {
                    this.oneloading = false
                    this.isNewly = false
                    console.log('新增金保姆', error)
                  })
                } else {
                  this.$message.warning('必须填写性别')
                }
              } else {
                this.$message.warning('输入的手机号码格式有误')
              }
            }
          } else if (this.chooseCell === '') {
            this.$message.warning('请输入姓名')
          } else {
            this.$message.warning('内部人员不可手动维护，须从组织架构中选择')
          }
        } else if (this.newlyPersonal.type === '1') {
          if (!(params.name === '')) {
            if (this.newlyPersonal.phonenum.length < 11) {
              this.$message.warning('请输入11位手机号码')
            } else {
              if ((/^[1]([3-9])[0-9]{9}$/.test(this.newlyPersonal.phonenum))) {
                if (this.newlyPersonal.sex !== '') {
                  this.oneloading = true
                  let goldgarams = { ...params, orgid: this.department.departmentId, orgno: this.department.departmentNo }
                  if (params.sex) {
                    params.sex === '男' ? goldgarams.sex = 'male' : goldgarams.sex = 'female'
                  }
                  console.log('goldgarams', goldgarams)
                  this.saveGoldenHousekeeper({ ...goldgarams }).then(res => {
                    this.oneloading = false
                    this.isNewly = false
                    if (res.code === '200') {
                      console.log('新增金保姆res', res)
                      this.clearData()
                      this.initData()
                    } else {
                      console.log('新增金保姆错误', res)
                    }
                  }).catch(error => {
                    this.oneloading = false
                    this.isNewly = false
                    console.log('新增金保姆', error)
                  })
                } else {
                  this.$message.warning('必须填写性别')
                }
              } else {
                this.$message.warning('输入的手机号码格式有误')
              }
            }
          } else {
            this.$message.warning('请输入姓名')
          }
        }
      } else {
        this.$message.warning('请选择人员类别')
      }
    }
    // 删除行弹窗
    deleteShow (row) {
      this.isShowDelete = true
      this.deleteCell = row
    }
    // 确认删除
    submitDelete () {
      this.deleteLoading = true
      this.deleteGoldenHousekeeper({ id: this.deleteCell.id }).then(res => {
        this.deleteLoading = false
        this.isShowDelete = false
        if (res.code === '200') {
          this.initData()
          console.log('删除金保姆信息res', res)
        }
      }).catch(error => {
        this.initData()
        this.deleteLoading = false
        this.isShowDelete = false
        console.log('删除金保姆信息error', error)
      })
    }
    // 单页数量
    handleSizeChange (val) {
      this.params.pageSize = val
      this.initData()
    }
    // 处理翻页
    handleCurrentChange (val) {
      this.params.pageNum = val
      this.initData()
    }
    clearData () {
      this.newlyPersonal.name = ''
      this.newlyPersonal.phonenum = ''
      this.newlyPersonal.sex = ''
      this.newlyPersonal.remark = ''
      this.Personalname = ''
    }
    clearParams () {
      this.params.pageNum = 1
      this.params.pageSize = 20
      this.params.searchKeyword = ''
    }
    // 由于用户信息返回不稳定，另起定时器获取用户信息的数据
    watchUserInfo () {
      let UserInfo = setInterval(() => {
        this.userInfo = storage.getItem('userInfo')
        if (this.userInfo) {
          clearInterval(UserInfo)
        }
      }, 500)
    }
    mounted () {
    }
    created () {
      this.initData()
      this.tableHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 250
      this.watchUserInfo()
    }
    @Watch('Personalname')
    isChangeName (name) {
      this.$refs.viewTree.filter(name)
    }
    @Watch('newlyPersonal.type')
    isChangeType (newValue, old) {
      if (newValue !== old) {
        this.clearData()
      }
    }
    @Watch('isShowUpload')
    isChangeisShowUpload (newValue, old) {
      if (newValue === false) {
        this.uploadcell = {}
      }
    }
    @Watch('userInfo')
    isChangeuserInfo (userInfo, old) {
      console.log('userInfo', JSON.parse(userInfo))
      if (userInfo) {
        userInfo = JSON.parse(userInfo)
        this.treeLoading = true
        this.department = { departmentId: userInfo.departmentId, departmentNo: userInfo.departmentNo }
        this.getOrgChildNodes({ orgId: this.department.departmentId }).then(res => {
          this.treeLoading = false
          if (res.code === '200') {
            console.log('获取组织人员res', res)
            this.data = res.data
          }
        }).catch(error => {
          this.treeLoading = false
          this.$message.warning('获取组织人员error')
          console.log('获取组织人员error', error)
        })
      }
    }
    // @Watch('isNewly')
    // isChangeshow (newValue, old) {
    // }
    @Watch('chooseCell')
    isChangeChooseCell (cell) {
      if (typeof (cell) === 'object') {
        this.Personalname = this.chooseCell.name
      }
    }
  }
</script>

<style src="./style.scss" lang="scss"></style>
