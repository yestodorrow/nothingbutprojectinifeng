<template>
<div class="commentlist">
  <div v-if="comments.length>0">
  <ul  v-infinite-scroll="loadMore"
  infinite-scroll-disabled="over"
  infinite-scroll-distance="10">
    <li v-for="item in comments" :key="item._id">
      <div class="aside">
        <img :src="getAvatar(item.user.username)" alt="">
      </div>
      <div class="desc">
        <h3>{{item.user.username||'匿名'}}</h3>
        <time>{{formatDate(item.createdAt)}}</time>    
        <p>{{item.comment}}</p>    
      </div>
    </li>    
  </ul>  
  <div class="over" v-show="over">已加载全部评论~</div>
  </div>
  <div v-else>
    <div class="emptylist"></div>
    <p>竟然还没有人来评论~</p>
  </div>
  <div class="loading" v-show="loading">加载中<i class="icon-loading"></i></div>
  
</div>
</template>
<script>
import moment from 'moment';
moment.locale('zh-cn');

export default {
  name: 'commentlist',
  data(){
    return {
      page: 1,
      loading: false,
      over: false
    }
  },
  watch:{    
    story(){
      this.page = 1;
      this.$store.dispatch('loadComments', {pos:this.$route.params.pos, page: this.page});
    }
  },
  computed:{
    story(){
      return this.$store.state.story;
    },
    comments(){
      return this.$store.state.comments;
    }
  },
  mounted(){
    window.scroll(0,1);
  },
  methods:{
    getAvatar(username){
      var n = 0;
      if(/\d+/.exec(username) != null)
        n = /\d+/.exec(username)[0]
      return '/static/avatar/'+(n % 32)+'.jpg';
    },
    formatDate(date){
      return moment(date).startOf('minite').fromNow();
    },
    loadMore() {      
      this.loading = true;
      this.$store.dispatch('loadComments', {pos:this.$route.params.pos, page: this.page+1, cb: (data)=>{
        this.page++;        
        this.loading = false;
        if(data.length < 15){
          this.over = true;
        }
      }});      
    }
  }
}
</script>
<style lang="scss">
.commentlist{
  li{
    padding: 15px;
    overflow: hidden;
    border-bottom: 1px solid transparent;    
  }
  .aside{
    float: left;
    width: 1.5rem;
    img{
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      box-shadow: 0 0 2px #ddd;
    }
  }
  .desc{
    float: left;
    width: 7.5rem;
    text-align: left;
    h3{
      color: #333333;
      font-size: .37rem;
      margin: 3px 0;
    }
    time{
      color: #999999;
      font-size: 0.32rem;
    }
    p{
      text-align: justify;
      color: #666666;
      font-size: .34rem;
      margin-top: 10px;
      line-height: .5rem;
    }
  } 
}
.emptylist{    
    background-size: 3.2rem 3.8rem;
    margin-top: 40px;
    margin-bottom: 20px;
    height: 3.8rem;
    background-repeat: no-repeat;
    background-position: 60% center;   
  }
.loading{
  background: transparent;
  height: 1.5rem;
  line-height: 1.5rem;
  text-align: center;
  color: #999999;
  .icon-loading{
    display: inline-block;
    width: 30px;
    height: 10px;
    margin: 0 10px;
    background: url(../assets/loading.png) no-repeat  0 0;
    background-size: 100%;
  }
}
.over{
  line-height: 1.5rem;
  text-align: center;
  color: #F54343;
  font-size: .35rem;
}
</style>
