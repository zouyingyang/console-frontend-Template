<template>
  <div>
    <Card>
      <div class="toolbar" slot="head">
        <div>
          <el-button type="primary" size="mini" @click="warehousesManagement()">新增库位</el-button>
        </div>
        <el-dialog :title="isNew?'新增库位':'编辑库位'" :visible.sync="dialogFormVisible" width="630px" :close-on-click-modal="false" @close="closeDialog">
          <el-form :model="dialogform">
            <div class="form-info1">
              <el-form-item label="仓库地址" label-width='100px' size='mini'>
                <el-input maxlength="50" v-model="dialogform.storeAddress" auto-complete="off" placeholder="请输入仓库地址" class="input-item"></el-input>
              </el-form-item>
            </div>
            <div class="form-info1">
              <el-form-item label="仓库联系人" label-width='100px' size='mini'>
                <el-input maxlength="20" v-model="dialogform.storeContacts" auto-complete="off" placeholder="请输入仓库联系人"></el-input>
              </el-form-item>
              <el-form-item label="仓库联系人电话" label-width='130px' size='mini'
                            :rules="[{ type: 'number' }]">
                <el-input maxlength="11" v-model.number="dialogform.contactsPhone" auto-complete="off" placeholder="请输入仓库联系人电话"></el-input>
              </el-form-item>
            </div>
            <div class="form-info2">
              <template v-for="(item, index) in warehouse">
                <el-form-item class="form-ku" :label="index === 0?'仓库库位':''" label-width='100px' size='mini' :key="index" :rules="[
                                  { required: true, message: '请输入仓库库位', trigger: ['blur', 'change'] }
                              ]">
                  <div class="form-ku-item">
                    <el-input maxlength="20" class="form-ku-input" v-model="warehouse[index]" auto-complete="off" placeholder="请选择仓库库位">
                    </el-input>
                    <div class="add-remove" v-if="index === (warehouse.length-1) && isNew">
                      <el-button circle type="text" @click='addItem'>
                        <i class="el-icon-circle-plus-outline"></i>
                      </el-button>
                      <el-button circle type="text">
                        <i class="el-icon-remove-outline" @click='removeItem'></i>
                      </el-button>
                    </div>
                  </div>
                </el-form-item>
              </template>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog"  size="mini">取 消</el-button>
            <el-button type="primary" @click="newStore" size="mini" v-if="isNew" :disabled="isDisable">确 定</el-button>
            <el-button type="primary" @click="editItemStore" size="mini" v-else-if="!isNew" :disabled="isDisable2">确 定</el-button>
          </div>
        </el-dialog>
        <div class="search-form">
          <el-input
            maxlength="20"
            size="mini"
            placeholder="仓库库位、仓库地址"
            v-model="searchKeyword"
            clearable
            @clear="getData"
            @keyup.enter.native="getData"
          >
          </el-input>
          <el-button type="primary" size="mini" @click="getData">搜索</el-button>
        </div>
      </div>
      <div class="warehouse-table" slot="content">
        <el-table
          :max-height="tableHeight"
          :data="storeTable"
          size='mini'
          border
          v-loading="loading"
          align="center"
        >
          <el-table-column
            prop="marketName"
            label="商场名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="marketCode"
            label="商场编号"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="store"
            label="仓库库位"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="storeAddress"
            label="仓库地址"
            align="center" s
            how-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="storeContacts"
            label="仓库联系人"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="contactsPhone"
            label="仓库联系人电话"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="createBy"
            label="创建人"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            width="135px"
          >
            <template slot-scope="scope">
              <span>{{ format(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateBy"
            label="最后修改人"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            label="最后修改时间"
            align="center"
            width="135px"
          >
            <template slot-scope="scope">
              <span>{{ format(scope.row.updateTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="110"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="editStore(scope.row)" size="mini">
                编辑
              </el-button>
              <el-button type="text" @click="delStore(scope.row)" size="mini">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination slot="foot" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20]" layout="total, sizes, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </Card>
  </div>
</template>

<script>

import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import storage from '@/utils/storage'
import Card from '@/components/Card'
import { format } from '@/utils/filter'
import { isPhone } from '@/utils/validator'
const storeModule = namespace('delivery-installation/entrepot')
@Component({
  components: { Card }
})
export default class Entrepot extends Vue {
  tableHeight = 0
  loading = false
  storeTable = []
  dialogFormVisible = false
  dialogform = {
    storeAddress: '',
    storeContacts: '',
    contactsPhone: ''
  }
  isDisable = false
  isDisable2 = false
  warehouse = ['']
  currentPage = 1
  totalSize = 0
  searchKeyword = ''
  isNew = true // 是否新增
  activeItem = null
  @storeModule.Action addStore
  @storeModule.Action storeList
  @storeModule.Action updateStore
  @storeModule.Action deleteStore
  format (timestamp, fmt) {
    return format(timestamp, 'yyyy-M-d HH:mm:s')
  }
  addItem () {
    this.warehouse.push('')
  }
  closeDialog () {
    this.dialogform = {
      storeAddress: '',
      storeContacts: '',
      contactsPhone: ''
    }
    this.warehouse = ['']
    this.dialogFormVisible = false
  }
  warehousesManagement (data) {
    this.isNew = true
    this.dialogFormVisible = true
  }
  removeItem () {
    if (this.warehouse.length > 1) {
      this.warehouse.pop()
    }
  }
  async getData () {
    this.loading = true
    await this.storeList({
      pageNum: this.currentPage,
      searchKeyword: this.searchKeyword
    }).then((result) => {
      console.log('getData result :', result)
      if (result.code === '200') {
        storage.setItem('userStoreList', JSON.stringify(result.data.list))
        this.storeTable = result.data.list
        this.totalSize = result.data.total
      } else {
        this.totalSize = 0
      }
    }).catch((err) => {
      this.totalSize = 0
      console.log(err)
    })
    this.loading = false
  }
  editStore (item) {
    this.isNew = false
    this.dialogFormVisible = true
    this.activeItem = item
    this.dialogform.storeAddress = item.storeAddress
    this.dialogform.storeContacts = item.storeContacts
    this.dialogform.contactsPhone = item.contactsPhone
    this.warehouse = []
    this.warehouse.push(item.store)
  }
  delStore (item) {
    this.$confirm('是否删除该库位?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.deleteStore({
        id: item.id
      }).then((result) => {
        console.log('getData result :', result)
        if (result.code === '200') {
          this.getData('')
        }
      })
    }).catch(() => {
      // this.$message({
      //   showClose: true,
      //   type: 'info',
      //   message: '已取消删除',
      //   duration: 2000
      // })
    })
    console.log('item :', item)
  }
  editItemStore () {
    console.log('编辑库位')
    let store = this.warehouse
    const isNull = store.every((val) => val)
    const storeString = store.toString()
    if (this.dialogform.contactsPhone && !isPhone(this.dialogform.contactsPhone)) {
      this.$message({
        showClose: true,
        message: '手机号码格式错误',
        type: 'warning',
        duration: 1500
      })
      return
    }
    if (!isNull) {
      this.$message({
        showClose: true,
        message: '仓位不能为空',
        type: 'warning',
        duration: 1500
      })
      return
    }
    this.isDisable2 = true
    this.updateStore({
      storeAddress: this.dialogform.storeAddress,
      storeContacts: this.dialogform.storeContacts,
      contactsPhone: this.dialogform.contactsPhone,
      store: storeString,
      id: this.activeItem.id
    }).then((result) => {
      console.log('result :', result)
      if (result.code === '200') {
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success',
          duration: 1500
        })
        this.dialogFormVisible = false
        this.getData('')
      }
    }).catch(err => err)
    this.isDisable2 = false
  }
  async newStore () {
    let checkArr = this.warehouse.map(item => item)
    checkArr.sort()
    let bool = false
    for (let i = 0; i < checkArr.length - 1; i++) {
      if (checkArr[i] === checkArr[i + 1]) {
        bool = true
        break
      }
    }
    if (bool) {
      this.$message({
        showClose: true,
        message: '存在相同编号库位',
        type: 'warning',
        duration: 1500
      })
      return
    }
    let store = this.warehouse
    const isNull = store.every((val) => val)
    const storeString = store.toString()
    if (this.dialogform.contactsPhone && !isPhone(this.dialogform.contactsPhone)) {
      this.$message({
        showClose: true,
        message: '手机号码格式错误',
        type: 'warning',
        duration: 1500
      })
      return
    }
    if (!isNull) {
      this.$message({
        showClose: true,
        message: '仓位不能为空',
        type: 'warning',
        duration: 1500
      })
      return
    }
    this.isDisable = true
    await this.addStore({
      storeAddress: this.dialogform.storeAddress,
      storeContacts: this.dialogform.storeContacts,
      contactsPhone: this.dialogform.contactsPhone,
      store: storeString
    }).then((result) => {
      console.log('result :', result)
      if (result.code === '200') {
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success',
          duration: 1500
        })
        this.dialogFormVisible = false
        this.dialogform = {}
        this.warehouse = ['']
        this.getData('')
      }
    }).catch(err => err)
    this.isDisable = false
  }
  handleCurrentChange (val) {
    this.currentPage = val
    this.getData()
    console.log('val :', val)
  }
  created () {
    this.tableHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 250
  }

  mounted () {
    this.getData('')
  }
}
</script>
<style src="./style.scss" lang="scss" scoped></style>
