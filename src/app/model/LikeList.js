const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeList = new Schema({
  idUser: { type: String },
  idProduct: { type: String },  
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LikeListes', LikeList);