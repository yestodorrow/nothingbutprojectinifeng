<template>
  <div class="list">    
    <ul >
      <li v-for="(book,index) in books" :key="index">
        <a :href="getUrl(book)" >
          <div class="box">
            <div class="cover">          
              <img v-lazy="getCover(book)"/>
              <!-- <p><i class="icon-author"></i>{{book.author}} </p>   -->
              <!-- <small><i class="icon-hot"></i>{{book.hot}}</small> -->
              <h2>{{book.keyword.length>1?book.keyword:book.description}}</h2>            
              </div>         
          </div>
        </a>
      </li>
    </ul>   
  </div>  
</template>

<script>
import {mapState } from 'vuex'
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
  name: 'list',
  data() {
    return {
     
    }
  },   
  computed: mapState([
    'books'
  ]),
  methods:{
    getUrl(book){
      if(book.type == 'album'){
        return `/albums/${book._id}?channel=${this.$store.state.channel}`
      }else{
        return `/books/${book._id}?channel=${this.$store.state.channel}`
      }
    },
    getCover(book){  
        return `http://res.easyepub.net/${book.cover}`;
    },
    getQueryParam(){
      return {
        channel: this.$store.state.channel,
        //mode: getQueryString('mode')
      }
    }   
  },
  created(){
    this.$store.state.channel  = getQueryString('channel');        
    this.$store.dispatch('loadBooks', this.$route.params.id||0);    
  },
  mounted(){        
    document.getElementById('app').className = this.$store.state.theme;
    Logger.page('homepage', getQueryString('channel'), location.pathname);
  } 
}
</script>
<style lang="scss">
.list{
  font-size: .4rem;
}
.list ul{
  width: 10rem;
  padding: 8px 0;
  text-align: left;
  box-sizing: border-box;
}
.list li{
  position: relative;
  display: inline-block;  
  width: 5rem;
  padding: 0 4px 0 8px;
  margin-bottom: 8px;  
  box-sizing: border-box;
}
.list li:nth-of-type(2n){
  padding-right: 8px;
  padding-left: 4px;
}
.list .box{
  position: relative;
}
.cover{
  position: relative;
  height: 7.5rem;
}
.list li a{
  display: block;  
}
.list .album .cover{
  height: 1.6rem;
}
.list .album img{
  height: 1.6rem;
}
.list .album .box::after{
  display: none;
}
.cover img{  
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 7.5rem;
}
.cover > p{
  position: absolute;
  z-index: 11;
  left: 0;
  right: 0;
  top: 10px;
  line-height: 25px;
  font-size: .3rem;  
  text-align: left;
  text-indent: 10px;
}
.cover p small{
  float:right;
  margin-right: 10px;
}
.list h2{
    position: absolute;
    left: 0;    
    width: 100%;
    bottom: 0;
    text-align: left;
    font-size: .3rem;
    line-height: .35rem;
    padding: 10px;
    box-sizing: border-box;
    opacity: 0.9;
    overflow: hidden;    
}
</style>

