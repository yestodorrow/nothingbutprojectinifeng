var Area = require('../Model/Area');
var Album = require('../Model/Album');
var Book = require('../Model/Book');

function Controller() {}

Controller.prototype = {  
  /**
   * 查询一个运营页面
   */
  list: function(req, res){
    var arr = []
    /**
     * {
      "id": "59f150beea0f9d681f05884d",
      "title": "鹿晗合集",
      "type": "album",
      "cover": "album/59f150beea0f9d681f05884d.jpg"
    },{
      "id": "59f150f8ea0f9d681f05884e",
      "title": "万圣节合集",
      "type": "album",
      "cover": "album/59f150f8ea0f9d681f05884e.jpg"
    }
    
     */    
    // Album.findOne({bid: req.params.bid, cid: req.params.cid}).exec(function(err, chapter){
    //   if(err) throw err;
    //   res.json({code: 200, message: chapter?chapter.text:''})
    // })
    Book.find({status: 10, category: req.query.category}, '_id bookname author keyword cover description')
      .sort({updatedAt: -1})
      .exec(function(err, books){
        if(err) throw err;       
        res.json({code: 200, message: books})
      })
  }, 
  /**
   * 创建运营页面
   */
  /**
   * 所有运营区域
   */
  /**
   * 更新运营区域
   */
  update: function(req, res){
   
  }
}

module.exports = new Controller();