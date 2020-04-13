import Vue from 'vue'
import Router from 'vue-router'

import Calendar from '@/components/Calendar.vue'
import Register from '@/components/Register';
import Login from '@/components/Login';
import Home from '@/components/Home'
import firebase from 'firebase'

Vue.use(Router)

let router =  new Router({
  mode: 'history',
  routes: [
    
    {
      path: '/',
      name: 'home',
      component: Home
      // meta: {
      //   requiresGuest: true
      // }
      
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        requiresGuest: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)){
    if (!firebase.auth().currentUser) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (firebase.auth().currentUser) {
      next({
        path: '/calendar',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router