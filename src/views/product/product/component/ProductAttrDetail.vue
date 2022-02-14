<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productAttrForm" label-width="120px" style="width: 800px" size="small">

      <el-form-item label="商品分类" prop="categoryId">
        <treeselect
          v-model="value.categoryId"
          :options="categories"
          style="width: 400px;"
          placeholder="选择商品分类"
          :normalizer="categoryNormalizer"
          :disable-branch-nodes="true"
          @select="handleCategorySelect"
        />
      </el-form-item>
      <el-form-item label="销售属性" v-if="selectSaleAttributes">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item, attributeId) in selectSaleAttributes" :key="attributeId">
            <!-- 手动输入 -->
            <div v-if="item && item.inputType == 0">
              <span>{{ `${item.attributeName}：` }}</span>
              <br>
              <input v-model="attributeInputAddValues[attributeId].value">
              <el-button class="littleMarginLeft" @click="handleAddAttributeInputValue(attributeId)">增加</el-button>
              <el-checkbox-group v-model="selectSaleAttributes[attributeId].values" >
                <div v-for="(val, index) in attributeInputAddValues[attributeId].values" :key="index" style="display: inline-block">
                <el-checkbox :label="val" class="littleMarginRight" @change="updateVueComponents"/>
                <el-button type="text" class="largeMarginRight" @click="handleRmAttributeInputValue(attributeId, index, val)">删除
                </el-button>
                </div>
              </el-checkbox-group>
            </div>

            <!-- 选择输入 -->
            <div v-if="item && item.inputType == 1">
              <span>{{ `${item.attributeName}：` }}</span>
              <el-checkbox-group v-model="selectSaleAttributes[attributeId].values" >
                <el-checkbox :label="val" v-for="(val, index) in item.inputValue.split(',')"  :key="index" @change="updateVueComponents" />
              </el-checkbox-group>
            </div>
          </div>
        </el-card>

        <!-- SKu 列表 -->
        <el-table :data="value.skuList" border style="width: 100%;margin-top: 20px">
          <el-table-column type="index" width="45" align="center" label="序号"/>

          <el-table-column v-for="(item, index) in skuNames"
            :label="item"
            :key="index"
            align="center"
            width="58"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.sku[index] ? scope.row.sku[index].value : '未知' }}
            </template>
          </el-table-column>

          <el-table-column label="价格" align="center" width="150">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.price"
              :step="2"
              :precision="2"
              :min="0.01"
              controls-position="right"/>
            </template>
          </el-table-column>

          <el-table-column label="原价" align="center" width="150">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.originPrice"
              :step="2"
              :precision="2"
              :min="0.01"
              controls-position="right" />
            </template>
          </el-table-column>

          <el-table-column label="库存" align="center" width="150">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.stock"
              :min="0"
              :step="2"
              controls-position="right" />
            </template>
          </el-table-column>

          <el-table-column label="预警库存" align="center" width="150">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.lowStock"
              :min="0"
              :step="2"
              controls-position="right" />
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="45">
            <template slot-scope="scope">
              <el-button type="text" @click="rmSkuList(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- SKU 列表操作按钮 -->
        <div style="margin-top: 20px">
          <el-button type="primary" @click="generateSkuList">
            生成sku列表
          </el-button>
          <el-button type="primary" @click="syncSkuStock" :disabled="skuListIsEmpty">
            同步库存
          </el-button>
          <el-button type="primary" @click="syncSkuPrice" :disabled="skuListIsEmpty">
            同步价格
          </el-button>
        </div>

      </el-form-item>

      <el-form-item label="基本属性">
        <el-card shadow="never">
          <div v-for="(item, index) in baseAttributes" :key="index">
            <div class="paramInputLabel">{{ item.attributeName }}:</div>
            <el-select v-if="item.inputType===1" class="paramInput"
                       v-model="value.attributeList[index].value" @change="updateVueComponents">
              <el-option
                v-for="(value, i) in item.inputValue.split(',')"
                :key="i"
                :label="value"
                :value="value" />
            </el-select>
            <el-input v-else class="paramInput"
              v-model="value.attributeList[index].value"
              @input="updateVueComponents" />
          </div>
        </el-card>
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext('productAttrForm')">
        下一步，填写商品促销
      </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { tree as categoryTree, groupAttributes } from '@/api/product/category'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import { cartesian } from '@/utils/helper'

  const ruleParam=  {
    categoryId: {min: 1},
  }

  export default {
    name: "ProductAttrDetail",
    components: { Treeselect },
    props: {
      value: {
        type: Object,
        default(){
          return {}
        }
      },
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        rules: {
          categoryId: [
            {
              required: true,
              type: 'number',
              min: ruleParam.categoryId.min,
              message: '请选择商品分类'
            }
          ]
        },
        categories: [],
        categoryProps: { value: 'id', label: 'name'},
        categoryNormalizer(node) {
          return {
            id: node.id,
            label: node.name,
            children: node.children && node.children.length > 0 ? node.children : 0,
          }
        },
        skuList: { names: [], values: [], cartesians: [] },
        baseAttributes: [], // 根据分类查询到的商品属性组积属性信息
        selectSaleAttributes: [],
        attributeInputAddValues: [],
        skuNames: [],
      }
    },
    computed: {
      //商品的编号
      productId(){
        return this.value.id;
      },
      skuListIsEmpty() {
        return this.value.skuList.length <= 0
      }
    },
    created() {
      this.loadCategories()
    },
    watch: {
      "value.categoryId": function(newVal, oldVal) {
        if(oldVal == null && newVal != null) {
          this.loadCategoryGroupAttribute(this.value.categoryId, true)
        }
      }
    },
    methods: {
      handlePrev() {
        this.$emit('prevStep')
      },
      handleNext(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('nextStep');
          } else {
            this.$message({
              message: '请检查所填信息',
              type: 'error',
              duration:1000
            });
            return false;
          }
        })
      },
      resetSkuData() {
        // this.value.skuList = []
        this.selectSaleAttributes = []
        this.categoryGroupAttributes = {}
        this.skuNames = []
      },
      resetAttributeData() {
        this.baseAttributes = []
        // this.value.attributeList = []
      },
      loadCategories(categoryId) {
        categoryTree().then(({ data }) => {
          this.categories = data
        })
      },
      loadCategoryGroupAttribute(categoryId, isCreated) {
        if(!categoryId) {
          return
        }
        groupAttributes(categoryId).then((res) => {
          if(res.status == 200000) {
            this.resetSkuData()
            this.resetAttributeData()

            this.categoryGroupAttributes = res.data

            res.data.saleAttributes.map(item => {
              // 销售属性
              this.skuNames.push(item.attributeName)
              this.selectSaleAttributes[item.attributeId] = { values: [], ...item }
              this.attributeInputAddValues[item.attributeId] = { value: '', values: []}
            })

            res.data.baseAttributes.map(item => {
              this.baseAttributes.push(item)

              let index = this.value.attributeList.findIndex(_item => item.attributeId === _item.id)
              if(index === -1) {
                this.value.attributeList.push({
                  id: item.attributeId, name: item.attributeName, value: ''
                })
              }
            })
          }
        })
      },
      handleCategorySelect(node) {
        this.loadCategoryGroupAttribute(node.id)
        this.value.attributeList = []
      },
      handleAddAttributeInputValue(attributeId) {
        let {value, values} = this.attributeInputAddValues[attributeId]

        if(!value) {
          this.$message({ message: '属性值不能为空', type: 'warning', duration: 1000 });
          return
        }

        if(values.includes(value)){
          this.$message({ message: '属性值已存在', type: 'warning', duration: 1000 });
          return
        }

        values.push(value)

        // 数组去重
        this.attributeInputAddValues[attributeId] = { value: '', values}

        // 解决取值嵌套层级过多，组建不能自动渲染
        this.updateVueComponents()
      },
      handleRmAttributeInputValue(attributeId, index, value) {
        this.attributeInputAddValues[attributeId].values.splice(index, 1);

        let selectValues = this.selectSaleAttributes[attributeId].values
        this.selectSaleAttributes[attributeId].values = selectValues.filter(val => val != value);

        this.updateVueComponents()
      },
      generateSkuList() {
        this.$confirm('刷新列表将导致sku信息重新生成，是否要刷新', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doGenerateSkuList();
        })
        .catch(_ => {})
      },
      doGenerateSkuList() {
        let skuValues = [];

        this.selectSaleAttributes.map( attribute => {
          if(!attribute && !attribute.attributeName && !attribute.values) {
            return
          }

          // 空列表会影响笛卡尔积计算，去除空列表
          if(!Array.isArray(attribute.values) || attribute.values.length < 1 ) {
            return
          }

          skuValues.push(attribute.values.map(value => {
            return {
              id: attribute.attributeId,
              name: attribute.attributeName,
              value
            }
          }))

        })

        let skuList = cartesian(skuValues)
        skuList = skuList.map(item => {
          if(this.skuNames.length <= 1) {
            item = [item]
          }

          return { price: 0, stock: 0, lowStock: 0, originPrice: 0, sku: item }
        })
        this.value.skuList = skuList
      },
      syncSkuStock() {
        if(this.value.skuList.length <= 1) {
          return
        }

        this.$confirm('将同步第一个sku的库存到所有sku,是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doSyncSkuStock()
        })
        .catch( _ => {})
      },
      doSyncSkuStock() {
        let stock = this.value.skuList[0].stock

        this.value.skuList = this.value.skuList.map((item, index) => {
          if(index > 0) {
            item = { ...item, stock }
          }

          return item
        })
      },
      syncSkuPrice() {
        if(this.value.skuList.length <= 1) {
          return
        }

        this.$confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doSyncSkuPrice()
        })
        .catch(_ => {})
      },
      doSyncSkuPrice() {
        let price = this.value.skuList[0].price
        let originPrice = this.value.skuList[0].originPrice

        this.value.skuList = this.value.skuList.map((item, index) => {
          if(index > 0) {
            item = { ...item, price, originPrice }
          }

          return item
        })
      },
      rmSkuList(index) {
        this.value.skuList.splice(index, 1)
      },
      updateVueComponents() {
        this.$forceUpdate()
      },
    }
  }
</script>

<style scoped>
  .littleMarginLeft {
    margin-left: 10px;
  }

  .littleMarginRight {
    margin-right: 10px;
  }

  .largeMarginRight {
    margin-right: 30px;
  }

  .littleMarginTop {
    margin-top: 10px;
  }

  .paramInput {
    width: 250px;
  }

  .paramInputLabel {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 10px
  }

  .cardBg {
    background: #F8F9FC;
  }
</style>
