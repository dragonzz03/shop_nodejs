const AccountDetail = require('../model/AccountDetails');
const {
  validateAccountName,
  validatePassword,
} = require('../../util/validateAccount');
const { MongooseToObject } = require('../../util/mongoose');
const alert = require('alert');

class AccountControllers {
  
  //[GET] account/signIn
  formSignIn(req, res, next) {
    res.render('account/signIn', {
      display: 'none'
    });
  }

  //[POST] account/signInProcess
  signInProcessing(req, res, next) {
    AccountDetail.findOne({ accountName: req.body.accountName })
        .then((account) =>
          validateAccountName(account.accountName, req.body.accountName) &&
          validatePassword(account.password, req.body.password)
            ? [
                req.session.accountName = account.name,
                req.session.image = account.image,
                req.session.idUser = account._id,
                res.redirect("/"),
              ]
            : [alert("sign in fail"), res.redirect("/account/signIn")]
        ) //account is not defined
        .catch((err) => [alert("sign in fail"), res.redirect("/account/signIn")])
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
    AccountDetail.findOne({_id: req.session.idUser})
    .then((account) =>{
      res.render('account/profile',{
        account: MongooseToObject(account)
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
