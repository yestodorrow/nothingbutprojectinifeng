<template>  
  <div class="chat" :class="{over: end}">    
    <div class="content" ref="content" @click="next" >
          <transition-group name="fade" tag="ul" v-on:enter="enter" ref="container">
            <li v-for="(item, index) in msg" :key="index" :item="item" :index="index"  is="message">              
            </li>
          </transition-group>            
          <div class="touch" v-show="current < start+3">
            <img src="../assets/hand.png"/>
            <p>点击屏幕阅读</p>
          </div>
    </div>  
    <OpenApp />
    <ShareTail v-show="end"/>
    <div class="steps"><IProgress :value="percent"/></div>    
  </div>
</template>

<script>
import Message from './Message'
import IProgress from './IProgress'
import Logger from '../utils/log'
import ShareTail from './ShareTail'
import OpenApp from './OpenApp'

var during = false;
var time = null;
export default {
  name: 'sharechat',
  components:{
    Message,
    IProgress,
    ShareTail,
    OpenApp
  },
  data () {
    return {
      end: false,
      msg: [],
      auto: false,
      percent: 0,
      start: 4,
      current: 4,
    }
  },  
  computed: {
    story() {      
      return this.$store.state.story
    }
  },
  watch: {    
    story(v,ov){      
      this.current = +localStorage.getItem(`${this.$store.state.book._id}-${this.$store.state.chapter.cid}`) || this.start - 1;
      this.msg = v.slice(0, this.current);   
      if(this.current >= v.length)
        this.end = true;
      else 
        this.end = false;
    },
    current(v, ov) {
      const len = this.$store.state.story.length;
      if(v >= len) {
        this.end = true;
        this.percent = 100;
        return false;
      }
      this.percent = Math.ceil(v/ len * 100)              
      this.msg.push(this.$store.state.story[v]);
      localStorage.setItem(`${this.$store.state.book._id}-${this.$store.state.chapter.cid}`, v);
      Logger.view(this.percent, this.$store.state.book._id, this.$store.state.chapter.cid , this.$store.state.channel, v);
    },
    end(v, ov){      
      Logger.view( 100, this.$store.state.book._id, this.$store.state.chapter.cid , this.$store.state.channel, this.$store.state.story.length);
    }
  },
  methods: {        
    next() {      
        clearTimeout(during);
        if(this.auto){
          this.auto = false;
          clearTimeout(time);
          return false;
        }
        if(this.end) return false;
          this.current++;        
       
    },  
    enter: function (el, done) {
      var uldom = this.$refs.container.$el;
      document.documentElement.scrollTop = uldom.scrollHeight;     
      document.body.scrollTop = uldom.scrollHeight;  
      window.scroll(0, uldom.scrollHeight) 
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transform: translate3d(0,0,0);
  transition: opacity 0.3s 0;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  opacity: 0
}
.chat{
  -webkit-overflow-scrolling:touch;
}
.chat.over .content{
  bottom: 0;
  /* padding-top: 90px; */
  /* transform: translate3d(0, -90px,0); */
}
.chat.over .button{
  display: none;
}

.content{
  position: relative;
  font-size: 0.4rem;
  padding-top: 0px;
  min-height: 100vh;
   /* transition: all .5s 2s ease-in;  */
}
.content > ul{
  height: 100%;
  overflow: auto;
  padding: 5px 10px;
  padding-top: 10px;
  padding-bottom: 4rem;
  box-sizing: border-box;
  
}
.content > ul div{
  line-height: 15px;
  padding: 5px 10px;
  box-sizing: border-box;
}
.touch{
  position: fixed;
  bottom:  3rem;
  left: 2rem;
  right: 2rem;
  width: 6rem;
  height: 1.33rem;
  border-radius: 1rem;
  text-align: center;
}
.touch img{
  width: 0.58rem;
  height: 0.9rem;
  margin-top: .2rem;
}
.touch p{
  display: inline-block;
  margin-top: .5rem;
  margin-left: 6px;
  font-size: .4rem;
  vertical-align: top;
}
.steps{
  position: fixed;
  left: 0;
  bottom: 0rem;
  z-index: 120;  
  width: 100%;  
}
.button{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 7;  
  width: 100%;
  background: transparent;  
  -webkit-touch-callout: none;
}
.button a{
  display: block;
  margin: 10px; 
  height: 100%;  
  text-align: center;
  font-size: 1rem;
  color: #FF6E32;
  text-decoration: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;  
}
.model{
  position: absolute;
  right: 10px;
  width: 1rem;
  height: 1rem;
  z-index: 7;
  background: rgba(0, 0, 0, 0.3);
  bottom: 3rem;
  font-size: .3rem;
  line-height: 1rem;
  color: #eee;
  border: 3px solid #333;
  border-radius: 50%;
}
.rebtn{
  display: inline-block;
  height: 40px;
  line-height: 40px;
  width: 100px;
  background: #FF6E32;
  color: #fff;
  border-radius: 5px;
  text-align: center;
  margin: 20px;
}
.home,.share{
  position: fixed;
    top: 20px;
    left: 20px;
    z-index: 111;
    width: 1rem;
    height: 1rem;
    line-height: 1rem;    
    border-radius: 50%;
    background: rgba(51, 136, 238, 0.7);
}
.share{
  left: auto;
  right: 20px;
}

</style>
