const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CountLike = new Schema({
  idComment: { type: String },
  idUser: { type: String },
},
{
  versionKey: false
})
module.exports = mongoose.model("CountLikes", CountLike);
