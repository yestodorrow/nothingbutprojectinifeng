var Book = require('../Model/Book');
var Chapter = require('../Model/Chapter');
var fs = require('fs');


function Controller() {
  
}
Controller.prototype = {  
  /**
   * 返回单本书所有章节
   */
  all: function(req, res){
    Book.findById(req.params.bid).exec(function(err, book){
      Chapter.find({bid: req.params.bid, cid:{$in: book.catalog}}, '_id bid cid status title main')
      .exec(function(err, chapters){
        if(err) throw err;
        res.json({code: 200, message: chapters})
      })
    })    
  },
  /**
   * 查询单章节内容
   */
  find: function(req, res){
    Chapter.findOne({bid: req.params.bid, cid: req.params.cid}).exec(function(err, chapter){
      if(err) throw err;
      res.json({code: 200, message: chapter})
    })
  },  
  /**
   * 供前端app数据接口调用
   * 只能查看上线章节
   */
  findAndBuild: function(req, res){
    Chapter.findOne({bid: req.params.bid, cid: req.params.cid, status: 5}, '_id bid cid text status title main comments').exec(function(err, chapter){
      if(err) throw err;
      var source = chapter.text.split("\n")
      var story = [];
      
      source.forEach(function(item, idx){ 
        if(item.length<2) return ; 
        var msg = item.split('：');
        if(msg.length<2) return ;
        story.push({ "actor": msg[0], "say": msg[1]})        
      })
      res.json({code: 200, message: {story:story,chapter: chapter, counts: chapter.comments}})    
    })
  }, 
  /**
   * 自动保存章节内容
   */
  autosave: function(req, res){
    Chapter.findOneAndUpdate({bid: req.params.bid, cid: req.params.cid}, 
    {$set: {text: req.body.content}},
    {new: true, upsert: true}
    ).exec(function(err, chapter){
      if(err) throw err;
      res.json({code: 200, message: 'auto save success'})
    })
  },
  /**
   * 更换章节名称
   */
  update: function(req, res){
    var updater = {};
    if(req.body.title)
      updater['title'] = req.body.title;
    if(req.body.main)
      updater['main'] = req.body.main;
    if(req.body.status)
      updater['status'] = req.body.status;

    Chapter.findOneAndUpdate({bid: req.params.bid, cid: req.params.cid}, updater).exec(function(err, chapter){
      if(err) throw err;
      res.json({code: 200});      
    })
  },

}

module.exports = new Controller();