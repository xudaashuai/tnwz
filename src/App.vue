<template>
  <div class="app">
    <router-view/>
    <mu-dialog v-if="dialog" :open="dialog" title="好友邀请" @close="close">
      {{inviteFrom.fromName}}邀请你进行对战
      <mu-flat-button slot="actions" @click="refuse" primary label="取消"/>
      <mu-flat-button slot="actions" primary @click="ok" label="确定"/>
    </mu-dialog>
  </div>
</template>

<script>
  export default {
    name: 'App',
    created() {

    },
    sockets: {
      invited(data) {
        this.inviteFrom = data
        this.open()
      },
    },
    data() {
      return {
        dialog: false
      }
    },
    methods: {
      open() {
        this.dialog = true
      },
      close() {
        this.dialog = false
      },
      ok() {
        this.close()
        this.$router.push({
          path:'/room',
          query:{
            id:this.inviteFrom.roomId,
            left:this.inviteFrom.fromName,
          }
        })
      },
      refuse() {
        this.close()
      }
    }
  }
</script>

<style scoped>
  .app {
    height: 100%;
  }
</style>
