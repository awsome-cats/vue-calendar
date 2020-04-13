/* eslint-disable no-unused-vars */

import Vue from 'vue'
import App from './App.vue'
import TextareaAutosize from 'vue-textarea-autosize'
import vuetify from './plugins/vuetify';
import router from './router'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import firebaseConfig from './firebase/firebaseConfig'

Vue.use(TextareaAutosize)
Vue.config.productionTip = false

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

let app;
firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      vuetify,
      router,
      render: h => h(App)
    }).$mount('#app')
  } 
})

