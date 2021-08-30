<template>
	<el-card class="form-container" shadow="never">
		<el-steps :active="step" finish-status="success" align-center>
			<el-step title="填写商品信息"></el-step>
			<el-step title="填写商品属性"></el-step>
			<el-step title="填写商品促销"></el-step>
			<el-step title="选择商品关联"></el-step>
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
<!-- 	    <product-relation-detail
	      v-show="showStatus[3]"
	      v-model="productParam"
	      :is-edit="isEdit"
	      @prevStep="prevStep"
	      @finishCommit="finishCommit">
	    </product-relation-detail> -->
	</el-card>
</template>
<script>
	import ProductInfoDetail from './ProductInfoDetail'
	import ProductSaleDetail from './ProductSaleDetail'
	import ProductAttrDetail from './ProductAttrDetail'

	const defaultProductParam = {
		title: '',
		subTitle: '',
		categoryId: null,
		sort: 0,
		sale: 0,
		price: 0,
		promotionPrice: 0,
		stock: 0,
		lowStock: 0,
		unit: '',
		detailPCHtml: '',
		detailMobileHtml: '',
	}

	export default {
		name: 'ProductDetail',
		components: { ProductInfoDetail, ProductSaleDetail, ProductAttrDetail },
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
		  finishCommit(isEdit) {
	        this.$confirm('是否要提交该产品', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	          console.log("提交商品")
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