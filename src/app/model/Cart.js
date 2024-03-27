const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cart = new Schema({
  idUser: { type: String },
  idProduct: { type: String },
  idAuthor: { type: String },
  name: { type: String },
  image: { type: String },
  price: { type: Number },
  description: { type: String },
  quantityToBuy: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Carts', Cart);