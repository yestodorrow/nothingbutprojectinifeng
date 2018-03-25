var Chapter = require('../Model/Chapter');
var Comment = require('../Model/Comment');
var request = require('request');

function Controller() {
  
}
const PAGESIZE = 15;
Controller.prototype = {   
  /**
   * 评论概要
   */
  find: function(req, res){    
    if(isNaN(parseInt(req.params.pos))){    
      res.json({code: 100, message: '参数错误'})
      return false;
    }
    Chapter.findOne({bid: req.params.bid, cid: req.params.cid, status: 5}).exec(function(err, chapter){
      if(err) throw err;
      var source = chapter.text.split("\n")
      var story = [];
      source.forEach(function(item, idx){ 
        if(item.length<2) return ; 
        var msg = item.split('：');
        if(msg.length<2) return ;
        story.push({ "actor": msg[0], "say": msg[1]})
      })
      //返回评论数 以及评论点
      Comment.count({bid: req.params.bid, cid: req.params.cid, position: req.params.pos }).exec(function(err, rows){
        if(err) throw err;
        res.json({code: 200, message: {total: rows, current: story[req.params.pos], pos: +req.params.pos}})
      })      
    })
  },
  /**
   * 评论概要
   */
  list: function(req, res){    
    if(isNaN(parseInt(req.params.pos))){    
      res.json({code: 100, message: '参数错误'})
      return false;
    }
    let offset = (req.query.page-1)|| 0;
    Comment.find({bid: req.params.bid, cid: req.params.cid, position: req.params.pos})
    .sort('-createdAt')
    .skip(offset * PAGESIZE)
    .limit(PAGESIZE)
    .exec(function(err, comments){
      if(err) throw err;
      res.json({code: 200, message: comments})
    })
    
  },   
  /**
   * 发表评论
   */
  create: function(req, res){
    var comment = new Comment({
      bid: req.body.bid, 
      cid: req.body.cid, 
      position: req.body.position,
      topic: req.body.topic,
      user: {},
      comment: req.body.comment
    })

    var serverApi = 'http://androidapi4.yc.ifeng.com'
    if(process.env.NODE_ENV != 'production')
      serverApi = 'http://118.190.88.122:8881'
    
    request.post({url: `${serverApi}/api/duihua/sensitiveWord`, form: {word: req.body.comment}}, function(err, response, body){
      if(err) res.send({code: 100, message: '服务异常，请稍后重试'})
      var word = JSON.parse(body);
      console.log('--------- comment start ---------')
      console.log(req.body.comment, word);
      if(word.code == 100) {
        //http request userid     //||'7dfb5acb138b4dbd87a0cb349fba03ce'
        request.post({url:`${serverApi}/api/duihua/getUserId`, form: {token: req.cookies.sessionid}}, function(err, response, body){ 
          var session = JSON.parse(body);
          console.log(session);
          if(session.code == 100){            
              //request userinfo  //||'82777827'
              request.post({url: `${serverApi}/api/duihua/getUserInfo`, form : {sourceid : session.data.userProfileInfo.userId}}, function(err, response, body){
                var user = JSON.parse(body);
                console.log(user)
                if(user.code == 100){
                  //body.data.userProfileInfo  
                  comment['user'] = user.data.userProfileInfo ;
                  //保存评论
                  comment.save(function(err, comment){
                    if(err) throw err;
                    Comment.count({bid: req.body.bid, cid: req.body.cid, position: req.body.position }).exec(function(err, rows){
                      if(err) throw err; 
                      res.json({code: 200, message: {total: rows, comment: comment}}); 

                      //update notifation chapter  count
                      Chapter.findOne({bid: req.body.bid, cid: req.body.cid}).exec(function(err, chapter){
                        if(err) throw err;           
                        chapter.comments[req.body.position] = rows;
                        Chapter.findOneAndUpdate({bid: req.body.bid, cid: req.body.cid}, {'comments': chapter.comments}).exec(function(err, chapter){
                          if(err) throw err;           
                        })
                      })
                      
                    })          
                  })  


                }else{
                  res.send({code: 105, message: '用户信息获取失败，请稍后重试'})
                }
              })    
          }else{
            res.send({code: 104, message: '未登录，请先登录翻阅客户端'})
          }
        })
      }else{
        res.send({code: 103, message: '请输入和谐的语言！'})
      }
    })  
  },

}

module.exports = new Controller();