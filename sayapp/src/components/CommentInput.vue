<template>
<div>
  <div class="comment-form" :class="{show:isshow}">
    <div class="form">
      <h3>写评论</h3>
      <textarea  cols="30" rows="5" maxlength="120" placeholder="请输入评论内容" v-model="message" ref="input"></textarea>
      <button type="button" @click="handleSubmit()">发表</button>
    </div>
    <div class="overlay" @click="hideInput()"></div>    
  </div>
  <div class="comment-tip" v-if="success">
      <p class="icon"><i class="icon-comment"></i></p>
      <p>评论发表成功!</p>  
    </div>
</div>
</template>
<script>
import { Toast } from 'mint-ui';

export default {
  props: ['isshow'],
  data(){
    return {    
      message: '',
      success: false,
    }
  } ,
  // watch: {
  //   isshow: function(v, ov){
  //     if(v) setTimeout(()=>{
  //       this.$refs.input.focus();   //
  //     },1000)
  //   }
  // },
  methods: {
    hideInput() {
      this.$emit('hide');
    },
    handleSubmit() {      

      if(this.message.replace(/(^\s*)|(\s*$)/g, "").length < 1) {  //去处空格
        Toast('你还没有输入评论内容哦')
        return false;
      }
      this.$store.dispatch('newComment', { obj:{
        bid: this.$route.params.bid, 
        cid: this.$route.params.cid, 
        position: this.$route.params.pos,
        topic: this.$store.state.story[this.$route.params.pos].say,
        comment: this.message
      }, cb: () => {
          //评论发布成功
         this.$emit('hide');
         this.message = '';
         setTimeout( () => {
           this.success = false;
         }, 2500)
         this.success = true;
         
      }});      
    }
  }
}
</script>
<style lang="scss">
.comment-form{
  &.show{
    transform: translateY(0);
  }
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  transform: translateY(110vh);
  transition: all .2s ease-in;
  .overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background: rgba(51, 51, 51, .4);
    z-index: -1;
  }
  .form{
    background: #fff;
    padding: 15px;
    overflow: hidden;
    h3{
      color: #333;
      font-size: .4rem;
      text-align: left;
      margin-bottom: 15px;
    }
    button{
      margin-top: 10px;
      border: 0;
      background: #70C6EC;
      border-radius: 5px;
      font-size: .4rem;
      color: #FFFFFF;
      float: right;
      width: 2.4rem;
      height: .8rem;
    }
    textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #999999;
      box-sizing: border-box;
      color: #666;
      font-size: .35rem;
      border-radius: 0;
    }
  }  
}
.comment-tip{
  position: fixed;
  z-index: 101;
  width: 3.6rem;
  height: 2.6rem;
  border-radius: 3px;
  top: 50%;
  left: 50%;
  margin-left: -1.8rem;
  margin-top: -1.3rem;  
  text-align: center;
  .icon{    
    margin: 15px 0;
  }
  .icon-comment{
    display: inline-block;
    width: 0.8rem;
    height: .8rem;
  }
  p{     
     font-size: 0.32rem;
     text-align: center;
  }
}
</style>
