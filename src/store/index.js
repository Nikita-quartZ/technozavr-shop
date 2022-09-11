import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '../config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    UserAccessKey: null,
    CartProducts: [],
    CartProductsData: [],
    orderInfo: null,
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.CartProducts = [];
      state.CartProductsData = [];
    },
    updateCartProductAmount(state, {productId, amount}) {
      const item = state.CartProducts.find(item => item.productId === productId);

      if (item) {
        item.amount = amount
      }
    },
    UpdateUserAccessKey(state, accessKey){
      state.UserAccessKey = accessKey;
    },
    UpdateCartProductsData(state, items) {
      state.CartProductsData = items;
    },
    syncCartProducts(state) {
      state.CartProducts = state.CartProductsData.map(item => {
        return {
          productId: item.product.id,
          amount: item.quantity,
        }
      })
    }
  },
  getters: {
    cartDetailsProduct(state){
      return state.CartProducts.map(item => {
        const product = state.CartProductsData.find(p => p.product.id === item.productId).product;
        return {
          ...item,
          product: {
            ...product,
            image: product.image.file.url
          }
        }
      })
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailsProduct.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    }
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios.get(API_BASE_URL + '/api/orders/' + orderId, {
        params: {
          userAccessKey: context.state.UserAccessKey,
        }
      })
      .then(responce => {
        context.commit('updateOrderInfo', responce.data)
      })
    },
    loadCart(context) {
      return axios.get(API_BASE_URL + '/api/baskets', {
        params: {
          userAccessKey: context.state.UserAccessKey
        }
      })
        .then(responce => {
          if (!context.state.UserAccessKey) {
            localStorage.setItem('userAccessKey', responce.data.user.accessKey);
            context.commit('UpdateUserAccessKey', responce.data.user.accessKey);
          }

          context.commit('UpdateCartProductsData', responce.data.items);
          context.commit('syncCartProducts');
        });
    },
    addProductToCart(context, {productId, amount}) {
      return axios.post(API_BASE_URL + '/api/baskets/products', {
        productId: productId,
        quantity: amount,
      }, {
        params: {
          userAccessKey: context.state.UserAccessKey
        }
      })
        .then(responce => {
          context.commit('UpdateCartProductsData', responce.data.items);
          context.commit('syncCartProducts')
        })
    },
    updateCartProductAmount(context, {productId, amount}) {
      if (amount < 1) return;
      context.commit('updateCartProductAmount', {productId, amount});
      return axios.put(API_BASE_URL + '/api/baskets/products', {
        productId: productId,
        quantity: amount,
      }, {
        params: {
          userAccessKey: context.state.UserAccessKey
        }
      })
        .then(responce => {
          context.commit('UpdateCartProductsData', responce.data.items);
        })
        .catch(() => {
          context.commit('syncCartProducts')
        })
    },
    deleteCartProduct(context, productId) {
      const lastInfo = context.state.CartProducts;
      context.state.CartProducts = context.state.CartProducts.filter(item => item.productId !== productId)
      axios.delete(`https://vue-study.skillbox.cc/api/baskets/products?userAccessKey=${context.state.UserAccessKey}`, {
        data: {
          productId: productId,
        }
      }).catch(() => {
        context.state.CartProducts = lastInfo;
      })
    },
  },
});
