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
      <productFilter
        :price-from.sync='filterPriceFrom'
        :price-to.sync='filterPriceTo'
        :category-id.sync='filterCategory'
        :colors-id.sync='filterColor'
      />
      <section class="catalog">
        <div v-show="productsLoading">Загрузка товаров...</div>
        <div v-show="productsLoadingFailed">Произошла ошибка при загрузки товаров <button @click.prevent="loadProducts">Попробовать ещё раз</button></div>
        <productList
          :products="products"
        />
        <basePagination
          v-model="page"
          :count="amountProducts"
          :per-page="productPerPage"
        />
      </section>
    </div>
  </main>
</template>

<script>
import productList from '@/components/ProductList.vue';
import basePagination from '@/components/BasePagination.vue';
import productFilter from '@/components/ProductFilter.vue';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default {
  name: 'MainPage',
  components: {
    productList,
    basePagination,
    productFilter,
  },
  data() {
    return {
      page: 1,
      productPerPage: 3,
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategory: 0,
      filterColor: 0,
      productData: null,
      productsLoading: false,
      productsLoadingFailed: false,
    };
  },
  computed: {
    products() {
      return this.productData ?
        this.productData.items.map(product => {
          return {
            ...product,
            image: product.image.file.url
          }
        })
        : [];
    },
    amountProducts() {
      return this.productData ? this.productData.pagination.total : 0;
    },
  },
  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer =  setTimeout(() => {
        axios
        .get(API_BASE_URL + '/api/products', {
          params: {
            page: this.page,
            limit: this.productPerPage,
            categoryId: this.filterCategory,
            colorId: this.filterColor,
            minPrice: this.filterPriceFrom,
            maxPrice: this.filterPriceTo,
          }
        })
        .then(responce => this.productData = responce.data)
        .catch(() => this.productsLoadingFailed = true)
        .then(() => {
          this.productsLoading = false;
        })
      }, 500)
    }
  },
  watch: {
    page() {
      this.loadProducts();
    },

    filterPriceFrom() {
      this.loadProducts();
    },

    filterPriceTo() {
      this.loadProducts();
    },

    filterCategory() {
      this.loadProducts();
    },
    filterColor() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
  },
};
</script>
