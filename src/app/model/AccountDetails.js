const mongoose = require("mongoose")
const slug = require("mongoose-slug-generator")
mongoose.plugin(slug)
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose);

const AccountDetail = new Schema({
  name: { type: String },
  email: { type: String },
  address: { type: String },
  image: { type: String , default: 'https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png'},
  accountName: { type: String, unique: true },
  email: { type: String, default: 'none' },
  password: { type: String },
  imageBrand: { type: String, default: 'none' },
  permission: { type: String , default: 'customer'},
  brand: { type: String , default: 'none'},
  age: { type: Number },
  numberPhone: { type: Number },
  gender: { type: String },
  status: { type: String , default: 'active'},
  slug: { type: String, slug: "accountName", unique: true },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
},
{
  _id: false
})
AccountDetail.plugin(AutoIncrement);
module.exports = mongoose.model("AccountDetails", AccountDetail);
