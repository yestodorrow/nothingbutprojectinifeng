<template>
  <div class="comment">
    <ul>
      <Message :item="current" :index="position" :forcomment="true"/>
    </ul>
    <div class="comment-button">
      <p>用户评论  共{{getCount()}}条评论</p>
      <button type="button" @click="showComment()">发评论</button>
    </div>
    <comment-list />
    <comment-input :isshow="formShow" v-on:hide="hideComment()" ref="input"/>
  </div>
</template>

<script>
import CommentList from '../components/CommentList'
import CommentInput from '../components/CommentInput'
import Message from '../components/Message'
import Logger from '../utils/log'
import { Toast } from 'mint-ui';


function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

export default {
  name: 'comment',
  data() {
    return {      
      position: 0,    
      current: {},
      formShow: false
    }
  },
  methods: {
    showComment(){      
      // if(typeof Native !="undefined"){//判断是否在翻阅客户端内 

      // }
      if(this.$cookie.get('sessionid') == null){ //是否登录
        Toast('登录翻阅客户端才可以发表评论哦')
      }else{
        //fixed ios 客户端 跨域  cookie漏传的问题
        this.formShow = true;
        var domain = /\.(.+)/.exec(location.hostname)[1];
        document.domain = domain;
        this.$cookie.set('sessionid', this.$cookie.get('sessionid'), {expires: 1, domain: domain});                
      }           
    },
    hideComment(){
       this.formShow = false;
    },
    getCount(){
      return this.$store.state.counts[this.position]||0;
    }
  }, 
  watch: {
    formShow(v, ov){
      if(v){        
        this.$refs.input.$refs.input.focus()        
      }
    },
    book(v, ov){
      //var chapter = JSON.parse(sessionStorage.getItem(`${v._id}`))|| v.catalog[0];
      this.$store.dispatch('openChapter', {cid: this.$route.params.cid});
      Logger.page('commentpage', getQueryString('channel'), location.pathname, "",v._id, this.$route.params.cid);
    } ,
    chapter(){
      this.position = this.$route.params.pos;      
      this.current = this.$store.state.story[this.position];
    }    
  },
  computed: {
    chapter(){
      return this.$store.state.chapter
    },
    book () {
      return this.$store.state.book
    }    
  },
  mounted(){
    // this.$store.state.channel = getQueryString('channel');    
    this.$store.dispatch('openBook', this.$route.params.bid);    
    document.getElementById('app').className = this.$store.state.theme;    
  },  
  components: {        
    CommentList,
    CommentInput,
    Message
  }
}
</script>
<style lang="scss">
.comment {  
  min-height: 100vh;
  font-size: .4rem;
  > ul{
    padding: 15px;;
  }
}
.comment-button{
  padding: 20px;
  text-align: center;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  p {
    font-size: .35rem;
    color: #AAAAAA;
  }
  button{
    margin-top: 10px;
      border: 0;      
      border-radius: 5px;
      font-size: .4rem;      
      width: 2.4rem;
      height: .8rem;
  }
}
</style>

