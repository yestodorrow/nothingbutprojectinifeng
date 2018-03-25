var User = require('../Model/User');
var jws = require('jws');
var crypto = require('crypto');
var mail = require('../utils/mail');

function hash(txt){
  var secret = 'quicksay';
  return crypto.createHmac('sha256', secret).update(txt).digest('hex')
}
function Controller() {
  
}
Controller.prototype = {  
  /**
   * check login
   */
  login: function(req, res) {     
    if(req.body.username.length < 3 || req.body.password.length < 3){
      res.json({code: 104, message:'用户名密码不正确'})
      return false;
    }
    User.findOne({username: req.body.username},'_id username nickname role password enabled').exec(function(err, user){
      if(err) throw err;
      if(user == null){
        res.json({code: 103, message: '用户名不存在'});
        return false;
      }   
      if(!user.enabled){
        res.json({code: 106, message: '账号还没有激活,请登录邮箱完成激活。'})
        return false;
      }
      if(hash(req.body.password) !== user.password) {
        res.json({code: 105, message: '用户密码错误'});
        return false;
      }else{
        //create token 
        const signature = jws.sign({
          header: { alg: 'HS256' },
          payload: {
            _id: user._id,
            username: user.username,
            role: user.role,
            expires: new Date(Date.now() + 1000*60*60*24*7)
          },
          secret: 'goodluck',
        });

        user['password'] = null;

        res.cookie('ticket',signature, {path:'/', expires: new Date(Date.now() + 1000*60*60*24*7), httpOnly: true });
        res.cookie('uid',user._id, {path:'/', expires: new Date(Date.now() + 1000*60*60*24*7), httpOnly: true , signed: true});
        res.json({code:200, message: user});
      }
    })
  },
  /**
   * list user
   */
  list: function(req, res){
    User.find({},'_id username nickname role enabled').exec(function(err, users){
      if(err) throw err;
      res.json({code: 200, message: users})
    })
  },
  /**
   * create user
   */
  create: function(req, res){ 
    new User({
      username: req.body.username,
      role: req.body.role||1,
      password: hash(req.body.password),  //TODO  hex + salt 
      nickname: req.body.nickname||'笔名'
    }).save(function(err, user){
      if(err) throw err;      
      //send mail
      mail.send(user); //通知用户激活账号
      res.json({code: 200, message: user})
    })
  },
  /**
   * update user
   */
  update: function(req, res) {
    User.findOneAndUpdate({_id: req.body._id}, {role: +req.body.role, enabled: req.body.enabled}, {new: true, select: '_id role username nickname enabled'}, function(err, user){
      if(err)
        res.json({code: 110, message: '修改失败'});  
      else
        res.json({code: 200, message: user});
    })
  },
  /**
   * modify password
   */
  change: function(req, res){
    User.findOneAndUpdate({_id: req.signedCookies.uid}, {nickname: req.body.nickname }, {new: true, select: '_id role username nickname'}, function(err, user){
      res.json({code: 200, message: user});
    })
  },
   /**
    * modify profile
    */
  password: function(req, res){
    User.findOne({_id: req.signedCookies.uid}).exec(function(err, user){
      if(err) throw err;      
      if(hash(req.body.curpwd) !== user.password) {
        res.json({code: 109, message: '密码修改失败，当前密码输入错误！'});
        return false;
      }else{
        User.findOneAndUpdate({_id: req.signedCookies.uid}, {password: hash(req.body.newpwd)}, {new: true, select: '_id role username nickname'}, function(err, user){
          res.json({code: 200, message: user});
        })
      }
    })    
  },
  /**
   * 激活账号
   */
  active: function(req, res) {
    User.findOne({_id: req.params.uid}).exec(function(err, user){
      if(err) {
        res.json({code: 200, message: 0});
      }else{
        User.findOneAndUpdate({_id: req.params.uid}, {enabled: true}, {new: true, select: '_id username role nickname'}, function(err, user){
          if(err) throw err;
          res.json({code: 200, message: 1});
        })
      }      
    }) 
  },
  /**
   * check user mail exist  @todo  use exists 方法检查
   */
  exist: function(req, res){
    User.find({username: req.body.mail}).count().exec(function(err, users){
      if(err) throw err;
      res.json({code: 200, message: users})
    })
  }
  
}
module.exports = new Controller();