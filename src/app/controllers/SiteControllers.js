const { mutipleMongooseToObject } = require("../../util/mongoose")

const Categories = require("../model/Categories")

const Product = require('../model/Products');
class SiteController {
  index(req, res, next) {
    Categories.find({})
      .then((category) => {
        res.render("home", {
          category: mutipleMongooseToObject(category),
        })
      })
      .catch(next)
  }
}

module.exports = new SiteController()
