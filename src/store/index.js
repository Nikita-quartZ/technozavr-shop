import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '../config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userAccessKey: null,
    cartProducts: [],
    cartProductsData: [],
    orderInfo: null,
    orderInfoError: null,
    lastInfo: null,
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, {productId, amount}) {
      const item = state.cartProducts.find(item => item.productId === productId);

      if (item) {
        item.amount = amount
      }
    },
    updateUserAccessKey(state, accessKey){
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map(item => {
        return {
          productId: item.product.id,
          amount: item.quantity,
        }
      })
    },
    deleteCartProduct(state, productId) {
      state.lastInfo = state.cartProducts;
      state.cartProducts = state.cartProducts.filter(item => item.productId !== productId)
    },
  },
  getters: {
    cartDetailsProduct(state){
      return state.cartProducts.map(item => {
        const product = state.cartProductsData.find(p => p.product.id === item.productId).product;
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
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios.get(API_BASE_URL + '/api/orders/' + orderId, {
        params: {
          userAccessKey: context.state.userAccessKey,
        }
      })
      .then(responce => {
        context.commit('updateOrderInfo', responce.data)
      })
      .catch(() => {
        context.state.orderInfoError = true;
      })
    },
    loadCart(context) {
      return axios.get(API_BASE_URL + '/api/baskets', {
        params: {
          userAccessKey: context.state.userAccessKey
        }
      })
        .then(responce => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', responce.data.user.accessKey);
            context.commit('updateUserAccessKey', responce.data.user.accessKey);
          }

          context.commit('updateCartProductsData', responce.data.items);
          context.commit('syncCartProducts');
        });
    },
    addProductToCart(context, {productId, amount}) {
      return axios.post(API_BASE_URL + '/api/baskets/products', {
        productId: productId,
        quantity: amount,
      }, {
        params: {
          userAccessKey: context.state.userAccessKey
        }
      })
        .then(responce => {
          context.commit('updateCartProductsData', responce.data.items);
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
          userAccessKey: context.state.userAccessKey
        }
      })
        .then(responce => {
          context.commit('updateCartProductsData', responce.data.items);
        })
        .catch(() => {
          context.commit('syncCartProducts')
        })
    },
    updateDeleteCartProduct(context, productId) {
      context.commit('deleteCartProduct', productId)
      axios.delete(API_BASE_URL + `/api/baskets/products?userAccessKey=${context.state.userAccessKey}`, {
        data: {
          productId: productId,
        }
      }).catch(() => {
        context.state.commit('syncCartProducts');
      })
    },
  },
});
