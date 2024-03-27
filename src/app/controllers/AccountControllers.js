const AccountDetail = require('../model/AccountDetails');
const Product = require('../model/Products');
const {
  validateAccountName,
  validatePassword,
} = require('../../util/validateAccount');
const { MongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');


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
    const formData = req.body;
    
    const signUpProcessing = new AccountDetail(formData);
    signUpProcessing
      .save()
      .then(() => res.redirect('/'))
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
    Promise.all([AccountDetail.findOne({_id: req.session.idUser}),Product.find({author: req.session.idUser})])
    
    .then(([account, product]) =>{
      res.render('account/profile',{
        account: MongooseToObject(account),
        product: mutipleMongooseToObject(product)
      });

    })
    .catch(next)
    
  }

  personalService(req, res, next) {
    Promise.all([AccountDetail.findOne({_id: req.session.idUser}),Product.find({author: req.session.idUser})])
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
    res.redirect("/")
  }
  //[]account/decentralization
  decentralization(req, res, next) {
   res.render('account/decentralization')
  }
  //[POST]account/decentralizationProcess
  decentralizationProcess(req, res, next) {
    AccountDetail.updateOne({ _id: req.session.idUser }, req.body)
    .then(() => res.redirect('/'))
    .catch(next);
  }
}

module.exports = new AccountControllers();
