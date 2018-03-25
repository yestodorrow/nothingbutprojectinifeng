var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RoleSchema = new Schema({
	id: Number,
	name:{
		type: String,
		required: true,
    index: true,
    unique: true
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

var Model = mongoose.model('Role', RoleSchema);//first param  mapping mongodb collection name 's;

module.exports = Model;
