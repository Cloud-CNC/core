/**
 * @fileoverview Main javascript file for the frontend
 */

//Workbox config
import pkg from '../../package.json';

//Vue and plugins
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';

//Styling
import 'vuetify/dist/vuetify.css';
import 'typeface-roboto/index.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import colors from 'vuetify/lib/util/colors.js';

//Main template
import index from './index.vue';

//Routes
import account from './views/account.vue';
import accounts from './views/accounts.vue';
import controllers from './views/controllers.vue';
import error from './views/error.vue';
import file from './views/file.vue';
import files from './views/files.vue';
import login from './views/login.vue';
import machines from './views/machines.vue';
import trash from './views/trash.vue';

//Vue plugins
Vue.use(VueRouter);
Vue.use(Vuetify);

//Routes
const routes = [
  {
    path: '/', redirect: '/files'
  },
  {
    name: 'Login', path: '/login', component: login
  },
  {
    name: 'File', path: '/file/:id', component: file
  },
  {
    name: 'Files', path: '/files', component: files
  },
  {
    name: 'Trash', path: '/trash', component: trash
  },
  {
    name: 'Machines', path: '/machines', component: machines
  },
  {
    name: 'Controllers', path: '/controllers', component: controllers
  },
  {
    name: 'Accounts', path: '/accounts', component: accounts
  },
  {
    name: 'Account', path: '/account/:id?', component: account
  },
  {
    name: '404', path: '/**', component: error
  }
];

//Router
window.$router = new VueRouter({
  mode: 'history',
  routes: routes
});

//Vue instance
const app = new Vue({
  el: '#app',
  router: window.$router,
  vuetify: new Vuetify({
    icons: {
      iconfont: 'md'
    },
    theme: {
      themes: {
        light: {
          primary: colors.green.accent2,
          secondary: colors.blue.base,
          accent: colors.blue.darken2
        },
        dark: {
          primary: colors.blueGrey.darken1,
          secondary: colors.amber.darken1,
          accent: colors.amber.darken4
        }
      }
    }
  }),
  render: h => h(index)
});

//Update title
document.title = 'Cloud CNC - ' + app.$route.name;
window.$router.beforeEach((to, from, next) =>
{
  document.title = 'Cloud CNC - ' + to.name;
  next();
});

//Production: register service worker
if (process.env.NODE_ENV == 'production' && 'serviceWorker' in navigator)
{
  window.addEventListener('load', () =>
  {
    //Prevent parcel from following
    navigator.serviceWorker.register(`./${pkg.workbox.swDest}`);
  });
}