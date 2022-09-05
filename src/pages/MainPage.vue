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
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import axios from 'axios';
import { API_BASE_URL } from '../config';

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
      ProductData: null,
    };
  },
  computed: {
    products() {
      return this.ProductData ?
        this.ProductData.items.map(product => {
          return {
            ...product,
            image: product.image.file.url
          }
        })
        : [];
    },
    amountProducts() {
      return this.ProductData ? this.ProductData.pagination.total : 0;
    },
  },
  methods: {
    loadProducts() {
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer =  setTimeout(() => {
        axios
        .get(API_BASE_URL + '/api/products', {
          params: {
            page: this.page,
            limit: this.productPerPage,
            categoryId: this.FilterCategory,
            minPrice: this.FilterPriceFrom,
            maxPrice: this.FilterPriceTo,
          }
        })
        .then(responce => this.ProductData = responce.data)
      }, 0)
    }
  },
  watch: {
    page() {
      this.loadProducts();
    },

    FilterPriceFrom() {
      this.loadProducts();
    },

    FilterPriceTo() {
      this.loadProducts();
    },

    FilterCategory() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
  },
};
</script>

<style>

</style>
