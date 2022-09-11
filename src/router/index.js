import Vue from 'vue';
import VueRouter from 'vue-router';
import MainPage from '@/pages/MainPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import OrderPage from '@/pages/OrderPage';

Vue.use(VueRouter);

const routes = [
  {name: 'main', component: MainPage, path: '/main'},
  {name: 'product', component: ProductPage, path: '/product/:id'},
  {name: 'cartProduct', component: CartPage, path: '/cart-product'},
  {name: 'order', component: OrderPage, path: '/order'},
  {name: 'NotFoundPage', component: NotFoundPage, path: '*'}
];

const router = new VueRouter({
  routes
});

export default router;
