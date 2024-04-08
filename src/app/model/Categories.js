const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
const Category = new Schema({
  name: { type: String },
  image: { type: String },

  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
Category.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Categories', Category);
