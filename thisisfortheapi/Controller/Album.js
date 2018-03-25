var Album = require('../Model/Album');
var Book = require('../Model/Book');

function Controller() {}

Controller.prototype = {  
  /**
   * 查询一个合集列表
   */
  find: function(req, res){
    Album.findOne({_id: req.params.aid}).exec(function(err, album){
      if(err) throw err;
      Book.find({_id: {$in: album.books}}, '_id bookname author keyword cover').exec(function(err, books){
        album['books'] = books
        res.json({code: 200, message: album})
      })      
    })
  }, 
  /**
   * list album
   */
  list: function(req, res){
    Album.find({}).exec(function(err, albums){
      if(err) throw err;
      res.json({code: 200, message: albums})
    })
  },
  /**
   * create album
   */
  create: function(req, res){ 
    new Album({
      title: req.body.title,      
    }).save(function(err, Album){
      if(err) throw err;      
      res.json({code: 200, message: Album})
    })

  },
  /**
   * update album
   */
  update: function(req, res) {
    Album.findOneAndUpdate({_id: req.body.aid}, {books: req.body.books}, {new: true}, function(err, album){
      res.json({code: 200, message: album});
    })
  },
  
}

module.exports = new Controller();