const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
  name: { type: String },
  type: { type: String },
  author: { type: String },
  description: { type: String },
  quantity: { type: Number },
  image: { type: String },
  price: { type: String },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Products', Product);