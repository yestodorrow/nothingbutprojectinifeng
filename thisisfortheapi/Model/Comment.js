var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	id: Schema.Types.ObjectId,
	bid: String,
  cid: String,
  topic: {
    required: true,
    type: String
  },
  position: Number,
  user: Object,
  comment: {
    required: true,
    type: String
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

var Model = mongoose.model('Comment', CommentSchema);//first param  mapping mongodb collection name 's;

module.exports = Model;
