<template>
  <div>
    <Card>
      <div class="toolbar" slot="head">
        <div>
          <el-button type="primary" size="mini" @click="marketManagement('')">新增关联商场</el-button>
        </div>
        <div class="search-form">
          <el-input
            maxlength="50"
            size="mini"
            v-model="searchKeyword"
            placeholder="商场编号、商场名称、代理商姓名"
            clearable
            @clear="getData"
            @keyup.enter.native="getData"
          >
          </el-input>
          <el-button type="primary" size="mini" @click="getData">搜索</el-button>
        </div>
      </div>

      <div class="shop-table" slot="content">
        <el-table
          v-loading="loading"
          :max-height="tableHeight"
          border
          size='mini'
          :data="shopTable"
          center>
          <el-table-column
            align="center"
            prop="mainMarketCode"
            label="商场编号"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="mainMarketName"
            label="商场名称"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="agentName"
            label="代理商姓名"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="relationMarketNum"
            label="关联商场数量"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="createBy"
            label="创建人"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            width="135px"
            align="center"
            label="创建时间"
          >
            <template slot-scope="scope">
              <span>{{ format(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="updateBy"
            label="最后修改人"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            width="135px"
            align="center"
            label="最后修改时间"
          >
            <template slot-scope="scope">
              <span>{{ format(scope.row.updateTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            width="110px"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="marketManagement(scope.row)"
                size="mini">
                编辑
              </el-button>
              <el-button
                type="text"
                @click="delMarket(scope.row)"
                size="mini">
                删除
              </el-button>
            </template>
          </el-table-column>
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
    <el-dialog  :title="isNew?'新增关联商场':'编辑关联商场'"
                :visible.sync="dialogFormVisible"
                width="55%"
                @close="closeDialog"
                :close-on-click-modal="false">
          <el-form size='mini' ref="marketForm" :model="masterShop" class="dialog-body">
            <p class="form-title">
              <span>主商场信息</span>
            </p>
            <div class="form-info1">
              <el-form-item label="商场名称" label-width='100px' size="mini" class="form-item"
                            maxlength="20"
                            :rules="[{required: true }]">
                <el-autocomplete
                  popper-class='autocomplete-style'
                  :fetch-suggestions="querySearch"
                  placeholder="请输入商场名称"
                  @select="handleSelect"
                  v-model="masterShop.name"
                  class="input-item"
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item label="商场编号" label-width='100px' size='mini' class="form-item"
                            maxlength="20"
                            :rules="[{ required: true }]">
                <el-autocomplete
                  popper-class='autocomplete-style'
                  :fetch-suggestions="querySearch"
                  placeholder="请输入商场编号"
                  @select="handleSelect"
                  v-model="masterShop.no"
                  class="input-item"
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item label="代理商姓名" label-width='100px' size='mini'
                            maxlength="20"
                            :rules="[{ required: true }]">
                <el-autocomplete
                  popper-class='autocomplete-style'
                  :fetch-suggestions="querySearch"
                  placeholder="请输入代理商姓名"
                  @select="handleSelect"
                  v-model="masterShop.agentName"
                  class="input-item"
                >
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </div>
          </el-form>
          <el-form>
            <p class="form-title">
              <span>关联商场信息</span>
              <!-- <el-button class="formAdd" size="mini" type="text" icon="el-icon-circle-plus-outline" @click="addItem">添加
              </el-button> -->
            </p>
            <div class="shop-list">
              <template v-for="(item, index) in relateShop">
                <div :key="index" class="relateShop">
                  <el-form-item
                    label="商场名称"
                    size='mini'
                    class="form-item"
                    label-width='100px'>
                    <el-autocomplete
                      popper-class='autocomplete-style'
                      :fetch-suggestions="querySearch"
                      placeholder="请输入商场名称"
                      @select="handleSelectItem(...arguments, index)"
                      v-model="relateShop[index].name"
                      class="input-item"
                    >
                      <template slot-scope="{ item }">
                        <div class="name">{{ item.value }}</div>
                      </template>
                    </el-autocomplete>
                  </el-form-item>
                  <el-form-item
                    label-width='100px'
                    label="商场编号"
                    size='mini'
                    class="form-item">
                    <el-autocomplete
                      popper-class='autocomplete-style'
                      :fetch-suggestions="querySearch"
                      placeholder="请输入商场编号"
                      @select="handleSelectItem(...arguments, index)"
                      v-model="relateShop[index].no"
                      class="input-item"
                    >
                      <template slot-scope="{ item }">
                        <div class="name">{{ item.value }}</div>
                      </template>
                    </el-autocomplete>
                  </el-form-item>
                  <el-form-item class="form-item button">
                    <el-button circle type="text" @click='addItem(item,index)' class="iconSize">
                        <i class="el-icon-circle-plus-outline"></i>
                      </el-button>
                      <el-button circle type="text" class="iconSize">
                        <i class="el-icon-remove-outline" @click="deleteItem(item,index)"></i>
                      </el-button>
                  </el-form-item>
                </div>
              </template>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="test" size="mini">test</el-button> -->
            <el-button @click="closeDialog" size="mini">取 消</el-button>
            <el-button type="primary" @click="newRelateShop" size="mini" v-if="isNew" :disabled="isDisable">确 定</el-button>
            <el-button type="primary" @click="editRelateShop" size="mini" v-else-if="!isNew" :disabled="isDisable2">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Card from '@/components/Card'
import { format } from '@/utils/filter'
const relevanceMarketModule = namespace('delivery-installation/relevanceMarket')

@Component({
  components: { Card }
})
export default class RelevanceMarket extends Vue {
  tableHeight = 0
  loading = false
  name = 'relevanceMarket'
  dialogFormVisible = false
  isNew = true
  isDisable = false
  isDisable2 = false
  shopTable = []
  masterShop = {
    name: '',
    no: '',
    agentName: '',
    id: ''
  }
  relateShop = [
    {}
  ]
  currentPage = 1
  totalSize = 0
  searchKeyword = ''
  shopName = ''
  shopList = []
  showList = {}
  @relevanceMarketModule.Action listMainMarket
  @relevanceMarketModule.Action addRelationMarket
  @relevanceMarketModule.Action updateMarket
  @relevanceMarketModule.Action listAllMarket
  @relevanceMarketModule.Action delMainMarket
  test () {
    console.log(this.masterShop)
  }
  format (timestamp, fmt) {
    return format(timestamp, 'yyyy-M-d HH:mm:s')
  }
  created () {
    this.tableHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 250
    this.getAllMarkets()
    this.getData()
  }
  mounted () {
  }
  async newRelateShop () {
    const relateMarket = this.relateShop.map(item => item.id)
    const result = this.relateShop.every(item => item.id)
    if (!result) {
      this.$message({
        showClose: true,
        message: '存在关联商场为空',
        type: 'error',
        duration: 2000
      })
      return
    }

    const relateMarketString = relateMarket.toString()
    if (!this.masterShop.id) {
      this.$message({
        showClose: true,
        message: '主商场不能为空',
        type: 'error',
        duration: 2000
      })
      return
    }
    this.isDisable = true
    await this.addRelationMarket({
      mainMaketId: this.masterShop.id,
      relationMarketIds: relateMarketString
    }).then((result) => {
      console.log('result :', result)
      if (result.code === '200') {
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success',
          duration: 1500
        })
        this.relateShop = [{}]
        this.masterShop = {}
        this.dialogFormVisible = false
        this.getData()
      } else {
        console.log('错误>>>>')
        this.$message({
          showClose: true,
          message: result.message,
          type: 'error',
          duration: 2000
        })
      }
    }).catch((err) => {
      console.log('>>>>', err)
      this.$message({
        showClose: true,
        message: err.message,
        type: 'error',
        duration: 2000
      })
    })
    this.isDisable = false
  }
  async delMarket (data) {
    console.log('date', data)
    this.$confirm('是否删除该关联商场?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.delMainMarket({
        id: data.id
      }).then((result) => {
        if (result.code === '200') {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getData()
        }
      }).catch((err) => {
        console.log('err', err)
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error',
          duration: 2000
        })
      })
    }).catch(() => {})
  }
  async editRelateShop () {
    console.log('editRelateShop')
    console.log(this.relateShop)
    const relateMarket = this.relateShop.map(item => item.id)
    const relateMarketString = relateMarket.toString()
    if (!this.masterShop.id) {
      this.$message({
        showClose: true,
        message: '主商场不能为空',
        type: 'error',
        duration: 2000
      })
      return
    }
    this.isDisable2 = true
    await this.updateMarket({
      mainMaketId: this.masterShop.id,
      relationMarketIds: relateMarketString
    }).then((result) => {
      console.log('result :', result)
      if (result.code === '200') {
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.relateShop = [{}]
        this.masterShop = {}
        this.dialogFormVisible = false
        this.getData()
      } else {
        console.log('错误>>>>')
        this.$message({
          showClose: true,
          message: result.message,
          type: 'error',
          duration: 2000
        })
      }
    }).catch((err) => {
      console.log('>>>>', err)
    })
    this.isDisable2 = false
  }
  getAllMarkets () {
    const shopList = window.sessionStorage.getItem('allMarkets')
    if (shopList) {
      this.shopList = JSON.parse(shopList)
      return
    }
    this.listAllMarket({
      pageSize: 9999
    }).then((result) => {
      this.shopList = result.data.list
      window.sessionStorage.setItem('allMarkets', JSON.stringify(result.data.list))
    })
  }
  closeDialog () {
    this.relateShop = [{}]
    this.masterShop = {}
    this.dialogFormVisible = false
  }
  async getData () {
    this.loading = true
    await this.listMainMarket({
      pageNum: this.currentPage,
      searchKeyword: this.searchKeyword
    }).then((result) => {
      console.log('result :', result)
      if (result.code === '200') {
        this.shopTable = result.data.list
        this.totalSize = result.data.total
      }
    })
    this.loading = false
  }
  async marketManagement (data) {
    // const aa = format(1537861197000, 'yyyy-MM-dd HH:mm:ss')
    console.log('data >> ', data)
    // console.log(aa)
    if (!data) {
      this.dialogFormVisible = true
      this.isNew = true
    } else {
      this.loading = true
      const result = await this.listMainMarket({
        mainMaketId: data.id
      }).then((result) => {
        console.log('http result :', result)
        if (result.code === '200') {
          const list = result.data.slice(1)
          const relateShop = list.map((val) => {
            const obj = {
              name: val.mainMarketName,
              no: val.mainMarketCode,
              agentName: val.agentName,
              id: val.id
            }
            return obj
          })
          this.relateShop = relateShop
          return true
        }
        return false
      }).catch((err) => {
        console.log('error', err)
      })
      console.log('promise result:', result)
      if (!result) {
        this.loading = false
        return
      }
      this.masterShop = {
        name: data.mainMarketName,
        no: data.mainMarketCode,
        agentName: data.agentName,
        id: data.id
      }
      this.isNew = false
      this.dialogFormVisible = true
      this.loading = false
    }
  }
  searchShop () {
    console.log('searchShop')
  }
  chooseItem (item, index) {
    console.log(item, index)
  }
  querySearch (queryString, cb) {
    console.log('queryString >> ', queryString)
    console.log('this.shopList[0]', this.shopList[0])
    const shopList = this.shopList
    const results = queryString ? shopList.filter((item, index) => {
      if (item.no.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) {
        return true
      }
      if (item.name.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) {
        return true
      }

      // 返回有时会为null
      item.agentName = item.agentName ? item.agentName : ''
      if (item.agentName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) {
        return true
      }
    }) : shopList
    results.forEach(item => {
      item.value = item.name + ' ' + item.agentName + ' ' + item.no
    })
    const showList = results.slice(0, 20)
    this.showList = shopList
    cb(showList)
  }
  handleSelect (item) {
    console.log(item)
    this.showList.forEach(val => {
      if (item.id === val.id) {
        this.masterShop = {
          name: val.name,
          no: val.no,
          agentName: val.agentName,
          id: val.id
        }
      }
    })
    // this.masterShop = item
  }
  handleSelectItem (item, index) {
    console.log('item :', item)
    this.relateShop[index] = item
  }
  addItem (item, index) {
    const obj = {}
    this.relateShop.splice(index + 1, 0, obj)
    console.log(this.relateShop)
  }
  deleteItem (item, index) {
    if (this.relateShop.length === 1) {
      return
    }
    this.relateShop.splice(index, 1)
    console.log(item, index)
  }
  handleCurrentChange () {

  }
}
</script>

<style src="./style.scss" lang="scss" scoped></style>
