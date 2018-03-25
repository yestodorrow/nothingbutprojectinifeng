var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AlbumSchema = new Schema({
  id: Schema.Types.ObjectId,
	title: String,  
  cover: String,
  books: {
    type: Array,
    default: []  //id title cover
  },
},{
  timestamps: true
});


var Model = mongoose.model('Album', AlbumSchema);//first param  mapping mongodb collection name 's;

module.exports = Model;
