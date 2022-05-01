<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        152 товара
      </span>
    </div>
    <div class="content__catalog">
      <ProductFilter
        :price-from.sync='FilterPriceFrom'
        :price-to.sync='FilterPriceTo'
        :category-id.sync='FilterCategory'
        :colors-id.sync='FilterColor'
      />
      <section class="catalog">
        <ProductList
          :products="products"
        />
        <BasePagination
          v-model="page"
          :count="amountProducts"
          :per-page="productPerPage"
        />
      </section>
    </div>
  </main>
</template>

<script>
import products from '@/data/products';
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductFilter from '@/components/ProductFilter.vue';

export default {
  name: 'MainPage',
  components: {
    ProductList,
    BasePagination,
    ProductFilter,
  },
  data() {
    return {
      page: 1,
      productPerPage: 3,
      FilterPriceFrom: 0,
      FilterPriceTo: 0,
      FilterCategory: 0,
      FilterColor: 0,
    };
  },
  computed: {
    filteredProducts() {
      let filterProducts = products;
      if (this.FilterPriceFrom > 0) {
        filterProducts = filterProducts.filter((product) => product.price > this.FilterPriceFrom);
      }
      if (this.FilterPriceTo > 0) {
        filterProducts = filterProducts.filter((product) => product.price < this.FilterPriceTo);
      }
      if (this.FilterColor > 0) {
        filterProducts = filterProducts
          .filter((product) => product.colorId.includes(this.FilterColor));
      }
      if (this.FilterCategory) {
        filterProducts = filterProducts
          .filter((product) => product.categoryId === this.FilterCategory);
      }
      return filterProducts;
    },
    products() {
      const offset = (this.page - 1) * this.productPerPage;
      return this.filteredProducts.slice(offset, offset + this.productPerPage);
    },
    amountProducts() {
      return this.filteredProducts.length;
    },
  },
};
</script>

<style>

</style>
