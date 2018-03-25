var Book = require('../Model/Book');
var Chapter = require('../Model/Chapter');

function Controller() {
  
}
Controller.prototype = {  
  /**
   * 创建一本新书  并自动添加一个新的章节
   */
  create: function(req, res) {     
    var cid =  "id"+(+new Date());
    var newbook = new Book({
      uid: req.signedCookies.uid,
      bookname: req.body.bookname||'',
      author: req.body.author||'',
      keyword: req.body.keyword||'',
      description: req.body.description||'',
      catalog:[cid]
    })
    
    newbook.save(function(err, book){
      if(err) throw err;
      var chapter = new Chapter({
        bid: book._id,
        cid: cid,
      })
      chapter.save(function(err, cha){
        if(err) throw err;
        book['catalog'] = cha
        console.log(book);
        res.json({code: 200, message: book})  
      })
      
    })    
  },
  /**
   * 列出自己书籍 如果输入了搜索 则按照搜索查询
   */
  list: function(req, res){
    var query = {uid: req.signedCookies.uid};
    if(req.query.search)
      query['bookname'] = new RegExp(req.query.search)
    Book.find(query).exec(function(err, lists){
      if(err) throw err;
      res.json({code: 200, message: lists});
    })
  },
  /**
   * 更新书籍简介
   */
  update: function(req, res){
    Book.findOneAndUpdate({_id: req.params.bid}, req.body,{new: true}, function(err, book){
      res.json({code: 200, message: book});
    })
  },
  /**
   * 单本书上下架
   */
  online: function(req, res){
    Book.findOneAndUpdate({_id: req.params.bid}, {status: req.body.online?10:0},{new: true}, function(err, book){
      if(err)
        res.json({code: 100, message: "操作异常"})
      else
        res.json({code: 200, message: book});
    })
  },
  /**
   * 查询单本
   */
  one: function(req, res){
    Book.findOne({_id: req.params.bid}).exec(function(err, book){ //查询章节列表
      if(err) throw err;      
      
      
      Chapter.find({bid: req.params.bid, cid: {$in: book.catalog}},'_id bid cid title main status').exec(function(err, chapters){
        if(err) throw err;
        book.catalog = chapters;
        res.json({code: 200, message: book})        
      })
      //book.catalog  //each
      
    })    
  },  
  /**
   * 不用登陆 
   * 显示已经上线的章节 10
   */
  find: function(req, res){
    Book.findOne({_id: req.params.bid},'_id bookname author keyword description catalog cover').exec(function(err, book){
      if(err) throw err;
      Chapter.find({bid: req.params.bid, cid: {$in: book.catalog}, status: 5}, 'bid cid title main status', function(err, chapters){
        if(err) throw err;
        book['catalog'] = chapters;
        res.json({code: 200, message: book})      
      })      
    })
  },  
  /**
   * 隐藏书籍
   */
  remove: function(req, res){
    Book.findOneAndUpdate({uid: req.signedCookies.uid,_id: req.params.bid},{
      archive: true
    }).exec(function(err, book){
      if(err) throw err;
      Book.find({uid: req.signedCookies.uid, archive: false}).exec(function(err, lists){
        if(err) throw err;
        res.json({code: 200, message: lists});
      })      
    })
  },  
  /**
   * 前插入章
   */
  insertBefore: function(req, res){
     Book.findOne({uid: req.signedCookies.uid, _id: req.params.bid}).exec(function(err, book){
      if(err) throw err;
      var i = book.catalog.indexOf(req.params.cid)
      var cid =  "id"+(+new Date());
      var chapter = new Chapter({
        bid: req.params.bid,
        cid: cid
      })

      chapter.save(function(err, newChapter){
        if(err) throw err;
        book.catalog.splice(i, 0, cid);
        Book.findOneAndUpdate({uid: req.signedCookies.uid, _id: req.params.bid}, {catalog: book.catalog}, function(err, newbook){})      
        res.json({code: 200, message: newChapter});
      })
    })
  },
  /**
   * 后插入章
   */
  insertAfter: function(req, res){
    Book.findOne({uid: req.signedCookies.uid, _id: req.params.bid}).exec(function(err, book){
      if(err) throw err;
      var i = book.catalog.indexOf(req.params.cid)
      var cid =  "id"+(+new Date());
      var chapter = new Chapter({
        bid: req.params.bid,
        cid: cid
      })

      chapter.save(function(err, newChapter){
        if(err) throw err;
        book.catalog.push(cid);
        Book.findOneAndUpdate({uid: req.signedCookies.uid, _id: req.params.bid}, {catalog: book.catalog}, function(err, newbook){})      
        res.json({code: 200, message: newChapter});
      })
      
           
    })
  },
  /**
   * 删除章
   */
  deleteChapter: function(req, res){
    Book.findOne({uid: req.signedCookies.uid, _id: req.params.bid}).exec(function(err, book){
      if(err) throw err;
      var i = book.catalog.indexOf(req.params.cid)
      book.catalog.splice(i,1);
      Book.findOneAndUpdate({uid: req.signedCookies.uid, _id: req.params.bid}, {catalog: book.catalog}, function(err, newbook){
        res.json({code: 200});
      })      
    })
  }

}

module.exports = new Controller();