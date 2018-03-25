var express = require('express');
var path = require('path');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: "./uploads" })
var jws = require('jws');

var UserController = require('./Controller/User');
var BookController = require('./Controller/Book');
var ChapterController = require('./Controller/Chapter');
var UploadController = require('./Controller/Upload');
var AreaController = require('./Controller/Area');
var AlbumController = require('./Controller/Album');
var WeChatControll = require('./Controller/Wechat');
var CommentControll = require('./Controller/Comment');
//管理接口定义
var AdminBookController = require('./Controller/AdminBook');

//nologin user for app api
router.use('/data/*', function(req, res, next){
	next();
});

//filter  for user must be login
router.use('/api/*',function(req, res, next) {		
	if(typeof req.cookies.ticket != 'undefined'){
		//valid token is ok
		if(jws.verify(req.cookies.ticket, 'HS256', 'goodluck')){
			let data = jws.decode(req.cookies.ticket);
			let user = JSON.parse(data.payload) 
			if(user._id != req.signedCookies.uid)
				res.json({code: 103, message: '用户信息不匹配不能进行操作'})			
			else
				next();		
		}	else{
			res.json({code: 102, message: '登录token失效'});
		}
	}else{
		res.json({code: 101, message:'您还没有登录'});
	}
});


router.use('/admin/*',function(req, res, next) {		
	if(typeof req.cookies.ticket != 'undefined'){
		//valid token is ok
		if(jws.verify(req.cookies.ticket, 'HS256', 'goodluck')){
			let data = jws.decode(req.cookies.ticket);
			let user = JSON.parse(data.payload)
			if(typeof user.username != 'undefined' && user.role > 1){
				next();		
			}else{
				res.json({code: 401, message:'没有权限，请联系系统管理人员'})
			}			
		}	else{
			res.json({code: 102, message: '登录token失效，请重新登录'});
		}
	}else{
		res.json({code: 101, message:'您还没有登录'});
	}
});


/**
 * wechat
 */
router.get('/wechat/ticket', WeChatControll.ticket);
/**
 * 用户
 */
router.get('/api/users/me', function(req, res){
	let data = jws.decode(req.cookies.ticket);
	let user = JSON.parse(data.payload) 
	res.json({code:200, message: user})}
); //是否登录

router.post('/action/login', UserController.login); //登录
router.post('/action/userexist', UserController.exist); //用户名检查
router.post('/action/newuser', UserController.create); //用户名注册  增加session中的token防止 调用接口注册
router.get('/action/activate/:uid', UserController.active); //账户激活

//注册
//修改用户信息
router.get('/admin/users', UserController.list); //用户列表
router.patch('/admin/users', UserController.update); //更新用户角色和禁用用户
router.patch('/admin/users', UserController.change); //编辑用户
router.patch('/api/users/', UserController.change); //编辑用户
router.patch('/api/users/repwd', UserController.password); //编辑用户
// router.put('/admin/users', UserController.stop); //停用用户
/**
 * 书籍
 */
router.patch('/admin/books/:bid', AdminBookController.online) //书籍上下线
router.get('/admin/books?', AdminBookController.list) //按状态查询所有书籍
//router.get('/admin/books?', AdminBookController.search) //按状态查询所有书籍

router.get('/api/books?', BookController.list); //列出当前用户所有书籍
router.post('/api/books', BookController.create); //创建书籍
//router.post('/api/books/resolve', BookController.resolve); //导入word
router.get('/api/books/:bid', BookController.one); //打开某本书
router.patch('/api/books/:bid', BookController.update);  //修改书籍meta
router.delete('/api/books/:bid', BookController.remove); //归档书籍
//router.get('/api/books/:bid/export', BookController.build) //但本书导出
/**
 * 章节
 */
router.patch('/admin/books/:bid/chapters/:cid', ChapterController.update); //更新章节 需要有权限

router.get('/api/books/:bid/chapters', ChapterController.all) //返回本书所有章节
router.get('/api/books/:bid/chapters/:cid', ChapterController.find); //查找章节内容
router.patch('/api/books/:bid/chapters/:cid', ChapterController.update); //更新章节
router.patch('/api/books/:bid/chapters/:cid/before', BookController.insertBefore) //
router.patch('/api/books/:bid/chapters/:cid/after', BookController.insertAfter) //
router.delete('/api/books/:bid/chapters/:cid', BookController.deleteChapter)  //删除章节
router.patch('/api/books/:bid/chapters/:cid/content', ChapterController.autosave); //章节内容自动保存
/**
 * 上传
 */
router.route("/api/upload").post(upload.single("file"), UploadController.cover);  //上传书封
router.route("/api/uploadAvatar").post(upload.single("file"), UploadController.avatar);  //上传头像
router.route("/api/uploadAlbum").post(upload.single("file"), UploadController.album);  //上传合集封面
router.route("/api/uploadJpg").post(upload.single("file"), UploadController.content);  //上传内容中的图片

/**
 * 合集
 */
router.get('/admin/albums', AlbumController.list); //合集列表
router.get('/admin/albums/:aid', AlbumController.find); //合集列表
router.post('/admin/albums', AlbumController.create); //创建合集
router.patch('/admin/albums', AlbumController.update); //编辑合集

/**
 * app接口
 */
router.get('/data/books', AreaController.list)   //推荐列表   书籍与合集
router.get('/data/books/:bid', BookController.find); //单本书
router.get('/data/books/:bid/chapters/:cid', ChapterController.findAndBuild); //单章内容
router.get('/data/albums/:aid', AlbumController.find); //合集列表
//router.get('/data/comment/:bid/:cid/:pos', CommentControll.find); //当前评论点
router.get('/data/comments/:bid/:cid/:pos', CommentControll.list);  //评论列表
router.post('/data/comments', CommentControll.create);
/**
 * 返回前端页面
 */
// router.use('*', function(req, res){
// 	res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
// })

module.exports = router
