// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import http from 'axios'
import 'es6-promise/auto'
import VueRouter from 'vue-router'
import VueCookie from 'vue-cookie'
import VueLazyload from 'vue-lazyload'
import VuePreview from 'vue-preview'
import { Toast, InfiniteScroll } from 'mint-ui';

import Book from './pages/Book'
import List from './pages/List'
import Album from './pages/Album'
import Share from './pages/Share'
import Comment from './pages/Comment'wz
 2+
 import "./themes/default/style.css"
import "./themes/halloween/style.css"
import "./themes/dark/style.css"
import 'mint-ui/lib/style.css'


Vue.config.productionTip = false
Vue.use(VueLazyload)
Vue.use(VueRouter)
Vue.use(VueCookie)
Vue.use(VuePreview)
Vue.use(Vuex)
Vue.use(InfiniteScroll);

var storage = localStorage?localStorage:sessionStorage;  //android 客户端老版本 不支持local存储  ios支持

http.defaults.timeout = 60000;
http.defaults.headers.post['Content-Type'] = 'Application/x-www-from-urlencoded;charset=UTF-8';
http.defaults.baseURL = process.env.NODE_ENV == 'production'?'http://jhapi.yc.ifeng.com':'/'; //http://jhapi.yc.ifeng.com
http.defaults.withCredentials = true;

function networkError(){
  Toast('网络无法访问请重试')
}

function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: List },
    { path: '/books', component: List },        
    { path: '/category/:id', component: List}, //分类
    { path: '/albums/:id', component: Album}, //合集
    { path: '/share/:bid', component: Share}, //分享
    { path: '/books/:bid', name: 'book',component: Book}, //正文 第一章
    { path: '/comments/:bid/:cid/:pos', name: 'comment', component: Comment} //正文
    // { path: '/books/:bid/story/:sid', name: 'book',component: Book} //正文
  ]
})
//index.html?book=1&channel=wap|android|ios|ifeng|1dian|tieba|weixin&
const store = new Vuex.Store({
  state: {    
    theme: storage.getItem('theme')||'default',
    isshow: false,
    channel: 'none',
    book: {},
    album: {},
    books:[],
    chapter: {},  //当前章
    counts: [],  //故事评论数
    story: {},  
    comment: {},   //当前评论条
    comments: []  //评论列表
  },
  getters: {   
  },
  mutations:{    
    OPENBOOK(state, data){
      state.book = data;  
      document.title = data.bookname;
    },
    ALLBOOKS(state, data){
      state.books = data;
    },   
    ALBUMS(state, data){
      state.album = data;    
    },
    CHANGETHEME(state, data){
      state.theme = data;    
    },
    OPENCHAPTER(state, data){
      state.story = data.story;
      state.counts = data.counts;
      state.chapter = data.chapter;
      storage.setItem(`${state.book._id}`, JSON.stringify(data.chapter));
    },    
    COMMENTS(state, data){
      if(data.page > 1){
        state.comments = state.comments.concat(data.list);        
      }else{
        state.comments = data.list;
      }      
    },
    NEWCOMMENT(state, data){
      state.comments.unshift(data.comment);
    }
  },
  actions: {
    openBook(context, bookid){
      //bookid = getQueryString('book');
      //var data = require('./data/'+bookid+'.json');
      http.get(`/data/books/${bookid}`).then((response) =>{
        context.commit('OPENBOOK', response.data.message)
      }, (err) => {
        networkError(err)
      })        
    },   
    loadBooks(context, type){      
      http.get(`/data/books?category=${type}`).then((response) => {
        context.commit('ALLBOOKS', response.data.message)
      }, (err) => {
        networkError(err)
      })  
    },
    loadAlbum(context, albumid){
      http.get(`/data/albums/${albumid}`).then((response) => {
        context.commit('ALBUMS', response.data.message)
      }, (err) => {
        networkError(err)
      })      
    },
    changeTheme(context, theme){
      context.commit('CHANGETHEME', theme);
      storage.setItem('theme', theme);
      document.getElementById('app').className = theme;
    },
    openChapter({commit, state}, chapter){
      http.get(`/data/books/${state.book._id}/chapters/${chapter.cid}`).then((response) => {
        commit('OPENCHAPTER', {story: response.data.message.story, chapter: response.data.message.chapter, counts: response.data.message.counts})
      }, (err) => {
        networkError(err)
      })
    },    
    loadComments({commit, state}, params){
      http.get(`/data/comments/${state.book._id}/${state.chapter.cid}/${params.pos}?page=${params.page}`).then((response) => {
        commit('COMMENTS', {list:response.data.message,page:params.page})
        if(params.cb)
          params.cb(response.data.message)
      }, (err) => {
        networkError(err)
      })
    },
    newComment(context, params) {
      http.post(`/data/comments/`, params.obj).then((response) => {            
        if(response.data.code == 200){
          context.commit('NEWCOMMENT', response.data.message)
          params.cb(response.data.message)
        }else {
          Toast(response.data.message)
        }
        
      }, (err) => {
        networkError(err)
      })
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store
})

