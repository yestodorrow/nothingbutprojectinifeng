<template> 
<swipe class="slider" :auto="4000">
  <swipe-item >
    <div class="openapp" >
        <img src="../assets/fread.png" alt="" style="width:1.2rem;">
        <div class="desc">
          <h3>Over无聊  我们不一样</h3>
        </div>        
        <a :href="openurl()" @click="handleClick()">打开</a>
      </div>  
  </swipe-item>
  <swipe-item >
    <div class="openapp" >
        <img src="http://res.easyepub.net/banner/cover2.jpg" alt="">
        <div class="desc">
          <h3>论如何杀死那个油腻猥琐的中年男人</h3>
        </div>        
        <a :href="openurl()" @click="handleClick()">阅读</a>
      </div> 
  </swipe-item>
  <swipe-item >
    <div class="openapp" >
        <img src="http://res.easyepub.net/banner/cover1.jpg" alt="">
        <div class="desc">
          <h3>我给你讲个鬼故事：谁说我是人了</h3>
        </div>        
        <a :href="openurl()" @click="handleClick()">阅读</a>
      </div>  
  </swipe-item>
  
</swipe>
                  
</template>

<script>
import Logger from '../utils/log';  
import { Swipe, SwipeItem } from 'mint-ui';

export default {
  name: 'openapp',
  data () {
    return {
      isAndroid: false,
      isIOS: false,
      isWechat: false,
    }
  },
  mounted(){         
    var browser = {
        isAndroid: function() {
            return navigator.userAgent.match(/Android/i) ? true : false;
        },
        isMobileQQ : function(){
            var ua = navigator.userAgent;
            return /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/.test(ua) || /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/.test(ua);
        },
        isIOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
        },
        isWx : function() {
            return navigator.userAgent.match(/micromessenger/i) ? true : false;
        }
    };
    
    this.isWechat = browser.isWx();
    this.isAndroid = browser.isAndroid();
    this.isIOS = browser.isIOS();
    
    
  },
  methods:{    
    onSlideChangeStart (currentPage, el) {
      return false;
      //console.log('onSlideChangeStart', currentPage, el);
    },
    onSlideChangeEnd (currentPage, el) {
      return false;
      //console.log('onSlideChangeEnd', currentPage, el);
    },
    openurl(){          
      //android http://a.app.qq.com/o/simple.jsp?pkgname=com.ifeng.android&android_scheme=fread://web?url=
      //ios http://ios.yc.ifeng.com/ios/book/0/?download=fread&action=bookstore
      if(this.isAndroid){
        return `http://a.app.qq.com/o/simple.jsp?pkgname=com.ifeng.android&ckey=CK1378403279768&android_scheme=fread://web?url=http://jh.yc.ifeng.com/books/${this.$store.state.book._id}/?channel=103&event=callfread`
      }else if( this.isIOS){
        return 'http://ios.yc.ifeng.com/ios/book/0/?download=fread&action=bookstore&from=share'
      }           
    },
    handleClick(){
      Logger.call(this.$store.state.book._id, this.$store.state.chapter.cid,this.$store.state.channel, this.isAndroid?'android':'ios');     
    }
  },
  components:{
    'swipe': Swipe,
    'swipe-item': SwipeItem
  }
}  
</script>

<style >
.slider {
  position: fixed !important;
  height: 1.6rem !important;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #222;
  z-index: 20;
  padding: 0px 0 10px;  
  box-sizing: border-box;
}
.slider .mint-swipe-indicators{
  bottom: 4px !important;
  line-height: 25px;
}
.slider .mint-swipe-indicator {
  height: 4px;
  width: 4px;
  border-radius: 2px;  
  margin: 0 1px;
  opacity: 1;
  background: #ccc;
  transition: width .1s ease-in;
}
.slider .mint-swipe-indicator.is-active{
  background: #F54343 !important;
  opacity: 1;
  width: 8px;
}
.openapp{
  text-align: left;
  position: relative;
}
.openapp img{
  display: inline-block;
  width: 0.9rem;
  height: 1.2rem;
  margin-left: 10px;
  margin-top: 5px;
}
.openapp .desc{
  display: inline-block;
  vertical-align: top;
}
.openapp .desc h3{
  font-size: .4rem;
  line-height: 1.6rem;
  color: #fff;
  font-weight: 400;
}
.openapp .desc p{
  font-size: .35rem;
  color: #666;
}
.openapp a{
  position: absolute;
  right: .25rem;
  top: .4rem;
  height: 0.8rem;
  line-height: 0.8rem;
  color: #fff;
  font-size: .4rem;
  text-align: center;
  border-radius: 4px;
  background: #F44242;
  padding: 0 .5rem;
}
</style>
