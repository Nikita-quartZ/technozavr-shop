<template>
  <div>
    <component
      :is="currentPageComponent"
      :page-params="currentParams"
    />
  </div>
</template>

<script>
import MainPage from './pages/MainPage.vue';
import ProductPage from './pages/ProductPage.vue';
import NotFoundPage from './pages/NotFoundPage.vue';
import eventBus from '@/eventBus';

const routes = {
  main: 'MainPage',
  product: 'ProductPage',
}
export default {
  name: 'App',
  data() {
    return {
      currentPage: 'main',
      currentParams: {},
    };
  },
  components: {
    MainPage,
    ProductPage,
    NotFoundPage,
  },
  computed: {
    currentPageComponent() {
      return routes[this.currentPage] || 'NotFoundPage';
    }
  },
  methods: {
    gotoPage(PageName, PageParams) {
      this.currentPage = PageName;
      this.currentParams = PageParams || {};
    }
  },
  created() {
    eventBus.$on('gotoPage', (pageName, PageParams) => this.gotoPage(pageName, PageParams))
  },
};
</script>
