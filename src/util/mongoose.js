module.exports = {
  mutipleMongooseToObject: function (mongooses) {
    return (mongooses = mongooses.map((mongooses) => mongooses.toObject()))
  },
  MongooseToObject: function (mongooses) {
    return mongooses ? mongooses.toObject() : mongooses
  },
}
