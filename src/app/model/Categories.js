const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Category = new Schema({
  name: { type: String },
  image: { type: String },
  slug: { type: String, slug: 'name', unique: true },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
mongoose.plugin(slug);
Category.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
module.exports = mongoose.model('Categories', Category);
