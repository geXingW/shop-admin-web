<template>
  <product-detail :is-edit='false'></product-detail>
</template>
<script>
  import ProductDetail from './component/ProductDetail'
  export default {
    name: 'ProductAdd',
    components: { ProductDetail }
  }
</script>
<style>
</style>
