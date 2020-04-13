<template>
  <v-app>
    <div class="container">
      <p class="title-login">登録</p>
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
        <v-btn depressed small color="accent" @click.prevent="register"
          >送信する</v-btn
        >
      </v-form>
    </div>
  </v-app>
</template>

<script>
import firebase from 'firebase';
export default {
  name: 'register',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    register() {
      firebase.auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        // eslint-disable-next-line no-unused-vars
        .then(user => {
          alert(` ${this.email}でアカウントが作成されました!`);
          this.$router.go({
            path: this.$router.path
          })
          this.email = '';
          this.password = '';
        })
        .catch(err => {
          alert(err.message)
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
  color: rgb(61, 196, 214);
}
</style>
