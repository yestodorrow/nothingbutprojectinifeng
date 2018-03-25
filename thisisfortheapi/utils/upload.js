var qiniu = require("qiniu");

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'KSkJrZQzoVAfvXROdJ4Vg4SbZ6_kVtu-Am_41Giu';
qiniu.conf.SECRET_KEY = '29KLhCL_Xi1APgVmwwASBoapBzwu3vyM7vVML5wy';

//要上传的空间
bucket = 'balabala';

//构建上传策略函数
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}


// //上传到七牛后保存的文件名
// filename = 'my-nodejs-logo.png';
// //要上传文件的本地路径
// filePath = './ruby-logo.png'


//构造上传函数
function uploadFile(filename, localFile ,callback) {
  var token = uptoken(bucket, filename);
  var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(token, filename, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        console.log(ret.hash, ret.key);
      } else {
        // 上传失败， 处理返回代码
        console.log(err);
      }
      if(callback) callback(err, ret);
  });    
}

function uploadStream(strbuf , callback){
  var config = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z1;
  var formUploader = new qiniu.form_up.FormUploader(config);
  var putExtra = new qiniu.form_up.PutExtra();
  formUploader.putStream(uploadToken, key, readableStream, putExtra, function(err, body, info) {
    if (err) throw err;

    if (info.statusCode == 200) {
      console.log(body);
    } else {
      console.log(info.statusCode);
      console.log(body);
    }
  });
}


//调用uploadFile上传
//@param1  remote file name    like '/profile/sdfsdfsfd.jpg'
//@param2  loacl file path 
exports.upload = uploadFile;