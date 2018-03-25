<template>
  <div class="navigator">     
    <a href="javascript:history.back();"><i class="icon-back"></i>返回</a>
    <div class="buttons">
      <a @click="changeTheme()"><i class="icon-theme"></i></a>
      <a @click="showCatalog()" ><i class="icon-catalog"></i></a>
      <a @click="handleShare()" :href="getShare()" v-if="isNative()"><i class="icon-share"></i></a>
    </div>
  </div>
</template>

<script>
import Logger  from '../utils/log'

export default {
  name: 'navigator',
  methods:{
    getHome(){
      return `/books/?channel=${this.$store.state.channel}`
    },
    getShare(){
      let bookid = encodeURIComponent(`${this.$store.state.book.description},${this.$store.state.book.keyword},http://res.easyepub.net/${this.$store.state.book.cover},http://jh.yc.ifeng.com/share/${this.$store.state.book._id}/?channel=502`)            
      return `ifeng:share|${bookid}`
    },
    handleShare(){
      Logger.share(this.$store.state.book._id, this.$store.state.chapter.cid, this.$store.state.channel, 'fread', 'wechat')
    },
    isNative(){
      return this.$store.state.channel == "103" || this.$store.state.channel == "104"  //内部客户端有分享
    },
    changeTheme(){      
      if(this.$store.state.theme == 'default')
        this.$store.dispatch('changeTheme', 'dark');
      else
        this.$store.dispatch('changeTheme', 'default');        
    },
    showCatalog(){
      this.$store.state.isshow = true;
    }
  } 
}
</script>

<style >
.navigator{
  font-size: .35rem;  
  color: #333;
}
.navigator .buttons{
  float: right;
}
.navigator a{
  display: inline-block;
}
.navigator .buttons {
  margin-right: 20px;
}
.navigator .buttons i{
  margin: 0 15px;
  vertical-align: middle;
}
.icon-back{
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;  
  vertical-align: middle;
  background: transparent;
   background-size: contain !important;
  margin-left: 20px;
  margin-top: -3px;
}
.icon-theme{
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;  
  background-size: contain !important;
}
.icon-catalog{
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;  
  background-size: contain !important;
}
.icon-share{
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;  
  background-size: contain !important;
}
</style>
