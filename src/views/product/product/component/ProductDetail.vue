<template>
	<el-card class="form-container" shadow="never">
		<el-steps :active="step" finish-status="success" align-center>
			<el-step title="填写商品信息"></el-step>
			<el-step title="填写商品属性"></el-step>
			<el-step title="填写商品促销"></el-step>
			<el-step title="选择关联活动"></el-step>
		</el-steps>
	    <product-info-detail
	      v-show="showStatus[0]"
	      v-model="productParam"
	      :is-edit="isEdit"
	      @nextStep="nextStep">
	    </product-info-detail>
	    <product-attr-detail
	      v-show="showStatus[1]"
	      v-model="productParam"
	      :is-edit="isEdit"
	      @nextStep="nextStep"
	      @prevStep="prevStep">
	    </product-attr-detail>
	    <product-sale-detail
	      v-show="showStatus[2]"
	      v-model="productParam"
	      :is-edit="isEdit"
	      @nextStep="nextStep"
	      @prevStep="prevStep">
	    </product-sale-detail>
	    <product-relation-detail
	      v-show="showStatus[3]"
	      v-model="productParam"
	      :is-edit="isEdit"
	      @prevStep="prevStep"
	      @finishCommit="finishCommit">
	    </product-relation-detail>
	</el-card>
</template>
<script>
	import ProductInfoDetail from './ProductInfoDetail'
	import ProductSaleDetail from './ProductSaleDetail'
	import ProductAttrDetail from './ProductAttrDetail'
	import ProductRelationDetail from './ProductRelationDetail'
	import { add as createProduct, edit as editProduct } from '@/api/product/product'

	const defaultProductParam = {
		title: '',
		subTitle: '',
		categoryId: null,
		sort: 0,
		sale: 0,
		salePrice: 0,
		originalPrice: 0,
		promotionPrice: 0,
		stock: 0,
		lowStock: 0,
		unit: '',
		detailPCHtml: '',
		detailMobileHtml: '',
		skuList: [],
		attributeList: [],
		pics: [],
		onSale: 0,	// 是否上架
		isNew: 0, // 是否是新品
		
	}

	export default {
		name: 'ProductDetail',
		components: { ProductInfoDetail, ProductSaleDetail, ProductAttrDetail, ProductRelationDetail },
		props: {
			isEdit: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				step: 0,
				showStatus: [true, false, false, false],
				productParam: Object.assign({}, defaultProductParam),
			}
		},
		computed: {
	      //商品的编号
	      productId(){
	        return this.value.id;
	      },
		},
		methods: {
	      hideAll() {
	        for (let i = 0; i < this.showStatus.length; i++) {
	          this.showStatus[i] = false;
	        }
	      },
	      prevStep() {
	        if (this.step > 0 && this.step < this.showStatus.length) {
	          this.step--;
	          this.hideAll();
	          this.showStatus[this.step] = true;
	        }
	      },
	      nextStep() {
	        if (this.step < this.showStatus.length - 1) {
	          this.step++;
	          this.hideAll();
	          this.showStatus[this.step] = true;
	        }
	      },
	      createProduct() {
	      	return editProduct(this.productId, this.productParam)
	      },
	      editProduct() {
	      	return createProduct(this.productParam)
	      },
		  finishCommit(isEdit) {
	        this.$confirm('是否要提交该产品', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          console.log("提交商品", this.productParam)
	        	let request = isEdit ? this.createProduct(): this.editProduct()
	        	request.then(res => {
	        		console.log(res)
	        	})
	        })
	      }
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .form-container {
    width: 800px;
    margin: 20px auto;
  }
</style>