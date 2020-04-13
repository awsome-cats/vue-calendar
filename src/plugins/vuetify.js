import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { colors } from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.grey.darken4,
        secondary: colors.red.lighten4, 
        accent: colors.indigo.base, 
        icon: colors.cyan.lighten1
      }
    }
  }
});
