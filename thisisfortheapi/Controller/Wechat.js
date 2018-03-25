var config = require('node-weixin-config');
var settings = require('node-weixin-settings');
var jssdk = require('node-weixin-jssdk');


var app = {
  id: 'wx747b4382d2847b0e',
  secret: '0a946dfc4c4fc282999d4cb4fb06b736',
  token: '0a946dfc4c4fc282999d4cb4fb06b736'
};

config.app.init(app);

var cache = {};

// settings.registerSet(function (id, key, value, callback) {
//   cache[id] = {};
//   cache[id][key] = value;
//   callback(true);
// });
// settings.registerGet(function (id, key, callback) {
//   console.log(id, key)
//   console.log(cache[id])
//   if(typeof cache[id] == 'undefined'){
//     callback(false);
//     return false;
//   }
    
//   if(cache[id][key]){
//     callback(JSON.parse( JSON.stringify( cache[id][key] ) ));
//   }else{
//     callback(false)
//   }    
// });

function Controller() {
  
}
Controller.prototype = {
  ticket: function(req, res){
    var url  = req.query.url;
    var cb = req.query.callback;
    jssdk.prepare(settings, app, url, function (error, data) {
      res.send(`${cb}('${JSON.stringify(data)}')`);
      // settings.get(app.id, 'jssdk', function (sdk) {
      //   //console.log(sdk);
      //   res.json(sdk)
      // });
    });
  }
}

module.exports = new Controller();