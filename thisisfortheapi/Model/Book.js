var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var BookSchema = new Schema({
	id: Schema.Types.ObjectId,
	uid:{
    type: String,      
  },
  bookname: String,
  author: String,
  keyword: String,
  description: String,  
  cover: String,
  category: {
    type: Number,
    default: 0
  },
  catalog: {
    type: Array,
    default: []  //{id:, tilte:} main 是否是主角
  },
  status: {
    type: Number,
    default: 0   //0-下线  1-上线
  },    
},{
  timestamps: true
});


var Model = mongoose.model('Book', BookSchema);//first param  mapping mongodb collection name 's;

module.exports = Model;