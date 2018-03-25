var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ChapterSchema = new Schema({
	id: Schema.Types.ObjectId,	  
  bid: String,
  cid: String,
  text: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: '章节名'
  },
  main: {
    type: String,
    default: ''
  },
  status: {
    type: Number,
    default: 0 //0 未提交   1审核中   2未通过 3提审通过  4下线  5上线  
  },
  comments: Array
},{
  timestamps: true
});


var Model = mongoose.model('Chapter', ChapterSchema);//first param  mapping mongodb collection name 's;

module.exports = Model;