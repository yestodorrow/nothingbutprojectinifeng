<template>
<div>
  <div class="catalog" :class="{open: show}" >
    <!-- <div class="book-detail">
      <h2>{{book.bookname}}</h2>
      <h3>作者：{{book.author}}</h3>
      <hr/>      
    </div> -->
    <ul>
        <li v-for="(item, index) in chapters" :key="index" :class="{current: item.cid == chapter.cid}" >              
          <a @click="clickHandle(item)">{{item.title}}</a>     
        </li>
      </ul>     
  </div>
  <div class="close" @click="closeHandle()"></div>
</div>
</template>

<script>
export default {
  name: 'cover', 
  props: ['src'],
  data() {
    return {    
    }
  },
  computed:{
    show(){
      return this.$store.state.isshow
    },
    book(){
      return this.$store.state.book
    },
    chapter(){
      return this.$store.state.chapter
    },
    chapters(){
      return this.$store.state.book.catalog
    }
  },
  mounted(){   
  },
  methods:{   
    closeHandle(){
      this.$store.state.isshow = false;
    },
    clickHandle(chapter) {      
      this.$store.state.isshow = false;
      if(this.$store.state.chapter.cid  != chapter.cid)
        this.$store.dispatch('openChapter', chapter);      
    },    
  }
}
</script>

<style lang="scss">
.catalog{
  position: fixed;
  width: 75%;  
  height: 100vh;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;  
  transition: all .3s 0s ease-out;
  transform: translate3d(-100%,0,0);
}
.catalog.open{  
  transform: translate3d(0,0,0);
  &+.close{
    display: block;
  }
}
.bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 10;  
  background-color: #000;
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center center;
}
@-webkit-keyframes turn {
  form{
    transform: translate3d(0,10px,0)
  }
  to{
    transform: translate3d(0,-10px,0)
  }
}
.book-detail{
  position: relative;  
  padding: 15px 0;
}
.book-detail h2{
  font-size: .6rem;
  color: #333;
}
.book-detail h3{
  font-size: .35rem;
  color: #999;
  margin-top: 10px;
}
.book-detail hr{
  height: 0;
  border: 0;
  border-bottom: 1px solid #ccc;
}
.catalog ul{
  height: 100vh;
  overflow: auto;
}
.catalog ul li{
  line-height: 1.3rem;
  font-size: .4rem;
  text-align: left;
  margin: 0 0 0 15px;
  box-sizing: border-box;
  border-bottom: 1px solid transparent; 
}
.catalog ul li.current a{  
  color: #F64344;
}
.catalog ul li a{
  display: block;
  text-indent: 10px;
}
.close{
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  bottom: 0;
  z-index: 99;
  background: rgba(0,0,0,0.7)
}
</style>
