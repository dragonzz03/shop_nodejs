const Product = require('../model/Products');
const Cart = require('../model/Cart');
const User = require('../model/AccountDetails')
const OrderManagement = require('../model/OrderManagement')

const { 
  mutipleMongooseToObject,
  MongooseToObject

} = require('../../util/mongoose');

class ProductController {
  index(req, res, next) {
    Product.find({ type: req.params.type })
      .then((product) => {
        res.render('product/showProducts', {
          product: mutipleMongooseToObject(product),
          productType: req.params.type
        });
      })
      .catch(next);
  }
//[GET] /product/productDetails/:id
  productDetails(req, res, next) {
    Product.findOne({ _id: req.params.id })
      .then((product) => {
        res.render('product/productDetails', {
          product: MongooseToObject(product),
        });
      })  
      .catch(next);
  }
//[GET] product/searchResults?nameProduct
  searchResults(req, res, next){
    Product.find({ name: req.query.nameProduct})
    .then((product) => {
      res.render('product/productSearchResults', {
        product: mutipleMongooseToObject(product),
        nameProduct: req.query.nameProduct
      });
    })
    .catch(next);
  }

  showAllProduct(req, res, next) {
    Product.find()
      .then((product) => {
        res.render('product/showAllProduct', {
          product: mutipleMongooseToObject(product),
        });
      })
      .catch(next);
  }

//[GET] admin/addProduct
  addProduct(req, res, next) {
    res.render('admin/addProduct');
  }

//[POST] admin/addProductSuscess
  addProductSuscess(req, res, next) {
    var productInfo = req.body;
    productInfo.author= req.session.id;
    const product = new Product(req.body);
    product
      .save()
      .then(() => res.redirect('/'))
      .catch(next);
  }

  addToCart(req, res, next) {
    var cartInfo = req.body
    cartInfo.idUser = req.session.idUser
    const addProductToCart = new Cart(cartInfo)
    addProductToCart.save()
      .then(() =>{
        res.redirect('/product/cart')
      })
      .catch(next);
  }

  cart(req, res, next) {
     //res.json(req.session.idUser)

//
    Cart.find({idUser: req.session.idUser})
      .then((cart) => {
        res.render('product/cart', {
          cart: mutipleMongooseToObject(cart),
        })

      })
      .catch(next)
   
  }

  checkout(req, res, next) {
    var product = req.query


    // var newQuantity = req.body.quantity - req.body.quantityToBuy
    // cartInfo.newQuantity = newQuantity
    // cartInfo.idUser = req.session.idUser
    // const addProductToCart = new Cart(cartInfo)


    User.findById({_id: req.session.idUser})
      .then((User) =>{
        res.render('product/checkOut', {
          User: MongooseToObject(User),
          product,

        })
      })
      .catch((next) =>{
        res.redirect('/account/signIn')
      });
    
  }

  purchaseProcessing(req, res, next) {
    const orderManagement = new OrderManagement(req.query);
    var newQuantity = req.query.quantity - req.query.quantityToBuy

    Promise.all([orderManagement.save(), Product.updateOne({_id:req.query.idProduct}, {quantity: newQuantity})])
      .then(() =>{
        res.redirect('/product/cart')
      })
      .catch(next);
  }

  orderManagement(req, res, next) {
    res.json(req.params.id)
  }
}

module.exports = new ProductController();
