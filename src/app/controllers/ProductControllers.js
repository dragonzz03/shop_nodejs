const Product = require('../model/Products');
const Cart = require('../model/Cart');
const User = require('../model/AccountDetails');
const OrderManagement = require('../model/OrderManagement');
const Categories = require('../model/Categories');
const Comment = require('../model/Comment');
const SalesOrderManagement = require('../model/SalesOrderManagement')
const LikeList  = require('../model/LikeList')
const convert = require('../../util/convertStringToArray')
const { 
  mutipleMongooseToObject,
  MongooseToObject
} = require('../../util/mongoose');
const { isArray } = require('mathjs');
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
    Promise.all([Product.findOne({ _id: req.params.id }), 
      Comment.find({idProduct: req.params.id}).lean(),
      LikeList.findOne({idUser: req.session.idUser}).lean()
    ])
      .then(([product, comment, CommentInteraction]) => {
        if(CommentInteraction){
          const interac = Object.values(CommentInteraction.listLikeComment)
          comment.forEach(obj2 => {
            // Search for idComment in array interac
            const foundObj1 = interac.find(obj1 => obj1.idComment == obj2._id);
            // If found, add the type field to comment
            if (foundObj1) {
              obj2.type = foundObj1.type;
            }
          });
        }
        
        res.render('product/productDetails', {
          product: MongooseToObject(product),
          comment: comment,
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
      res.render('product/addProduct',{
      type: mutipleMongooseToObject(type)
        }
      )       
    )
    .catch(next);
  }
//[POST] product/addProductSuccess
  addProductSuccess(req, res, next) {
    var productInfo = req.body;
    productInfo.idAuthor= req.session.idUser;
    const product = new Product(productInfo);
    product
      .save()
      .then(() => res.redirect('/'))
      .catch(next);
  }
//[POST] product/addToCart
  addToCart(req, res, next) {
    var cartInfo;
    if (!req.session.idUser) {
      const previousUrl = req.header('referer');
      const errorMessage = "You need to log in to be able to add products to your cart";
      res.locals.alert = true
      res.locals.message.warning = errorMessage;
      return res.redirect(previousUrl)
    }
    else{
      Product.findById(req.params.idProduct)
      .then((product) =>{
        cartInfo = req.params;
        cartInfo.idUser = req.session.idUser;
        cartInfo.name = product.name;
        cartInfo.idAuthor = product.idAuthor;
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
  }
//[GET] product/cart
  cart(req, res, next) {
    Cart.find({idUser: req.session.idUser}).lean()
      .then((cart) => {
        let idProducts = cart.map((item) =>item.idProduct)
        let isEnable
        let products = idProducts.map(id => Product.find({_id:id}).lean())
        Promise.all(products)
        .then((product) =>{
          const arrayProducts = [].concat(...product);
          let quantityProduct = arrayProducts.map((product) =>product.quantity)
          isEnable = cart.map(function(item, index){
            return quantityProduct[index] > 0 ? true: false
          })
          return cart.map(function(item, index){
            return {
              ...item,
              enable: isEnable[index]
            }
          })
        })
        .then((cart) =>{
          res.render('product/cart', {
            cart,
          })
        })
        .catch(next)
      })
      .catch(next)
  }

//[GET] product/checkout
  checkOut(req, res, next) {
    // res.json(req.params.idCart)
    var product
    if (!req.session.idUser) {
      const errorMessage = "You need to log in to be able to add products to your cart"
      res.render('account/signIn',{
        errorMessage
      });
      return
    }
    else{
      Promise.all([Product.findById(req.params.idProduct), User.findById(req.session.idUser), User.find({permission:'transporter'})])
      .then(([productInfo, user, transporter]) =>{
          productInfo = MongooseToObject(productInfo)
          productInfo.idUser = req.session.idUser
          productInfo.idProduct = req.params.idProduct
          productInfo.quantityToBuy = req.params.quantityToBuy
          product = [productInfo]
          let forCal = {
            price: [productInfo.price],
            quantityToBuy: [req.params.quantityToBuy]
          }; 
          res.render('product/checkOut', {
            User: MongooseToObject(user),
            product,
            transporter: mutipleMongooseToObject(transporter),
            forCal
          })  
      })
      .catch(next)
    } 
  }
  //[GET]product/cart/checkout/:cartIds/:quantity
  checkOutFromCart(req, res, next) {
    const idCarts = convert(req.params.cartIds)
    const quantity = convert(req.params.quantity)
    Promise.all([Cart.find({_id: {$in: idCarts}}).lean(), User.findById(req.session.idUser), User.find({permission:'transporter'})])
    .then(([manyProductInfo, user, transporter]) =>{
      const product = manyProductInfo.map((cartItem, index) => {
        cartItem.quantityToBuy = quantity[index]
        return cartItem
      })
      const forCal = {
        price: manyProductInfo.map(cartItem => cartItem.price),
        quantityToBuy: manyProductInfo.map(cartItem => cartItem.quantityToBuy)
      };
      res.render('product/checkOut',{
        User: MongooseToObject(user),
        product,
        transporter: mutipleMongooseToObject(transporter),
        forCal,
      })
    })
    .catch(next) 
  }
//[POST] product/purchaseProcessing
  purchaseProcessing(req, res, next) {
    const object = req.body
    const forServiceProvider = {
      idCustomer: req.session.idUser,
      orderStatus: 'Processing',
      nameCustomer: req.body.nameCustomer,
      imageCustomer: req.body.imageCustomer,
    }
    const filteredData = Object.entries(object).filter(([key, value]) => !Array.isArray(value));
    const result = Object.fromEntries(filteredData);
    for (const key in result) {
      if (result[key]) {
        delete object[key];
      }
    }
    const arrayResult = [];
    object.quantityToBuy.forEach((quantity, index) => {
      const obj = {};
      for (const key in object) {
        if (Array.isArray(object[key])) {
          obj[key] = object[key][index];
        }
      }
      arrayResult.push(obj);
    });
    const newArray = arrayResult.map(obj => ({ ...obj, ...result }));  
      newArray.forEach(dataOrder =>{
      const orderManagements = new OrderManagement(dataOrder);    
      orderManagements.save()
        .then((orderManagements) =>{
            const forSaler =  {
                ...forServiceProvider,
                idServiceProvider: dataOrder.idAuthor,
                idOrder: orderManagements._id.toString()
              };
              console.log(forSaler)
            const forTransporter =  {
                ...forServiceProvider,
                idServiceProvider: dataOrder.idTransporter,
                idOrder: orderManagements._id.toString()
              };
              const saveForSaler = SalesOrderManagement(forSaler)
              const saveForTransporter = SalesOrderManagement(forTransporter)
              Promise.all([saveForSaler.save(), saveForTransporter.save()])
                .then(()=>{
                  console.log('Save successfull')
                })
                .catch(next)
        })
        .catch(next);
      })
      Cart.deleteMany({_id: {$in: req.body.idCart}})
        .then(()=>{
          res.redirect('/product/orderManagement/'+ req.session.idUser)
        })
        .catch() 
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
    const stringIdCarts = req.params.idProduct
    const idCarts = convert(stringIdCarts)  
    Cart.deleteMany({_id: {$in: idCarts }})
    .then(() => res.redirect('back'))
    .catch(next);
  }
  //[DELETE] admin/:id/
  deleteOrderedProducts(req, res, next) {
    OrderManagement.findByIdAndDelete(req.params.idProductDelete)
    .then(() => res.redirect('back'))
    .catch(next);
  }
  likeComment(req, res, next) {
    res.json('check')
  }
  //[GET]product/cart/like/:cartIds
  likeFromCart(req, res, next) {
    res.send('like')
  }
}

module.exports = new ProductController();
