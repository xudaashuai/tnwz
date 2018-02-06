<template>
  <mu-raised-button :to="to" class="card" :style="style">
    <div class="text">
      {{text}}
    </div>
  </mu-raised-button>
</template>

<script>

  const colors = [
    '#1b54f2',
    '#2578b5',
    '#008e59',
    '#e9db39',
    '#c35655',
    '#fcb1aa',
    '#d54b44',
    '#bca590',
    '#a9b08f',
    '#3d6e53',
    '#006e5f',
    '#276893',
    '#9c6680',
    '#eacdd1',
    '#304758',
    '#2ec3e7',
  ];
  export default {
    name: "index-block",
    props: ['text', 'to'],
    data() {
      return {
        style: {
          height: Math.random() * 100 + 100 + 'px',
          backgroundColor: colors[(Math.floor(Math.random() * 100)) % colors.length]
        },
      }
    },
    computed: {
    },
    mounted() {
    }
  }
</script>

<style lang="scss" scoped>
  .card {
    margin: 10px 5px;
    border-radius: 5px;
    display: flex;
  }

  .text {
  }
</style>