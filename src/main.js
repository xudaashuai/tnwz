// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import VueSocketio from 'vue-socket.io'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import store from './store'
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueLocalStorage)
Vue.use(VueSocketio, "http://localhost:8081");
Vue.use(MuseUI)
Vue.config.productionTip = false

Vue.use(iView);
/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next();
});

router.afterEach(route => {
  iView.LoadingBar.finish();
});
new Vue({
  el: '#app',
  router,
  store,
  sockets: {
    logon: function (data) {
      console.log(data)
      console.log('logon')
    },
    connect: function () {
      console.log('connect')
    },
  },
  localStorage: {
    user: {
      type: Object,
      default: null
    },
  },
  components: {App},
  created() {
    if (this.$store.state.user === null) {
      if (this.$localStorage.get('user') === null) {
        this.$router.replace('/login')
        return;
      } else {
        this.$store.commit('setUser', this.$localStorage.get('user'))
      }
    }
    this.$socket.emit('user',{
      type:'up',
      data:this.$store.state.user
    })
  },
  template: '<App/>'
})
