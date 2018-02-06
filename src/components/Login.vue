<template>
  <div class="index">
    <mu-appbar>
      <p align="center">
        登录哦
      </p>
    </mu-appbar>
    <div class="content" v-if="status==='login'">

      <mu-text-field v-model="loginData.username" label="用户名" labelFloat fullWidth/>
      <br/>
      <mu-text-field v-model="loginData.password" type="password" label="密码" labelFloat fullWidth/>
      <br/>
      <mu-flat-button label="注册" fullWidth class="text-button" @click="status='logon'"/>
      <mu-raised-button label="登录" fullWidth class="full-button" @click="login"/>
    </div>
    <div class="content" v-if="status==='logon'">
      <mu-text-field :error-text="usernameTip" v-model="logonData.username" label="用户名" labelFloat fullWidth/>
      <br/>
      <mu-text-field :error-text="passwordTip" v-model="logonData.password" type="password" label="密码" labelFloat
                     fullWidth/>
      <br/>
      <mu-text-field :error-text="passwordAgainTip" v-model="logonData.passwordAgain" type="password" label="确认密码"
                     labelFloat fullWidth/>
      <br/>
      <mu-flat-button label="登录" fullWidth class="text-button" @click="status='login'"/>
      <mu-raised-button label="注册" fullWidth class="full-button" @click="logon"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        status: 'login',
        loginData: {
          username: '',
          password: ''
        },
        logonData: {

          username: '',
          password: '',
          passwordAgain: ''
        }
      }
    },
    sockets: {
      logon: function (data) {
        console.log(data)
        this.status='login'
      },
      login: function (data) {
        console.log(data)
        if(data.status){
          this.$localStorage.set('user', data.data)
          this.$store.commit('setUser',data.data)
          this.$router.replace('/')
        }
      },
    },
    computed: {
      usernameTip() {
        return this.logonData.username.length === 0 ? '太短啦' : (this.logonData.username.length > 10 ? '太长啦' : '')
      },
      passwordTip() {
        return this.logonData.password.length < 6 ? '太短啦' : (this.logonData.username.length > 10 ? '太长啦' : '')
      },
      passwordAgainTip() {
        return this.logonData.password === this.logonData.passwordAgain ? '' : '两次输入的密码不一样呢'
      },
    },
    methods: {
      login() {
        this.$socket.emit('user', {
          type: 'login',
          data: this.loginData
        })
      },
      logon() {
        if (this.usernameTip.length !== 0) {
          this.$Message.error({
            top: 50,
            duration: 2,
            content: '用户名' + this.usernameTip
          })
        } else if (this.passwordTip.length !== 0) {
          this.$Message.error({
            top: 50,
            duration: 2,
            content: '密码' + this.passwordTip
          })
        } else if (this.passwordAgainTip.length !== 0) {
          this.$Message.error({
            top: 50,
            duration: 2,
            content: this.passwordAgainTip
          })
        } else {
          this.$socket.emit('user', {
            type: 'logon',
            data: this.logonData
          })
        }
      },
    }
  }
</script>

<style scoped>
  .index {
    background-color: #feffff;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .content {
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    padding: 30px;
    padding-bottom: 90px;
  }

  .full-button {
    background-color: seagreen;
    height: 50px;
    font-size: 20px;
  }

  .text-button {
    color: cornflowerblue;
    height: 50px;
    font-size: 20px;
    align-self: flex-end;
    padding: 5px;
  }

  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */
  {
    transform: translateX(10px);
    opacity: 0;
  }

  .ivu-message {
    font-size: 15px;
  }
</style>