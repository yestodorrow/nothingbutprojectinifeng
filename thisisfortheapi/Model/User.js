var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	id: Schema.Types.ObjectId,
	username:{
		type: String,
		required: true,
    index: true,
    unique: true
	},
  nickname:{
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: true
  },  
  role: {
    type: Number,
    required: true  // 1-作者  2-编辑 3-运营 4-管理员
  },
  enabled: {
    type: Boolean,
    default: false
  } 
},{
  timestamps: true
});
//for Entity
// UserSchema.methods.findSimilarTypes = function(cb) {
//   return this.model('User').find({})
// }
// //object.findSimilarTypes(cb)

// //for Model 
// UserSchema.statics.findByName = function(name, cb){
//   this.find({name: new RegExp(name, 'i'), cb});
// }
//Model.find('name', cb)

var Model = mongoose.model('User', UserSchema);//first param  mapping mongodb collection name 's;

module.exports = Model;
