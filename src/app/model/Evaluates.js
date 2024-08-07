const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Evaluate = new Schema({
  idUser: { type: String },
  nameUser: { type: String },
  imageUser: { type: String },
  idProduct: { type: String },  
  evaluate: { type: Number,},
  commentContent: { type: String },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Evaluates', Evaluate);