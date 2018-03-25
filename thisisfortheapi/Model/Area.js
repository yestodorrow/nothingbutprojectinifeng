var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AreaSchema = new Schema({
  id: Schema.Types.ObjectId,	
  name: String, //best |hot| new | update
  books: {
    type: Array,
    default: [] /**
     * {
     *  id:
     *  type: book|album
     *  title:
     *  cover: 
     * }
     */
  }
},{
  timestamps: true
});


var Model = mongoose.model('Area', AreaSchema);//first param  mapping mongodb collection name 's;

module.exports = Model;