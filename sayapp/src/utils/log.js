function getCookie(sKey) {
  if (!sKey) { return ""; }
  return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}
//日志记录
// export default function log(start, end, percent, bookid, channel){
//   //http:///1.jpg?starttime=121253&endtime=12123&readtime=123123&per=70&ssid=12312&bookid=1312&type=2312    
//   new Image().src = `http://uplog.yc.ifeng.com/1.jpg?starttime=${start}&endtime=${end}&per=${percent}&bookid=${bookid}&channelid=${channel}`
// }
const BASE = 'http://uplog.yc.ifeng.com/1.jpg'
export default {
  //albumpage  bookpage   commentpage  sharepage homepage
  page(action, cid , path, pos, bid, sid){
    new Image().src = `${BASE}?action=${action}&cid=${cid}&page=${path}&pos=${pos}&bid=${bid}&sid=${sid}`
  },
  view(per, bid, sid, cid, pos){
    new Image().src = `${BASE}?action=view&per=${per}&bid=${bid}&sid=${sid}&cid=${cid}&pos=${pos}`
  },
  call(bid, sid, cid, os){
    new Image().src = `${BASE}?action=call&bid=${bid}&sid=${sid}&cid=${cid}&os=${os}`
  },
  share(bid, sid, cid, from, to){
    new Image().src = `${BASE}?action=share&bid=${bid}&sid=${sid}&cid=${cid}&from=${from}&to=${to}`
  }
}

//logger.log('page', 'cid page pos', ...params)