const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SalesOrderManagement = new Schema({
  idCustomer: { type: String },
  idServiceProvider: { type: String },
  idOrder: { type: String },
  orderStatus: { type: String, default: 'Processing'},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SalesOrderManagements', SalesOrderManagement);