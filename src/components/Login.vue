<template>
  <v-app>
    <div class="container">
      <p class="title-login">ログイン</p>
      <v-form>
        <i class="material-icons prefix color">email</i>
        <v-text-field
          color="icon"
          id="email"
          v-model="email"
          label="email"
          type="email"
          required
        ></v-text-field>
        <i class="material-icons prefix color">lock</i>
        <v-text-field
          color="icon"
          id="password"
          v-model="password"
          type="password"
          label="password"
        ></v-text-field>
        <v-btn depressed small color="accent" @click="login">送信する</v-btn>
      </v-form>
    </div>
  </v-app>
</template>

<script>
import firebase from 'firebase';
export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      user: []
    };
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          alert(`${this.email}でログインしました`);
          this.user = firebase.auth().currentUser;
          this.$router.go({
            path: this.$router.path
          })
          this.email = '';
          this.password = '';
        })
        .catch(err => {
          alert(err.massage)
        })
    }
  }
};
</script>

<style scoped>
.container {
  width: 500px;
  border: 1px solid lightgray;
  border-radius: 10px;
  margin-top: 200px;
  background-color: rgb(250, 249, 249);
}
.color {
  color: #26C6DA;
}
</style>
