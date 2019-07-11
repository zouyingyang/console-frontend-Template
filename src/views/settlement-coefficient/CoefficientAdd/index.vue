<template>
  <div class="coefficientAdd">
    <Card>
      <div class="header" slot="head">
        <div class="header-toolbar buttomBoder">
          结算系数规则信息
        </div>
      </div>
      <div slot="content" >
        <el-col >
          <el-form v-loading="loading" class="coefficientRule" :inline="true" @submit.native.prevent>
            <el-row>
                <el-form-item label="规则名称" size="mini">
                  <el-input maxlength="40" size="mini" v-model="params.ruleName" placeholder="请输入规则名称"></el-input>
                </el-form-item>
                <el-form-item label="结算系数" size="mini">
                  <el-input maxlength="6" size="mini" v-model="params.coefficient" placeholder="请输入结算系数"></el-input>
                </el-form-item>
            </el-row>
            <el-row class="buttomBoder" style="margin-bottom: 20px;margin-left: 30px;margin-top:10px">
              商场属性
            </el-row>
            <el-row>
                <el-form-item label="品牌" size="mini">
                  <el-select @change="checkItem(params.brand,'brand')" v-model="params.brand" placeholder="请选择" :disabled="option.brand.length===1">
                    <el-option v-for="(item,index) in option.brand" :key="index" :label="item.brandName" :value="item.brandCode">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="品类" size="mini">
                  <el-select @change="checkItem(params.category,'category',params.category)" v-model="params.category" placeholder="请选择" :disabled="option.category.length===1">
                    <el-option v-for="(item,index) in option.category" :key="index" :label="item.categoryName" :value="item.categoryCode">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-checkbox-group class="op-right" v-model="enjoyable" @change="chooseEnjoyable">
                    <el-form-item>
                      <el-checkbox label="can">可享受</el-checkbox>
                    </el-form-item>
                      <el-form-item label="" size="mini" v-if="enjoyable[0] === 'can'" class="checkItem">
                        <el-tag v-if="!checkCanEnjoy.length" class="checkTag" size="mini">暂未选择可享受商场</el-tag>
                        <el-tooltip v-else popper-class="checkMaketStr" class="item" effect="dark" :content="checkCanstr" placement="bottom">
                          <div class="op-left">
                            <el-tag v-if="index <= 2" v-for="(item,index) in checkCanEnjoy" :key="index" size="mini">{{item.name}}</el-tag>
                            <el-tag v-if="checkCanEnjoy.length > 3"  key="checkCanEnjoy" size="mini">. . .</el-tag>
                          </div>
                        </el-tooltip>
                        <el-button @click="showSearchStore" type="text">选择</el-button>
                      </el-form-item>
                    <el-form-item>
                      <el-checkbox class="" label="noCan">不可享受</el-checkbox>
                    </el-form-item>
                      <el-form-item label="" size="mini" v-if="enjoyable[0] === 'noCan'" class="checkItem">
                        <el-tag v-if="!checkNoCanEnjoy.length" class="checkTag" size="mini">暂未选择不可享受商场</el-tag>
                        <el-tooltip v-else popper-class="checkMaketStr" class="item" effect="dark" :content="checkNoCanstr" placement="bottom">
                          <div class="op-left">
                            <el-tag v-if="index <= 2" v-for="(item,index) in checkNoCanEnjoy" :key="index" size="mini">{{item.name}}</el-tag>
                            <el-tag v-if="checkNoCanEnjoy.length > 3"  key="checkCanEnjoy" size="mini">. . .</el-tag>
                          </div>
                        </el-tooltip>
                        <el-button @click="showSearchStore" type="text">选择</el-button>
                      </el-form-item>
                  </el-checkbox-group>
                </el-form-item>
            </el-row>
            <el-row class="buttomBoder" style="margin-bottom: 20px;margin-left: 30px" v-show="params.category">
              订单属性-{{params.category|categoryFilter}}
            </el-row>
            <el-row class="order" v-show="params.category === 'category_chugui' || params.category === 'category_weiyu' || params.category === 'category_mumen'">
                <el-form-item v-show="params.category">
                  <el-checkbox @change="checkChange(isLegacy,'isLegacy')" v-model="isLegacy" label="1">是否遗留</el-checkbox>
                  <el-select v-if="isLegacy" v-model="params.isLegacy" placeholder="请选择" style="margin-left: 10px">
                    <el-option v-for="item in option.isLegacy" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show="params.category === 'category_chugui' || params.category === 'category_weiyu'">
                  <el-checkbox @change="checkChange(orderType,'orderType')" v-model="orderType" label="1" >订单类型</el-checkbox>
                  <el-select v-if="orderType" v-model="params.orderType" placeholder="请选择" style="margin-left: 10px">
                    <el-option v-for="item in option.orderType" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show="params.category === 'category_chugui'">
                  <el-checkbox @change="checkChange(productType,'productType')" v-model="productType" label="1">产品类型</el-checkbox>
                  <el-select v-if="productType" v-model="params.productType" placeholder="请选择" style="margin-left: 10px">
                    <el-option v-for="item in option.productType" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show="params.category === 'category_chugui' || params.category === 'category_mumen'">
                  <el-checkbox @change="checkChange(isIntegral,'isIntegral')" v-model="isIntegral" label="1">是否整装</el-checkbox>
                  <el-select v-if="isIntegral" v-model="params.isIntegral" placeholder="请选择" style="margin-left: 10px" >
                    <el-option v-for="item in option.isIntegral" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show="params.category === 'category_chugui' || params.category === 'category_weiyu' || params.category === 'category_mumen'">
                  <el-checkbox @change="checkChange(promotionType,'promotionType')" v-model="promotionType" label="1">促销类型</el-checkbox>
                  <el-select v-if="promotionType" v-model="params.promotionType" placeholder="请选择" style="margin-left: 10px">
                    <el-option v-for="item in option.promotionType" :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show="params.category === 'category_chugui'">
                  <el-checkbox @change="checkChange(isAdditional,'isAdditional')" v-model="isAdditional" label="1" >是否补单</el-checkbox>
                  <el-select v-if="isAdditional" v-model="params.isAdditional" placeholder="请选择" style="margin-left: 10px">
                    <el-option v-for="item in option.isAdditional" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="24" class="remark">
                <el-form-item
                  style="margin-top: 5px"
                  label="备注">
                  <el-input
                    type="textarea"
                    maxlength="100"
                    style="margin-top: 5px;width:700px"
                    v-model="params.remark" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12" :offset="9">
                <el-form-item>
                  <el-button type="primary" size="mini" @click="save">保存</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="cancel">取消</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </div>
    </Card>
    <!--查询商场弹窗-->
    <el-dialog
      :visible.sync="isShowSearchStore"
      append-to-body
      title="查询商场"
      width="40%"
      top="3.4%"
      center
      :close-on-click-modal="false"
      class="SearchStore">
      <SearchStore key="getstoreByid1"
                   :checkMaketArr="enjoyable[0] === 'noCan' ? checkNoCanEnjoy: enjoyable[0] === 'can'? checkCanEnjoy : []"
                   @sumbitStore="sumbitStore"
                   :item = "params"
                   :isShow="isShowSearchStore"></SearchStore>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Card from '@/components/Card'
import { format, categoryFilter } from '@/utils/filter'
import { SaveAsFile } from '@/utils/lib'
import storage from '@/utils/storage'
import SearchStore from './components/SearchStore'

const coefficientModule = namespace('settlement-coefficient/index')

@Component({
  components: { Card, SearchStore },
  filters: { format, SaveAsFile, categoryFilter }
})
export default class CoefficientAdd extends Vue {
  userBrandList = ''
  loading = false
  totalSize = 0
  currentPage = 1
  searchKeyword=''
  getstoreByid = false
  isShowSearchStore = false
  isLegacy = false // 是否遗留显示
  isIntegral = false // 是否整装
  isAdditional = false // 是否补单
  orderType = false // 订单类型显示
  productType = false // 产品类型显示
  promotionType = false // 促销类型显示
  dataType = ['order_type', 'product_category', 'activity_type']
  userBrandarr = []
  userCategoryarr = []
  enjoyable=[]// 是否可享受商场
  checkCanstr = '' // 可享受商场的拼接字符
  checkNoCanstr = '' // 不可享受商场的拼接字符
  checkCanEnjoy=[]// 可享受商场数组
  checkNoCanEnjoy=[]// 不可享受商场数组

  productTypelist = [] // 所有的品类产品类型
  params = {
    brand: '',
    category: '',
    coefficient: '', // 结算系数
    delFlag: 0, // 是否删除（0否，1是）
    excludeAgentIds: '', // 不可享受的商场ids（用，拼接）
    includeAgentIds: '', // 可享受的商场ids（用，拼接）
    isAdditional: '', // 是否补单（0否，1是)
    isIntegral: '', // 是否整装（0否，1是）
    isLegacy: '', // 是否遗留单（0表示否，1表示是)
    orderType: '', // 订单类型MTDS字典值（普通单，样品单。。。）
    productType: '', // 产品类型MTDS字典值（普通订单，台面毛板。。。）
    promotionType: '', // 促销类型（网销，直销。。。）
    remark: '', // 备注
    ruleName: '' // 规则名称
  }
  option={
    brand: '',
    category: '',
    isLegacy: [
      { value: '0', label: '否' },
      { value: '1', label: '是' }],
    isIntegral: [
      { value: '0', label: '否' },
      { value: '1', label: '是' }],
    isAdditional: [
      { value: '0', label: '否' },
      { value: '1', label: '是' }],
    orderType: [],
    promotionType: [],
    productType: []
  }

  @coefficientModule.Action saveRule

  // 根据字典编码获取下级字典列表
  @coefficientModule.Action getDictionaryCacheListByCode
  // Enjoyable选择 只能选一个
  chooseEnjoyable (data) {
    let arr = [...data]
    if (arr.length > 1) {
      this.enjoyable = []
      this.enjoyable.push(arr[1])
      if (this.enjoyable[0] === 'can') {
        this.checkNoCanEnjoy = []
      }
      if (this.enjoyable[0] === 'noCan') {
        this.checkCanEnjoy = []
      }
    }
    // this.initData()
  }

  checkChange (boolen, type) {
    if (!boolen) {
      this.params[type] = ''
    }
  }

  // 查询商场弹窗
  showSearchStore () {
    if (this.params.brand && this.params.category) {
      this.isShowSearchStore = true
    } else if (!this.params.brand) {
      this.$message.warning('请先选择品牌~')
    } else if (!this.params.category) {
      this.$message.warning('请先选择品类~')
    }
  }

  sumbitStore (data) {
    console.log('商场确认', data)
    if (this.enjoyable[0] === 'noCan') {
      this.checkNoCanEnjoy = data// 不可享受商场数组
    } else if (this.enjoyable[0] === 'can') {
      this.checkCanEnjoy = data
    }
  }
  checkItem (check, type, category) {
    // 选择品牌筛选 品类
    if (type === 'brand' && !!check) {
      if (!this.params.brand) {
        this.params.category = ''
      }
      let categoryArr = []
      let forBrandArr = this.userBrandList.filter((item) => {
        return item.brandCode === check
      })
      forBrandArr.forEach((item) => {
        categoryArr.push({ categoryCode: item.categoryCode, categoryName: item.categoryName })
      })
      this.userCategoryarr = this.categoryFilter(categoryArr)
    }
    // 选择品类筛选 品牌
    if (type === 'category' && !!check) {
      this.option.productType = this.productTypelist.filter((item) => {
        return item.code.indexOf(category.split('_')[1]) !== -1
      })
      let brandArr = []
      let forCategoryArr = this.userBrandList.filter((item) => {
        return item.categoryCode === check
      })
      forCategoryArr.forEach((item) => {
        brandArr.push({ brandCode: item.brandCode, brandName: item.brandName })
      })
      this.userBrandarr = this.brandFilter(brandArr)
      let itemI = -1
      this.userBrandarr.map((item, index) => {
        if (item.brandCode === this.params.brand) {
          itemI = index
        }
      })
      itemI !== -1 ? this.params.brand = this.userBrandarr[itemI].brandCode : this.params.brand = ''
    }
    this.isLegacy = false // 是否遗留显示
    this.isIntegral = false // 是否整装
    this.isAdditional = false // 是否补单
    this.orderType = false // 订单类型显示
    this.productType = false // 产品类型显示
    this.promotionType = false // 促销类型显示
  }
  // 保存并关闭
  save () {
    this.params.ruleName = this.params.ruleName.replace(/\s+/g, '')
    if (!!this.params.brand && !!this.params.category && !!this.params.coefficient && !!this.params.ruleName) {
      let params = JSON.parse(JSON.stringify(this.params))
      let checkArr = []
      params.isLegacy = ''
      params.isIntegral = ''
      params.isAdditional = ''
      params.orderType = ''
      params.productType = ''
      params.promotionType = ''
      params.remark = params.remark.replace(/\s+/g, '')
      params.coefficient = params.coefficient * 1
      params.coefficient = params.coefficient.toFixed(4)
      if (this.enjoyable.length) {
        if (this.enjoyable[0] === 'noCan') {
          params.includeAgentIds = ''
          if (this.checkNoCanEnjoy.length) {
            this.checkNoCanEnjoy.forEach((item) => {
              checkArr.push(item.id)
            })
            params.excludeAgentIds = checkArr.join(',')
          }
        } else if (this.enjoyable[0] === 'can') {
          params.excludeAgentIds = ''
          if (this.checkCanEnjoy.length) {
            this.checkCanEnjoy.forEach((item) => {
              checkArr.push(item.id)
            })
            params.includeAgentIds = checkArr.join(',')
          }
        }
      }
      if (/^(0\.(?!0+$)\d{1,4}|1(\.0{1,4})?)$/.test(params.coefficient)) {
        // isLegacy = false //是否遗留显示
        // isIntegral = false //是否整装
        // isAdditional = false //是否补单
        // orderType = false //订单类型显示
        // productType = false //产品类型显示
        // promotionType = false //促销类型显示
        if (this.params.category === 'category_chugui') {
          this.isLegacy ? params.isLegacy = this.params.isLegacy : params.isLegacy = ''
          this.isIntegral ? params.isIntegral = this.params.isIntegral : params.isIntegral = ''
          this.isAdditional ? params.isAdditional = this.params.isAdditional : params.isAdditional = ''
          this.orderType ? params.orderType = this.params.orderType : params.orderType = ''
          this.productType ? params.productType = this.params.productType : params.productType = ''
          this.promotionType ? params.promotionType = this.params.promotionType : params.promotionType = ''
          if (params.isLegacy || params.isIntegral || params.isAdditional || params.orderType || params.productType || params.promotionType) {
            this.saveFunction(params)
          } else {
            this.$message.warning('订单属性必须填写一个~')
          }
        }
        if (this.params.category === 'category_weiyu') {
          this.isLegacy ? params.isLegacy = this.params.isLegacy : params.isLegacy = ''
          this.orderType ? params.orderType = this.params.orderType : params.orderType = ''
          this.promotionType ? params.promotionType = this.params.promotionType : params.promotionType = ''
          if (params.isLegacy || params.orderType || params.promotionType) {
            this.saveFunction(params)
          } else {
            this.$message.warning('订单属性必须填写一个~')
          }
        }
        if (this.params.category === 'category_mumen') {
          this.isIntegral ? params.isIntegral = this.params.isIntegral : params.isIntegral = ''
          this.isLegacy ? params.isLegacy = this.params.isLegacy : params.isLegacy = ''
          this.promotionType ? params.promotionType = this.params.promotionType : params.promotionType = ''
          if (params.isLegacy || params.isIntegral || params.promotionType) {
            this.saveFunction(params)
          } else {
            this.$message.warning('订单属性必须填写一个~')
          }
        }
      } else {
        this.$message.warning('您必须输入一个0.0001~1.0000的结算系数~')
      }
    } else if (!this.params.ruleName) {
      this.$message.warning('请输入规则名称~')
    } else if (!this.params.coefficient) {
      this.$message.warning('请输入结算系数~')
    } else if (!this.params.brand) {
      this.$message.warning('请选择品牌~')
    } else if (!this.params.category) {
      this.$message.warning('请选择品类~')
    }
  }
  // 保存函数
  saveFunction (params) {
    this.loading = true
    this.saveRule(params).then(res => {
      if (res.status && res.code === '200') {
        this.$message.success('保存结算系数成功')
        this.loading = false
        this.$router.push({
          name: 'coefficient'
        })
      }
    }).catch(error => {
      this.loading = false
      console.log('保存结算系数error', error)
      this.$message.warning('保存结算系数error')
    })
  }

  // 取消
  cancel () {
    this.$router.push({
      name: 'coefficient'
    })
  }
  // 处理翻页
  handleCurrentChange (val) {
    this.currentPage = val
  }

  // 获取用户的品牌品类
  getUserBrandList () {
    let arr = JSON.parse(storage.getItem('userInfo')) || []
    this.userBrandList = arr.userBrandList || []
    this.userBrandarr = []
    this.userCategoryarr = []
    this.userBrandList.forEach((item) => {
      this.userBrandarr.push({ brandCode: item.brandCode, brandName: item.brandName })
      this.userCategoryarr.push({ categoryCode: item.categoryCode, categoryName: item.categoryName })
    })

    this.userBrandarr = this.brandFilter(this.userBrandarr)
    this.userCategoryarr = this.categoryFilter(this.userCategoryarr)
  }
  // 品牌去重 赋值
  brandFilter (brandarr) {
    let obj = {}
    brandarr = brandarr.reduce((cur, next) => {
      obj[next.brandCode] ? obj[next.brandName] = '' : obj[next.brandCode] = true && cur.push(next)
      return cur
    }, [])
    this.option.brand = brandarr
    if (brandarr.length === 1) {
      this.params.brand = brandarr[0].brandCode
    }
    return brandarr
  }
  // 品类去重 赋值
  categoryFilter (categoryarr) {
    let obj = {}
    categoryarr = categoryarr.reduce((cur, next) => {
      obj[next.categoryCode] ? obj[next.brandName] = '' : obj[next.categoryCode] = true && cur.push(next)
      return cur
    }, [])
    this.option.category = categoryarr
    if (categoryarr.length === 1) {
      this.params.category = categoryarr[0].categoryCode
    }
    return categoryarr
  }
  created () {
    // ['order_type','product_category','activity_type']
    this.getDictionaryCacheListByCode({ code: this.dataType[0] }).then((res) => {
      this.option.orderType = res.data
      this.getDictionaryCacheListByCode({ code: this.dataType[1] }).then((res) => {
        this.productTypelist = res.data
        this.getDictionaryCacheListByCode({ code: this.dataType[2] }).then((res) => {
          this.option.promotionType = res.data
        })
      })
    })
    this.getUserBrandList()
  }
  mounted () {
  }
  @Watch('adressList')
  adressListChange () {
    this.regionData = this.adressList
  }
  @Watch('checkCanEnjoy')
  watchEnjoyable (newVal) {
    let arr = []
    if (newVal.length) {
      this.checkCanEnjoy.forEach((item) => {
        arr.push(item.name)
      })
      this.checkCanstr = arr.join(',')
    }
  }
  @Watch('checkNoCanEnjoy')
  watchNoEnjoyable (newVal) {
    let arr = []
    if (newVal.length) {
      this.checkNoCanEnjoy.forEach((item) => {
        arr.push(item.name)
      })
      this.checkNoCanstr = arr.join(',')
    }
  }
}
</script>

<style src="./style.scss" lang="scss"></style>
