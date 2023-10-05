const Product = require('../model/Products');
const Cart = require('../model/Cart');
const User = require('../model/AccountDetails');
const OrderManagement = require('../model/OrderManagement');
const Categories = require('../model/Categories');
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

//[GET] product/allProduct
  showAllProduct(req, res, next) {
    Product.find()
      .then((product) => {
        res.render('product/showAllProduct', {
          product: mutipleMongooseToObject(product),
        });
      })
      .catch(next);
  }

//[GET] product/addProduct
  addProduct(req, res, next) {
    //res.render('admin/addProduct');
    Categories.find({})
    .then((type) =>
     res.render('admin/addProduct',{
     type: mutipleMongooseToObject(type)
    }
    )
    )
    .catch(next);
  }

//[POST] product/addProductSuscess
  addProductSuscess(req, res, next) {
    var productInfo = req.body;
    productInfo.author= req.session.idUser;
    const product = new Product(req.body);
    product
      .save()
      .then(() => res.redirect('/'))
      .catch(next);
  }

//[POST] product/addToCart
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

//[GET] product/cart
  cart(req, res, next) {
    Cart.find({idUser: req.session.idUser})
      .then((cart) => {
        res.render('product/cart', {
          cart: mutipleMongooseToObject(cart),
        })

      })
      .catch(next)
  }

//[GET] product/checkout
  checkout(req, res, next) {
    var product = req.query
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

//[GET] product/purchaseProcessing
  purchaseProcessing(req, res, next) {
    const orderManagements = new OrderManagement(req.query);
    var newQuantity = req.query.quantity - req.query.quantityToBuy
    Promise.all([orderManagements.save(), Product.updateOne({_id:req.query.idProduct}, {quantity: newQuantity})])
      .then(() =>{
        res.redirect('/product/cart')
      })
      .catch(next);
  }

//[GET] product/orderManagement
  orderManagement(req, res, next) { 
    OrderManagement.find({ idCustomer: req.params.id})
    .then((orderManagement) => {
      res.render('product/orderManagement',{
        orderManagement:  mutipleMongooseToObject(orderManagement)
      })
    })
    .catch(next);
  }
}

module.exports = new ProductController();
