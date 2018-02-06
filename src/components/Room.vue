<template>
  <div class="battle">
    <mu-appbar title="好友对战">
      <mu-icon-button icon="chevron_left" slot="left" @click="goBack()"/>
    </mu-appbar>
    <div class="user">
      <div class="left">
        <div class="left-user">
          <mu-avatar class="avatar" :size="60" color="deepOrange300" backgroundColor="purple500">xds</mu-avatar>
        </div>
        <div class="name">{{left?left:'加载中'}}</div>
      </div>

      <Circle :percent="time*10" :size="60" stroke-color="#ff5500" class="time" v-if="type==='battle'&& showQuestion">
        {{time}}
      </Circle>
      <div v-if="type==='over'">
        {{result}}
      </div>
      <div class="right">
        <div class="right-user">
          <mu-avatar class="avatar" :size="60" color="deepOrange300" backgroundColor="purple500">MB</mu-avatar>
        </div>
        <div class="name">{{right?right:'等待加入'}}</div>
      </div>
    </div>
    <div class="room" v-if="type==='room'">
      <mu-raised-button class="room-button" @click="exit">
        放弃
      </mu-raised-button>
      <mu-raised-button class="room-button" @click="start" v-if="right&&me==='left'">
        开始
      </mu-raised-button>
      <mu-raised-button class="room-button" @click="openBottomSheet" v-if="!right&&me==='left'">
        邀请
      </mu-raised-button>
    </div>
    <div class="q" v-else-if="type === 'battle'">
      <div class="score">
        <p>{{s.left}}</p>
        <Progress vertical :percent="leftSc" :stroke-width="15" hide-info></Progress>
      </div>
      <div class="question" v-show="showQuestion">
        <div class="question-text">
          {{questions[questionIndex].text}}
        </div>
        <div class="answers">
          <mu-raised-button :class="buttonClass[index]" v-for="(item,index) in questions[questionIndex].answers"
                            :label="item"
                            @click="chooseAnswer(index)" fullWidth/>
        </div>
      </div>
      <div class="score">
        <p>{{s.right}}</p>
        <Progress vertical :percent="rightSc" :stroke-width="15" hide-info></Progress>
      </div>
    </div>
    <div class="room" v-else-if="type === 'over'">
      <mu-raised-button class="room-button" @click="exit">
        放弃
      </mu-raised-button>
    </div>
    <mu-bottom-sheet :open="bottomSheet">
      <mu-list @change="bottomSheetItemClick">
        <mu-sub-header>
          请选择要邀请的好友
        </mu-sub-header>
        <mu-list-item v-for="item in user.friends" :title="item" :value="item"/>
      </mu-list>
    </mu-bottom-sheet>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import Vue from 'vue'

  export default {
    name: "battle",
    data() {
      return {
        id: '',
        left: null,
        right: null,
        bottomSheet: false,
        me: 'left',
        type: 'room',
        questionIndex: -1,
        showQuestion: false,
        s: {
          left: 0,
          right: 0
        },
        timer: false,
        time: 10,
        answer: {
          left: -1,
          right: -1
        },
        buttonClass: [
          'anwser-button',
          'anwser-button',
          'anwser-button',
          'anwser-button',
        ]
      }
    },
    sockets: {
      room(data) {
        this.id = data.roomId
      },
      roomEntered(data) {
        this.right = data;
        this.$Message.info({
          content: this.right + '进入了房间',
          top: 50,
          duration: 2
        })
      },
      invite(data) {
        this.$Message.success({
          top: 50,
          content: data.reason
        })
      },
      roomEnter(data) {
      },
      exit() {
        this.$router.back()
      },
      roomExited(data) {
        if (this.me === 'left') {
          this.$Message.info({
            top: 50,
            content: data.username + '离开了房间'
          })
          this.right = null;
        } else {
          this.$Message.info({
            top: 50,
            content: data.username + '离开了房间'
          })
          this.$router.back()
        }
      },
      started(data) {
        this.type = 'battle'
        this.questions = data.questions
        this.questionIndex = -1
        this.startTips(3)
      },
      qStarted(data) {
      },
      qFinished(data) {
        this.s.left = data.s.left;
        this.s.right = data.s.right;
        this.answer = data.answer
        this.refreshButton()
        this.timer = false
        if (this.questionIndex === 4) {
          this.over()
        } else {
          this.startTips(3);
        }
      }
    },
    created() {
      if (this.$route.query.left) {
        this.$socket.emit('user', {
          type: 'roomEnter',
          data: {
            roomId: this.$route.query.id
          }
        });
        this.id = this.$route.query.id
        this.left = this.$route.query.left;
        this.right = this.user.username
        this.me = 'right'
      } else {
        this.$socket.emit('user', {
          type: 'room',
          data: this.user
        });
        this.left = this.user.username
        this.me = 'left'
      }
    },
    destroyed() {
      this.$socket.emit('user', {
        type: 'roomExit',
        data: {
          roomId: this.id
        }
      })
    },
    computed: {
      ...mapState(['user']),
      leftSc() {
        return this.s.left / 12
      },
      rightSc() {
        return this.s.right / 12
      },
      result(){
        if (this.s.left===this.s.right){
          return '平局'
        }else if (this.s[this.me]>this.s[this.me==='left'?'right':'left']){
          return '胜利'
        }else{
          return '失败'
        }
      }
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      bottomSheetItemClick(val) {
        this.$socket.emit('user', {
          data: {
            to: val,
            roomId: this.id
          },
          type: 'invite'
        });
        this.closeBottomSheet()
      },
      closeBottomSheet() {
        this.bottomSheet = false
      },
      openBottomSheet() {
        this.bottomSheet = true
      },
      start() {
        this.$socket.emit('user', {
          type: 'start',
          data: {
            roomId: this.id
          }
        })
      },
      exit() {
        this.goBack()
      },
      startTips(sc) {
        if (sc !== 0) {
          this.$Message.info({
            content: sc + '秒后开始答题哦'
          });
          setTimeout(this.startTips, 1000, sc - 1)
        }
        else {
          this.questionIndex += 1;
          this.answer = {
            left: -1,
            right: -1,
          };
          this.$Message.info({
            context: '开始答题啦'
          });
          this.buttonClass = [
            'anwser-button',
            'anwser-button',
            'anwser-button',
            'anwser-button',
          ]
          this.showQuestion = true
          this.timer = true
          this.questionsTimer(10)
        }
      },
      questionsTimer(sc) {
        if (sc === 0) {
          this.time = sc
          this.timer = false
          this.$socket.emit('user', {
            type: 'qFinish',
            data: {
              score: 0,
              type: this.me,
              index: this.questionIndex,
              answer: -1,
              roomId: this.id
            }
          })
        }
        if (this.timer) {
          this.time = sc
          setTimeout(this.questionsTimer, 1000, sc - 1)
        }
      },
      chooseAnswer(an) {
        if (this.answer[this.me] === -1) {
          this.answer[this.me] = an;
          this.refreshButton()
          console.log(this.answer)
          if (an === this.questions[this.questionIndex].answer) {
            this.$socket.emit('user', {
              type: 'qFinish',
              data: {
                type: this.me,
                answer: an,
                index: this.questionIndex,
                score: this.time * 20,
                roomId: this.id
              }
            });
            this.s[this.me] += this.time * 20
          } else {
            this.$socket.emit('user', {
              type: 'qFinish',
              data: {
                type: this.me,
                answer: an,
                index: this.questionIndex,
                score: 0,
                roomId: this.id
              }
            });
          }
        }
      },
      refreshButton() {
        for (let i = 0; i < 4; i++) {
          if (i === this.questions[this.questionIndex].answer) {
            Vue.set(this.buttonClass, i, 'right-button')
          } else if (i === this.answer.left || i === this.answer.right) {
            Vue.set(this.buttonClass, i, 'wrong-button')
          }
        }
      },
      over() {
        console.log('结束啦')
        this.type='over'
        this.$socket.emit('user', {
          type: 'finish',
          data:{
            roomId:this.id
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .battle {
    height: 100%;
    background-color: #7e57c2;
    display: flex;
    flex-direction: column;
  }

  .room {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }

  .room-button {
    height: 100px;
    width: 100px;
    border-radius: 50px;
    margin: 20px;
  }

  .user {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    align-items: center;
  }

  .left-user, .right-user {
    background-color: cadetblue;
    height: 70px;
    width: 90px;
    align-items: center;
  }

  .left-user {
    border-radius: 0 35px 35px 0;
    display: flex;
    justify-content: flex-end;
  }

  .right-user {
    border-radius: 35px 0 0 35px;
    display: flex;
    justify-content: flex-start;
  }

  .avatar {
    margin: 5px;
  }

  .time {
    color: #ffffff;
    font-size: 20px;
  }

  .left, .right {

  }

  .name {
    color: white;
    text-align: center;
    width: 60px;
    margin: 5px;
  }

  .left {
    display: flex;
    flex-direction: column;
    .name {
      align-self: flex-end;
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    .name {
      align-self: flex-start;
    }
  }

  .q {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    flex-direction: row;
    flex-grow: 1;
    padding: 20px 0;
  }

  .score {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60px;
    font-size: 20px;
    color: white;
  }

  .question {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .question-text {
    font-size: 15px;
  }

  .answers {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: stretch;
    flex-grow: 1;
    justify-content: center;
  }

  .anwser-button {
    color: #7e57c2;
    margin: 20px;
    height: 50px;
    border-radius: 10px;
  }

  .right-button {
    background-color: seagreen;
    color: #7e57c2;
    margin: 20px;
    height: 50px;
    border-radius: 10px;
  }

  .wrong-button {

    background-color: #f44336;
    color: #7e57c2;
    margin: 20px;
    height: 50px;
    border-radius: 10px;
  }
</style>