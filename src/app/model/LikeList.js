const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const infoLikeList = new Schema({
  idComment: { type: String },
  type: { type: String },
},
{
  _id: false,
})

const LikeList = new Schema({
  idUser: { type: String },
  listLikeComment: { type: Map, of: infoLikeList },
});




module.exports = mongoose.model('LikeLists', LikeList);