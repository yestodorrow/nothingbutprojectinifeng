<template>
  <div class="wxshare" v-show="isShow"  ontouchmove="return false;">
      <div class="handler" >        
        <img src="../assets/wxshare.png" alt="">        
      </div>
      <div class="tips">
        <p>邀请小伙伴一起来吧</p>
        <p>点此分享到朋友圈</p>              
        <a class="ok-btn" @click="hideHandle()">知道了</a>
      </div>        
    </div>    
</template>

<script>
export default {
  name: 'sharetail',
  data () {
    return {
      isShow: true,
      isWechat: false,
    }
  },
  mounted(){         
    if(this.$store.state.channel == 103 || this.$store.state.channel == 104){
      this.isNative = true;   
    } 
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
    if(browser.isWx()){
      this.isWechat = true;
    }else{
      this.isWechat = false;
    }
    //console.log(this.openurl)
    //android http://a.app.qq.com/o/simple.jsp?pkgname=com.ifeng.android&android_scheme=fread://web?url=
    //ios http://ios.yc.ifeng.com/ios/book/0/?download=fread&action=bookstore
  },
  methods:{
    hideHandle(){
      this.isShow = false;
    }
  }
}
</script>

<style scoped>
.wxshare{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
  background: rgba(0,0,0,.7);
}
.wxshare .handler{
  position: absolute;
  top:0;
  right: 0;
  width: 4.8rem;
  height: 4.8rem;
}
.wxshare .handler img{
  width: 100%;  
}
.wxshare .handler p{
  margin-right: 20px;
  color: #f90;
}
.wxshare .tips{
  width: 100%;
  margin-top: 5rem;
  text-align: center;
  font-size: 0.66rem;
}
.wxshare .tips p{
  font-weight: 800;
  line-height: 1rem;
}
.ok-btn{  
  display: inline-block;
  background: #E2393C;
  box-shadow: 0 5px 0 0 #B02C2F;
  border-radius: 27.5px 27.5px 27.5px 27.5px;
  color: #FFFFFF;  
  font-size: 0.66rem;
  width: 5.2rem;
  height: 1.2rem;
  line-height: 1.2rem;
  margin-top: 1rem;
}
</style>

