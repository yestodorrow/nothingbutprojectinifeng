<template>
  <div class="list">    
    <ul >
      <li v-for="(book,index) in books" :key="index">
        <a :href="url(book)" >
          <div class="box">
            <div class="cover">          
              <img :src=book.cover|imgUrl alt="" />
              <p>By:{{book.author}} </p>  
              <!-- <small><i class="icon-hot"></i>{{book.hot}}</small> -->
              <h2>{{book.keyword}}</h2>            
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>  
</template>

<script>
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
  computed:{
    books() {
      return this.$store.state.album.books;
    }
  },
  filters: {
		imgUrl: function(value) {     
			return `http://res.easyepub.net/${value}`;
		}
  },
  methods:{
    url(book){     
        return `/books/${book._id}?channel=${this.$store.state.channel}`      
    },
    getQueryParam(){
      return {
        channel: this.$store.state.channel,
        //mode: getQueryString('mode')
      }
    }
  },
  created(){
    //document.title = '鹿晗粉丝的疯狂的趣事'
    this.$store.dispatch('loadAlbum', this.$route.params.id)
    this.$store.state.channel  = getQueryString('channel');
  },
  mounted(){
    document.getElementById('app').className = this.$store.state.theme;
    Logger.page('albumpage', getQueryString('channel'), location.pathname);
  }
}
</script>
<style >
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
  border-radius: 5px;
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
  border-radius: 5px;
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
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    /* text-indent: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
}
</style>

