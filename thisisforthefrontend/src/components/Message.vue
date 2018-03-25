<template>
  <li class="other" v-if="item.actor === '旁白'" >
    <div class="message"  v-if="isImg()">  
      <img class="preview-img" src="../assets/loading.gif" @click.stop="preview">
      <div v-if="!forcomment">
        <div class="comments" @click.stop="toComment()"  ><span >{{showCount()}}</span></div>
      </div>
    </div>
    <div class="message" @click.stop="!forcomment && toComment()" v-else>{{item.say}}
      <div v-if="!forcomment">
        <div class="comments" v-show="showCount()>0" @click.stop="toComment()"><span >{{showCount()}}</span>
        </div>
      </div>
    </div>    
  </li>
  <li class="item " :class="{main: isMain()}" v-else>  
    <div class="avatar" ><img :src="getAvatar()" ></div>  
    <div class="message" v-if="!isImg()">
      <h5>{{item.actor}}</h5>
      <section @click.stop="!forcomment && toComment()"><p>{{item.say}}</p></section>
      <div v-if="!forcomment">
        <div class="comments" v-show="showCount()>0" @click.stop="toComment()"><span >{{showCount()}}</span></div>
      </div>
    </div>
    <div class="message" v-else>
      <h5>{{item.actor}}</h5>      
      <img class="preview-img" src="../assets/loading.gif" @click.stop="preview">      
      <div v-if="!forcomment">
        <div class="comments" @click.stop="toComment()" ><span >{{showCount()}}</span></div>
      </div>
    </div>        
  </li>
</template>

<script>
var storage = localStorage?localStorage:sessionStorage;  //android 客户端老版本 不支持local存储  ios支持

export default {
  name: 'message',
  props:[
    'item',
    'index',
    'forcomment' //不可点击
  ],
  methods: {
    getAvatar(){
      return `http://res.easyepub.net/avatar/${this.$store.state.book._id}/${this.item.actor}.jpg`
    },
    isMain(){
      return this.item.actor == this.$store.state.chapter.main;
    },
    isImg(){
      return /^!\[(.*)\]\((.*)\)/.test(this.item.say)
    },
    toComment(){
      storage.setItem('scrolltop', document.body.scrollTop||document.documentElement.scrollTop)
      window.location = `/comments/${this.$store.state.book._id}/${this.$store.state.chapter.cid}/${this.index}?channel=${this.$store.state.channel}`
      //this.$router.push({name: 'comment', params: { bid : this.$store.state.chapter.bid, cid: this.$store.state.chapter.cid, pos: this.index}})      
    },
    showCount(){
      return this.$store.state.counts[this.index]>99?99:this.$store.state.counts[this.index]||0;  //显示0-99 
    },
    preview(event){      
      //var img = event.target.parentNode.parentNode.querySelector('.preview-img');      
      var img = event.target;
      this.$preview.open(0, [{src:img.src, w: img.width*2,h: img.height*2}], {
        captionEl: false,
        fullscreenEl: false,
        history: false,
        shareEl: false,
        tapToClose: true,
        maxSpreadZoom: 3,
        getThumbBoundsFn: function(){
          let thumbnail = img
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          let rect = thumbnail.getBoundingClientRect()
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
        }
      })
    }
    // format(msg){    
    //   var self = this;
    //   var url = /^!\[(.*)\]\((.*)\)/.exec(msg)[2];
      
    // }   
  },
  //评论页面的消息初始状态是空，需要进行一次更新
  updated: function(){
    if(/^!\[(.*)\]\((.*)\)/.test(this.item.say)){
      //image load
      var self = this;
      var url = /^!\[(.*)\]\((.*)\)/.exec(this.item.say)[2];      
      var img = new Image();
      img.src = url;
      img.onload = function(){        
        var dom = self.$el.querySelector('.preview-img')
        dom.src = url;
        dom.setAttribute('width', img.naturalWidth);
        dom.setAttribute('height', img.naturalHeight);
      }
    }
  },
  created: function(){
    if(/^!\[(.*)\]\((.*)\)/.test(this.item.say)){
      //image load
      var self = this;
      var url = /^!\[(.*)\]\((.*)\)/.exec(this.item.say)[2];      
      var img = new Image();
      img.src = url;
      img.onload = function(){        
        var dom = self.$el.querySelector('.preview-img')
        dom.src = url;
        dom.setAttribute('width', img.naturalWidth);
        dom.setAttribute('height', img.naturalHeight);
        var top = document.querySelector('.content').offsetHeight;
        window.scroll(0, top); 
      }
    }
  },
  mounted: function(){    
    // if(document.querySelector('.content') != null) {
    //   var top = document.querySelector('.content').offsetHeight;   
    //   console.log('0');     
    //   window.scroll(0, top);
    // }    
  }
}
</script>

<style lang="scss">
.item{
  display: flex;
  text-align: left;
  margin-bottom: 20px;
}
.preview {
    position: absolute;
    width: 0.6rem;
    height: 0.6rem;
    line-height: .6rem;
    margin-left: -0.4rem;
    border: 3px solid #F3F3F3;
    left: 0;
    bottom: -0.4rem;
    border-radius: 50%;
    background: #fff;
    text-align: center;    
  }
  .comments {
    position: absolute;
    width: 0.6rem;
    height: 0.6rem;
    line-height: .6rem;
    margin-right: -0.4rem;
    border: 3px solid transparent;
    right: 0;
    bottom: -0.4rem;
    border-radius: 50%;    
    text-align: center;    
    span{
      font-size: 0.32rem;      
    }
  }
.other {
  position: relative;
  text-align: center;
  margin: 20px 1.3rem;
  .message {
    display: inline-block;
    background: #E3E3E3;
    padding: .32rem .4rem;    
    border-radius: 5px;   
    font-size: 0.35rem;
    text-align: justify;
    margin-left: 0;
  }
  img {
    max-width: 100%;
  }
}
.message {
  position: relative;
  margin-left: 10px;
  max-width: 7rem;
  line-height: .45rem;
  h5 {
    color: #999;
    margin-bottom: 3px;
    font-size: .3rem;
    line-height: .35rem;
  }
  img {
    max-width: 200px;
    height: auto;
  }
  section {
    position: relative;
    p {
      color: #fff;
      font-size: .38rem;
      line-height: .55rem;
      word-break: break-all;
      text-align: justify;
    }
  }
 
}
.avatar{
  flex: none;
  width: 1rem;
  height: 1rem;  
  margin-top: 3px;
  img {
     width: 1rem;
    height: 1rem;  
    border-radius: 50%;
  }
}
.main {
  justify-content: flex-end;
  .avatar {
    order: 2;
  }
  .message {
    order: 1;
    margin:0;
    margin-right: 10px;
    h5 {
      text-align: right;  
    }
  }
  .preview{
    right: 0;
    left: auto;
    margin-right: -0.4rem;
  }
  .comments{
    left: 0;
    right: auto;
    margin-left: -0.4rem;
  }
}
.icon-preview {
    display: inline-block;
    width: 0.3rem;
    height: 0.3rem;
    background-size: contain !important;
    margin-top: .15rem;
}
</style>
