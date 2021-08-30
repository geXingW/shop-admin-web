<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productSaleForm" label-width="120px" style="width: 600px" size="small">

      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品属性</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，选择商品关联</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  export default {
    name: "ProductSaleDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
      }
    },
    created() {
    },
    computed: {
    },
    methods: {
      handlePrev() {
        this.$emit('prevStep')
      },
      handleNext() {
        this.$emit('nextStep')
      }
    }
  }
</script>

<style scoped>
  .littleMargin {
    margin-top: 10px;
  }
</style>
