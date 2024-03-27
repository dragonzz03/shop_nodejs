const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
  idUser: { type: String },
  nameUser: { type: String },
  imageUser: { type: String },
  idProduct: { type: String },  
  commentContent: { type: String },
  like: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 },
  type: { type: String , default: 'default'},  
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});



module.exports = mongoose.model('Comments', Comment);