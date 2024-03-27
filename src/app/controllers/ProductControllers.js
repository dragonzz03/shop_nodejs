const Product = require('../model/Products');
const Cart = require('../model/Cart');
const User = require('../model/AccountDetails');
const OrderManagement = require('../model/OrderManagement');
const Categories = require('../model/Categories');
const Comment = require('../model/Comment');
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
          productType: req.params.type,
        });
      })
      .catch(next);
  }

//[GET] /product/productDetails/:id
  productDetails(req, res, next) {
    Promise.all([Product.findOne({ _id: req.params.id }), Comment.find({idProduct: req.params.id})])
      .then(([product, comment]) => {
        res.render('product/productDetails', {
          
          product: MongooseToObject(product),
          comment: mutipleMongooseToObject(comment)
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
    var cartInfo;
    Product.findById(req.params.idProduct)
      .then((product) =>{
        cartInfo = req.params;
        cartInfo.idUser = req.session.idUser;
        cartInfo.name = product.name;
        cartInfo.idOwner = product.author;
        cartInfo.image = product.image;
        cartInfo.price = product.price;
        cartInfo.description = product.description;
        return cartInfo
      })
      .then((cartInfo) =>{

        const addProductToCart = new Cart(cartInfo)
        addProductToCart.save()
          .then(() =>{
            res.redirect('/product/cart')
          })
          .catch(next);
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

//[GET] product/deteteProductCart 
deteteProductCart(req, res, next) {
    Cart.findByIdAndDelete(idProductForDelete)
      .then((cart) => {
        res.render('product/cart', {
          cart: mutipleMongooseToObject(cart),
        })

      })
      .catch(next)
  }

//[GET] product/checkout
  checkOut(req, res, next) {
    var product
    Promise.all([Product.findById(req.params.idProduct), User.findById(req.session.idUser), User.find({permission:'transporter'})])
    .then(([productInfo, user, transporter]) =>{
        productInfo = MongooseToObject(productInfo)
        productInfo.idUser = req.session.idUser
        productInfo.idProduct = req.params.idProduct
        productInfo.quantityToBuy = req.params.quantityToBuy
        product = [productInfo]

        if (user == null ) {
          res.redirect('/account/signIn')
          
        }
        else{
          res.render('product/checkOut', {
            User: MongooseToObject(user),
            product,
            transporter: mutipleMongooseToObject(transporter),
          })
        }
        
    })

    .catch(next)
    
  }

  checkOutFromCart(req, res, next) {
   var product
  

    // Promise.all([Cart.find({_id: req.params.idProduct}), User.findById(req.session.idUser), User.find({permission:'transporter'})])
    // .then(([manyProductInfo, user, transporter]) =>{

    //   manyProductInfo.forEach(productInfo => {
    //     manyProductInfo
        
    //   });
    //   res.render('product/checkOut',{
        
    //   })

    // })
    // .catch(next)

    
  }

  likeFromCart(req, res, next) {res.send('like')}

//[POST] product/purchaseProcessing
  purchaseProcessing(req, res, next) {
    const orderManagements = new OrderManagement(req.body);
    var newQuantity = req.body.quantity - req.body.quantityToBuy
    Promise.all([orderManagements.save(), Product.updateOne({_id:req.body.idProduct}, {quantity: newQuantity})])
      .then(() =>{
        res.redirect('/product/orderManagement/'+ req.session.idUser)
      })
      .catch(next);
  }

//[GET] product/orderManagement
  orderManagement(req, res, next) { 
    OrderManagement.find({ idCustomer: req.params.id})
    .then((orderManagement) => {
      const numberOfOrders = orderManagement.length;
      res.render('product/orderManagement',{
        orderManagement:  mutipleMongooseToObject(orderManagement),
        numberOfOrders: numberOfOrders
      })
    })
    .catch(next);
  }

    //[DELETE] admin/:id/
    deleteCartProduct(req, res, next) {
      Cart.delete({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }

    //[DELETE] admin/:id/
    deleteOrderedProducts(req, res, next) {
      OrderManagement.findByIdAndDelete(req.params.idProductDelete)
      .then(() => res.redirect('back'))
      .catch(next);
     
  }
}

module.exports = new ProductController();
