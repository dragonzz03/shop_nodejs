const Comment = require('../model/Comment');
const Evaluate = require('../model/Evaluates');
const Product = require('../model/Products');
const { calculateAverageRating } = require('../../util/evaluate');
class EvaluateControllers {
    addCommentProcess(req, res, next) {
        var infoComment = req.params
        infoComment.idUser = req.session.idUser
        infoComment.nameUser = req.session.accountName
        infoComment.imageUser = req.session.image
        const comment = new Comment(infoComment);
        comment
          .save()
          .then(() => res.redirect('back'))
          .catch(next);
    }
    evaluateProcess(req, res, next) {
        var infoEvaluate = req.body
        infoEvaluate.idUser = req.session.idUser
        infoEvaluate.nameUser = req.session.accountName
        infoEvaluate.imageUser = req.session.image
        var averageRatingInfo ={}
        averageRatingInfo.evaluate = parseInt(infoEvaluate.evaluate) 
        averageRatingInfo = [averageRatingInfo]
        const evaluate = new Evaluate(infoEvaluate);
        evaluate
          .save()
          .then(() => {
            Evaluate.find({idProduct: infoEvaluate.idProduct}, 'evaluate -_id')
            .then((evaluate)=>{
              averageRatingInfo = averageRatingInfo.concat(evaluate)
              return calculateAverageRating(averageRatingInfo)              
            })
            .then((newEvaluate) =>{
              Product.updateOne({_id: infoEvaluate.idProduct}, {evaluate: newEvaluate})
              .then(()=>{
                res.redirect('back')
              })
              .catch(next)
            }) 
          })
          .catch(next);
    }
}
module.exports = new EvaluateControllers