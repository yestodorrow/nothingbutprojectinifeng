<template>
  <div class="tail">
    <div class="endding">     
      <div>
        <!-- <a @click="reqUpdate()" class="update-btn">非常好看,快更新</a>  -->
        <a @click="nextChapter()" class="next-btn">下一章</a>         
      </div>
        
       <!-- <ul><li>
        <a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=bcd002beb4c2384428ebcd57f1d3a62e34f206448d30ce13ecf096fc32bafbcc">        
          <p><i class="icon-chat"></i><span>读者交流Q群：496129569</span></p>
        </a></li>
       </ul>           -->
    </div>    
  </div>
</template>

<script>
import { Toast } from 'mint-ui';


export default {
  name: 'tail',
  data () {
    return {
      openurl: '',
      isNative: false,
      isWechat: false,
    }
  },
  mounted(){         
   
  },
  methods:{
    reqUpdate(){
      Toast('感谢您的反馈，我们会尽快联系作者更新.')
    },
    nextChapter(){
      const cur = this.$store.state.chapter;
      const chapters = this.$store.state.book.catalog;
      if(chapters.length<2){        
        Toast('作者最近没有更新，看看其他内容吧！')
      }else{
        let idx = -1;
        chapters.forEach(function(v,i){
          if(v.cid == cur.cid)
            idx = i;       
        })
        if(idx+1 < chapters.length){
          this.$store.dispatch('openChapter', chapters[idx+1])
        }else{
          Toast('作者最近没有更新，看看其他内容吧！')
        }
      }
    }
  }
}
</script>

<style scoped>
.tail{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 1.3rem;  
  font-size: .35rem;
  text-align: center;
  transition: all .3s 0s ease-in; 
  transform: translate3d(0, 100%,0);
}
.over .tail{
  transform: translate3d(0,0%,0);
}
.endding{
  position: relative;  
  padding:0;
  text-align: center;
}
.endding img{
  max-width: 100%;
    width: 3.5rem;
}
.endding h3{
    margin: 10px 0;
    font-size: .5rem;
}
.endding ul{
  
}
.endding li{
  display: block;
}
.endding li a{
  display: block;
  height: 40px;
  line-height: 40px;
}
.endding li p{
  text-align: center;
  text-indent: 20px;
  color: #333;
}
.endding li span{
  font-size: .3rem;
  color: #999;
}
.icon-chat{
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;  
  background-size: contain !important;
  margin-right: 5px;
  vertical-align: middle;
  background: url(../assets/chat.png) no-repeat 0 0;
}
.update-btn{
  margin: 15px 5px;
  height: 1rem;
  width: 5.3rem;
  background: #4A90E2;
  border-radius: 0.66rem;
  color: #fff;
  display: inline-block;
  line-height: 1rem;
}
.next-btn{
  margin: 15px 5px;
  height: 1rem;
  width: 2.6rem;
  background: #F5515F;
  border-radius: 0.66rem;
  color: #fff;
  display: inline-block;
  line-height: 1rem;
}
</style>

