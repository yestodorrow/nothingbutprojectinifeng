<template>
  <div>    
    <Chat />
  </div>
</template>

<script>
import Chat from '../components/Chat'
import Logger from '../utils/log'

var storage = localStorage?localStorage:sessionStorage;  //android 客户端老版本 不支持local存储  ios支持


function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

export default {
  name: 'app',
  data() {
    return {          
      'mode': ''//getQueryString('mode')||['chat','normal','page'][new Date().getSeconds()%3]      
    }
  },
  computed: {
    book () {      
      return this.$store.state.book
    },
    story() {
      return this.$store.state.story
    }
  },
  watch: {
    book(v, ov){      
      var chapter = JSON.parse(storage.getItem(`${v._id}`))|| v.catalog[0];
      this.$store.dispatch('openChapter', chapter)       
      Logger.page('bookpage', getQueryString('channel'), location.pathname, "", v._id, chapter.cid);
    },
    story(){
      if(storage.getItem('scrolltop') != null){
        setTimeout(()=>{
          window.scroll(0, storage.getItem('scrolltop'));
          storage.removeItem('scrolltop');
        },100)
      }     
    }
  },
  mounted(){
    if(getQueryString('from') != null)  //从其他客户端分享出去的地址  如果来自微信访问  跳转到分享地址上去
      window.location.href = window.location.href.replace('books', 'share')
    //this.$store.state.mode = this.mode;    
    this.$store.state.channel = getQueryString('channel');
    this.$store.dispatch('openBook', this.$route.params.bid);
    // if(document.documentElement.offsetWidth > 750)
    //   document.querySelector('.container').style.width = '375px';
    document.getElementById('app').className = this.$store.state.theme;             
  },  
  components: {        
    Chat
  }
}
</script>
