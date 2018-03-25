var Book = require('../Model/Book');
var Chapter = require('../Model/Chapter');

function Controller() {
  
}
Controller.prototype = {  
  /**
   * 按照状态以及分页
   */
  list: function(req, res){            
    var query = {};
    if(typeof req.query.search != 'undefined'){
      query['bookname'] = new RegExp(req.query.search)
      Book.find(query)
      .limit(20)
      .exec(function(err, lists){
        if(err) throw err;
        res.json({code: 200, message: lists});
      })
    }else{
      if(req.query.role == 3){   //待上线的
        query['status'] = 3;
      } else if(req.query.role == 2){  //待编辑
        query['status'] = 1;
      }      
        Chapter.distinct("bid", query).exec(function(err, books){  //查询已经待编辑书籍  
          Book.find({id: {$in: books}})
          .limit(20)
          .exec(function(err, lists){
            if(err) throw err;          
            res.json({code: 200, message: lists});
          })
        })        
    }
  },
  /**
   * search
   */
  search: function(req, res){            
    var query = {};     
    if(req.query.search)
      query['bookname'] = new RegExp(req.query.search)
    Book.find(query).exec(function(err, lists){
      if(err) throw err;
      res.json({code: 200, message: lists});
    })
  },
  /**
   * 更新单本书上下架
   */
  online: function(req, res){
    Book.findOneAndUpdate({_id: req.params.bid}, {status: req.body.online?10:0},{new: true}, function(err, book){
      if(err)
        res.json({code: 100, message: "操作异常"})
      else
        res.json({code: 200, message: book});
    })
  }

}

module.exports = new Controller();