<template>
  <div>    
    <ShareChat />
  </div>
</template>

<script>
import ShareChat from '../components/ShareChat'
import WXSDK from '../utils/wx'
import Logger from '../utils/log'


function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

export default {
  name: 'share',
  data() {
    return {          
    }
  },
  computed: {
    book () {
      return this.$store.state.book
    }
  },
  watch: {
    book(v, ov){
      var chapter = JSON.parse(sessionStorage.getItem(`${v._id}`))|| v.catalog[0];
      this.$store.dispatch('openChapter', chapter);

      Logger.page('sharepage', getQueryString('channel'), location.pathname, '', v._id, chapter.cid);

      let book = v;
      WXSDK.init({
          title: book.description,
          desc: book.keyword,
          link: location.href,
          imgUrl: "http://res.easyepub.net/"+book.cover,
          success: function() {
            //@TODO  细分分享渠道            
            Logger.share(v._id, chapter.cid, this.$store.state.channel, 'wechat', 'timeline')
          },
          cancel: function() {
          }
      },function(wx){
      });

    },
  },
  mounted(){
    //this.$store.state.mode = this.mode;
    this.$store.state.channel = getQueryString('channel');
    this.$store.dispatch('openBook', this.$route.params.bid);
    // if(document.documentElement.offsetWidth > 750)
    //   document.querySelector('.container').style.width = '375px';
    document.getElementById('app').className = 'dark';    
  },  
  components: {        
    ShareChat
  }
}
</script>
