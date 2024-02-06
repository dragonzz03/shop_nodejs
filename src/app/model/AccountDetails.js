const mongoose = require("mongoose")
const slug = require("mongoose-slug-generator")
mongoose.plugin(slug)
const Schema = mongoose.Schema

const AccountDetail = new Schema({
  name: { type: String },
  email: { type: String },
  address: { type: String },
  image: { type: String },
  accountName: { type: String, unique: true },
  email: { type: String },
  password: { type: String },
  imageBrand: { type: String, default: 'none' },
  permission: { type: String , default: 'customer'},
  brand: { type: String , default: 'none'},
  age: { type: Number },
  numberPhone: { type: Number },
  gender: { type: String },
  slug: { type: String, slug: "accountName", unique: true },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
})
module.exports = mongoose.model("AccountDetails", AccountDetail);
