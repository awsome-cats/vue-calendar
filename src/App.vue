<template>
  <v-app>
      <!---------HEADER START----------->
      <v-app-bar color="grey darken-4" dark flat dense max-height="70">
        <router-link to="/">
          <v-app-bar-nav-icon class="white--text"></v-app-bar-nav-icon>
        </router-link>
        <router-link to="/calendar">
          <v-toolbar-title class="white--text">Calendar</v-toolbar-title>
        </router-link>
        <div class="flex-grow-1"></div>
        <span v-if="isLoggedIn">{{currentUser}}</span>
        <v-btn 
        @click="LogoutUser"
        v-if="isLoggedIn"
        >Logout</v-btn>
        
        <router-link 
        class="color mr-3" 
        to="/login"
        v-if="!isLoggedIn"
        ><v-btn>ログイン</v-btn>
        </router-link>
        <router-link 
        class="color ml-3 mr-3" 
        to="/register"
        v-if="!isLoggedIn"
        ><v-btn>登録</v-btn></router-link>
      </v-app-bar>
      <!---------HEADER END----------->
      <router-view></router-view>
  </v-app>
</template>
<script>
import firebase from 'firebase'
//import { db } from '@/main'
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      currentUser: false
    }
  },
  created() {
    if (firebase.auth().currentUser) {
      this.isLoggedIn = true
      this.currentUser = firebase.auth().currentUser.email
    }
  },
  methods: {
    LogoutUser() {
      firebase.auth().signOut()
      .then(() => {
        this.$router.go({
            path: this.$router.path
          })
      })
    }
  }
};
</script>
<style scoped>
a {
  text-decoration: none;

}
.color {
  color: white;
}
</style>

