const { mutipleMongooseToObject } = require("../../util/mongoose");
const Categories = require("../model/Categories");
const Product = require('../model/Products');
const RecommendProductsProcess = require('../../util/recomment');
const Evaluate = require('../model/Evaluates');
const AccountDetail = require('../model/AccountDetails');

class SiteController {
  index(req, res, next) {
    var userId;
    const numberOfRecommendations = 5;
    var recommendedProducts;
    var listIdRecommendedProducts;

    if (req.session.idUser) {
      userId = req.session.idUser;
      Promise.all([AccountDetail.find({}, '_id age gender').lean(),
                  Product.find({}, 'targetAge targetGender'),
                  Evaluate.find({}, 'evaluate')])
      .then(([infoCustomers, infoProducts, evaluates]) =>{
        const stringifiedData = infoCustomers.map(item => {
          return {
            ...item,
            _id: item._id.toString()
          };
        });
        const recommendationSystem = new RecommendProductsProcess(stringifiedData, infoProducts, evaluates);
        recommendedProducts = recommendationSystem.recommendProducts(userId, numberOfRecommendations);
        return listIdRecommendedProducts = recommendedProducts.map(item => item._id);   
      })
      .then((idProduct)=>{
        Promise.all([Categories.find({}), Product.find({ _id: { $in: idProduct } }).lean()])
        .then(([category, recomment]) => {
          res.render('home', {
            category: mutipleMongooseToObject(category),
            recomment
          });
        })  
        .catch(next);
      })
      .catch(next)  
    }  
    else{
      Promise.all([Categories.find({}), Product.find({}).sort({evaluate: -1}).limit(5).lean()])
      .then(([category, recomment]) => {
        res.render('home', {
          category: mutipleMongooseToObject(category),
          recomment
        });
      })  
      .catch(next);
    }
  }
  
}

module.exports = new SiteController();
