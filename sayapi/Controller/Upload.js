var qiniu = require('../utils/upload');
var path = require('path');

function Controller() {
  
}
Controller.prototype = {
  /**
   *
  { fieldname: 'bookcover',
  originalname: 'WechatIMG11.jpeg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'some/path',
  filename: '19a9afe03e3de27d30b8b0d2fa327b38',
  path: 'some/path/19a9afe03e3de27d30b8b0d2fa327b38',
  size: 124867 }
   */
  cover: function(req, res){
    if(req.file.mimetype == 'image/jpeg'){
      qiniu.upload('cover/'+req.file.filename+'.jpg', req.file.path, function(err, ret){
        if(!err){
          res.json({code: 200, message: 'cover/'+req.file.filename+'.jpg'})
        }
      });
    }    
  },
  avatar: function(req, res){
   if(req.file.mimetype == 'image/jpeg'){
     var path = `avatar/${req.body.bookid}/${req.body.name}.jpg`;
      qiniu.upload(path, req.file.path, function(err, ret){
        if(!err){
          res.json({code: 200, message: {name: req.body.name, url: path+"?t="+(+new Date())}})
        }
      });
    }    
  },
  album: function(req, res){
   if(req.file.mimetype == 'image/jpeg'){
     var path = `album/${req.body.albumid}.jpg`;
      qiniu.upload(path, req.file.path, function(err, ret){
        if(!err){
          res.json({code: 200, message: {url: path+"?t="+(+new Date())}})
        }
      });
    }    
  },
  content: function(req, res){
    if(req.file.mimetype == 'image/jpeg'){
      var path = `content/${req.file.filename}.jpg`;
       qiniu.upload(path, req.file.path, function(err, ret){
         if(!err){
           res.json({code: 200, message: path})
         }
       });
     }    
   }
}

module.exports = new Controller();