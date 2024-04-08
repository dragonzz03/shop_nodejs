const AccountDetail = require('../model/AccountDetails');
const Product = require('../model/Products');
const {
  validateAccountName,
  validatePassword,
} = require('../../util/validateAccount');
const { MongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const OrderManagement = require('../model/OrderManagement');
const SalesOrderManagement =  require('../model/SalesOrderManagement')
class AccountControllers {
  //[GET] account/signIn
  formSignIn(req, res, next) {
    res.render('account/signIn', {
      display: 'none'
    });
  }
  //[POST] account/signInProcess
  signInProcessing(req, res, next) {
    if (req.body.accountName == 'admin' && req.body.password  == '1') {
      res.redirect('/admin')
    } 
    else{
    AccountDetail.findOne({ accountName: req.body.accountName })
        .then((account) =>{
          if (validateAccountName(account.accountName, req.body.accountName) && validatePassword(account.password, req.body.password)) 
          {
            if (account.status == 'banned') {
              res.render('account/signIn', {
                alert: true,
                message: 'Your account has been banned',
                atag: 'Click here to see the reason',
                href: '/account/signUp',
                type: '-danger'
              }) 
              return false
            }
            else {
              req.session.accountName = account.name
              req.session.image = account.image
              req.session.idUser = account._id
              if(account.permission == 'seller'){
                req.session.role = true
                req.session.hasPost = true
              }else if (account.permission == 'transporter'){
                req.session.role = true
                req.session.hasPost = false
              }else{
                req.session.role = false
                req.session.hasPost = false
              }
              res.redirect("/")
            }
          }
          else{
            res.render('account/signIn', {
              alert: true,
              message: 'Incorrect password',
              atag: 'Click here to recover password',
              href: '/account/signUp',
              type: '-warning'
            })
          }     
        }
        ) //account is not defined}
        .catch((err) => {
          res.render('account/signIn', {
            alert: true,
            message : 'Incorrect account - Do you have an account yet?',
            atag: 'Click here to register',
            href: '/account/signUp',
            type: '-warning'
          })
        })
      }
  }
  //[GEt] account/signUp
  formSignUp(req, res, next) {
    res.render('account/signUp',{
      display: 'none'
    });
  }
  //[]POST] account/signUpProcessing
  signUpProcessing(req, res, next) {
    console.log(req.body)
    const formData = req.body;  
    AccountDetail.create(formData)
      .then(() => {
        console.log('save account successfully')
        res.redirect('/')
      })
      .catch(next);
  }
  //[GET] account/changePassword
  formchangePassword(req, res, next) {
    res.render('account/changePassword',{
      display: 'none'
    });
  }
  //[PATCH] account/changePasswordProcessing
  changePasswordProcessing(req, res, next) {
    AccountDetail.findOne({ accountName: req.body.accountName })
      .then((account) =>
          res.json(
            validateAccountName(account.accountName, req.body.accountName) &&
              validatePassword(account.password, req.body.password) &&
              !validatePassword(req.body.newPassword, req.body.password) &&
              validatePassword(req.body.newPassword, req.body.reNewPassword)
          )
        //res.alert('Update failure'),
      )
      .catch(next);
  }
  //[GET] account/forgetPassword
  forgetPass(req, res, next) {
    res.render('account/forgetPass',{
      display: 'none'
    });
  }
  //[GET] account/profile
  profile(req, res, next) {
    Promise.all([AccountDetail.findOne({_id: req.session.idUser}),Product.find({idAuthor: req.session.idUser})])
    .then(([account, product]) =>{
      res.render('account/profile',{
        account: MongooseToObject(account),
        product: mutipleMongooseToObject(product)
      });
    })
    .catch(next)
  }
  //[GET] account/profile/personalService
  personalService(req, res, next) {
    Promise.all([AccountDetail.findOne({_id: req.session.idUser}),Product.find({idAuthor: req.session.idUser})])
    .then(([account, product]) =>{
      res.render('aboutMe/serviceManagement',{
        account: MongooseToObject(account),
        product: mutipleMongooseToObject(product)
      });
    })
    .catch(next) 
  }
  //[GET] account/logout
  logout(req, res, next) {
    req.session.destroy();
    res.redirect("/account/signIn")
  }
  //[GET]account/decentralization
  decentralization(req, res, next) {
    res.render('account/decentralization')
  }
  //[POST]account/decentralizationProcess
  decentralizationProcess(req, res, next) {
    AccountDetail.updateOne({ _id: req.session.idUser }, req.body)
    .then(() => res.redirect('/'))
    .catch(next);
  }
  //[GEt]/account/profile/personalService/unprocessedOrder/:idServiceProvider
  viewUnprocessedOrders(req, res, next){
    SalesOrderManagement.find({idServiceProvider: req.params.idServiceProvider, orderStatus: 'Processing'})
      .then((infoOrders) =>{
        let idOrders = infoOrders.map(infoOrder => infoOrder.idOrder)
        let infoCustomers = infoOrders.map(function(item, index){
          return{
            nameCustomer: item.nameCustomer,
            imageCustomer: item.imageCustomer
          }
        })
        OrderManagement.find({ _id: { $in: idOrders }}).lean()
          .then((unprocessedOrder)=>{
            let listUnprocessedOrder = unprocessedOrder.map((item, index) => {
              return {
                ...item,
                ...infoCustomers[index]
              };
            });
            res.render('aboutMe/orderManagementProcess', {
              listUnprocessedOrder,
              numberOfOrders: listUnprocessedOrder.length
            })
          })
          .catch(next) 
      })
      .catch(next)
  }
  //[PATCH] account/profile/personalService/interactOrder
  interactOrderProcess(req, res, next){
    if(req.body.orderStatus === 'Confirm' && req.body.quantityProduct !== null){
      Product.findOne({_id: req.body.idProduct}).lean()
        .then((product)=>{
          let newQuantity = parseInt(parseInt(product.quantity )- parseInt(req.body.quantityProduct))
          Promise.all([OrderManagement.updateOne({_id: req.body.idOrder}, {orderStatus: req.body.orderStatus}), Product.updateOne({_id: req.body.idProduct}, {quantity: newQuantity}), SalesOrderManagement.updateMany({idOrder: req.body.idOrder, orderStatus: 'Processing'}, {orderStatus: req.body.orderStatus})])
          .then(() =>{
            console.log('update successfully')
            res.redirect('back')
          })
          .catch(next)
        })
        .catch(next)
    }else {
      Promise.all([OrderManagement.updateOne({_id: req.body.idOrder}, {orderStatus: req.body.orderStatus}), SalesOrderManagement.updateMany({idOrder: req.body.idOrder, orderStatus: 'Processing'}, {orderStatus: req.body.orderStatus})])
      .then(() => {
        res.redirect('back')
      })  
      .catch(next)
    }  
  }
}
module.exports = new AccountControllers();
