const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderManagement = new Schema({
  idCustomer: { type: String },
  idProduct: { type: String },
  idOwner: { type: String },
  name: { type: String },
  image: { type: String },
  price: { type: Number },
  description: { type: String },
  quantityToBuy: { type: Number },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('OrderManagements', OrderManagement);