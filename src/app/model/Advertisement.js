const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Advertisement = new Schema({
  content: { type: String },
  image: { type: String },
  link: { type: String },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
})
module.exports = mongoose.model("Advertisements", Advertisement);
