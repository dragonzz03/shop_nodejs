const Categories = require('../model/Categories');
const Product = require('../model/Products');
const AccountDetail = require('../model/AccountDetails');
const Advertisement = require('../model/Advertisement');
const Comments = require('../model/Comment');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { MongooseToObject } = require('../../util/mongoose');
class AdminControllers {
  //[GET] admin
  index(req, res) {
    AccountDetail.find()
      .then((account) => {
        res.render('admin/admin',{
          account: mutipleMongooseToObject(account)
        });
      })
  }
  //[GET] admin/createCategory
  createCategory(req, res) {
    res.render('admin/createCategory');
  }
  //[POST] admin/addProductSuscess
  addProductSuscess(req, res, next) {
    const product = new Product(req.body);
    product
      .save()
      .then(() => res.redirect('/'))
      .catch(next);
  }
  //[GET] admin/createCategory/success
  success(req, res, next) {
    const categories = new Categories(req.query);
    categories
      .save()
      .then(() => res.redirect('/'))
      .catch(next);
  }
  //[GET] admin/updateCategory
  updateCategory(req, res, next) {
    Promise.all([Categories.find({}),Categories.countDocumentsDeleted()])
    .then(([categories, deletedCount]) =>
        res.render('admin/updateCategory', {
        deletedCount,
        categories: mutipleMongooseToObject(categories),
    })
  )
  .catch(next);
  }
  //[GET] admin//updateCategory/:id/editCategory
  editCategory(req, res, next) {
    Categories.findById(req.params.id)
      .then((category) =>
        res.render('admin/formEditCategory', {
          category: MongooseToObject(category),
        })
      )
      .catch(next);
  }
  //[PUT] admin/:id/editCategoryProcess
  editCategoryProcessing(req, res, next) {
    Categories.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect('/admin/updateCategory'))
      .catch(next);
  }
  //[DELETE] admin/:id/
  deleteCategory(req, res, next) {
    Categories.delete({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
  //[GET] /admin/trash
  trash(req, res, next) {
    Categories.findDeleted()
      .then((categories) =>
        res.render('admin/trash', {
          categories: mutipleMongooseToObject(categories),
        })
      )
      .catch((err) => {});
  }
  //[PATCH] /admin/:id/restore
  restore(req, res, next) {
    Categories.restore({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
  //[DELETE] admin/:id/force
  forcedeleteCategory(req, res, next) {
    Categories.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
  }
  advertisement(req, res, next) {
    res.render('advertisement/addAdvertisement')
  }
  advertisementProcessing(req, res, next) {
    res.render('advertisement/advertisement')
  }
  //[GET] admin/commentManagement
  commentManagement(req, res, next) {
    Comments.find()
    .then((comment) =>{
      res.render('admin/comment', {
        comment: mutipleMongooseToObject(comment)
      })
    })
  }
   //[GET] admin/addAdvertisement
  addAdvertisement(req, res, next) {
    res.render('admin/addAdvertisement')
}
  //[GET] admin/addAdvertisementProcess
  addAdvertisementProcess(req, res, next) {
    const data = req.body
    const addAdvertisement = new Advertisement(data)
    addAdvertisement.save()
    .then(() =>{
      res.redirect('back')
    })
    .catch(next)
  }
  //[PATCH] banAccount/:idAccount
  banAccountProcess(req, res, next) {
    switch (req.query._type) {
      case 'banAccount':
        AccountDetail.updateOne({ _id: req.params.idAccount }, {status: 'banned'})
        .then(()=>{
          res.redirect('back')})
        .catch(next)
        break;
      case 'removeBanAccount':
        AccountDetail.updateOne({ _id: req.params.idAccount }, {status: 'active'})
        .then(()=>{
          res.redirect('back')})
        .catch(next)  
        break;
      default:
        break;
    }
  }
}
module.exports = new AdminControllers();
