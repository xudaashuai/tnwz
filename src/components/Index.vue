<template>
  <div class="index">
    <mu-appbar>
      <p align="center">
        头脑王者
      </p>
    </mu-appbar>
    <div class="content">
      <div class="left">
        <Block v-for="item in blocks" :text="item.text" :key="item.text" :to="item.path">
        </Block>
      </div>
    </div>
  </div>
</template>

<script>
  import IndexBlock from '@/components/IndexBlock'

  export default {
    name: "index",
    components: {
      Block: IndexBlock
    },
    data() {
      return {
        blocks: [
          {
            text: '好友对战',
            path: 'room'
          },
        ]
      }
    }
  }
</script>

<style scoped>
  .index {
    background-color: #333333;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .content{
    overflow: auto;
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
  }
  .left,.right{
    flex-grow: 1;
  }
</style>