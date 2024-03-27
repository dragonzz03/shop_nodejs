const CountLike = require('../model/CountLike')
const CountDislike = require('../model/CountDislike')
const LikeList  = require('../model/LikeList')
const Comment  = require('../model/Comment')



module.exports =  function likeComment(req, res, next){
    const isValidType = ['like','liked','dislike','disliked']
    res.locals.alert = false
    res.locals.message = {
        warning: '',
        atag: '',
        idComment: '',
    };

    
    if(req.query.hasOwnProperty("_likeComment")){
      const previousUrl = req.header('referer')
      const idComment = req.query.idComment
      if (req.session.idUser) {
        const idUser = req.session.idUser
        const type = req.query.type
        if (isValidType.includes(type)) {
          if(type === 'liked' || type === 'disliked' ){
            LikeList.findOneAndUpdate(
              {
                idUser: idUser
              },
              {
                $set: {[`listLikeComment.${idComment}`]
                :{
                  idComment: idComment, 
                  type: type
                }
              }},
              {
                upsert: true, 
                new: true}

            )
            .then(() =>{
              console.log('add like list suscess')
            })
            .catch(next)
            switch (type) {
              case 'liked':
                Promise.all([
                  CountLike.findOneAndUpdate(
                    { 
                      idComment: idComment,
                      idUser: idUser 
                    }, // Điều kiện tìm kiếm
                    { 
                      $setOnInsert: { 
                        idComment: idComment, 
                        idUser: idUser 
                      }}, // Thiết lập giá trị nếu không tìm thấy
                    { 
                      upsert: true, 
                      new: true 
                    }
                    ),
                  CountDislike.findOneAndDelete(
                    {
                      idUser: idUser, 
                      idComment: idComment 
                    },
                  )

                ])
              .then(() =>{
                console.log('add CountLike suscess')
              })
              .catch(next)
                
                break;
            
              case 'disliked':
            
                Promise.all([
                  CountDislike.findOneAndUpdate(
                    { 
                      idComment: idComment,
                      idUser: idUser }, 
                    { 
                      $setOnInsert: { 
                      idComment: idComment,
                      idUser: idUser 
                    }},
                    { upsert: true, new: true }
                    ),
                  CountLike.findOneAndDelete(
                    {
                      idUser: idUser, 
                      idComment: idComment 
                    },
                  )
                ])
                .then(() =>{
                  console.log('suscess')
                })
                .catch(next)
                
                break;
            
              default:
                break;
            }
          
          }
          else {
            const toDelete = type + 'd'
            LikeList.findOneAndUpdate(
              { 
                idUser: idUser, 
                [`listLikeComment.${idComment}.type`]: toDelete 
              },
              { 
                $unset: {
                  [`listLikeComment.${idComment}`]: 1
                } 
              },

            )
            .then(() =>{
              console.log('suscess')
            })
            .catch(next)
            
            switch (type) {
              case 'like':
                CountLike.findOneAndDelete(
                  {
                    idUser: idUser, 
                    idComment: idComment 
                  },
                )
                .then(() =>{
                  console.log('suscess')
                })
                .catch(next)
  
                break;
              case 'dislike':
                CountDislike.findOneAndDelete(
                  {
                    idUser: idUser, 
                    idComment: idComment 
                  },
                )
                .then(() =>{
                  console.log('suscess')
                })
                .catch(next)
                
                break;
            
              default:
                break;
            }
          }

            //Count Like and Dislike
          Promise.all([CountLike.countDocuments({ idComment: idComment }), 
                      CountDislike.countDocuments({ idComment: idComment })])
                      .then(([countLike, countDislike])=>{
                        Promise.all([
                          Comment.findByIdAndUpdate(
                            idComment,
                            { 
                              like: countLike 
                            },
                            { 
                              new: true 
                            },
                          ),
                          Comment.findByIdAndUpdate(
                            idComment,
                            { 
                              dislike: countDislike 
                            },
                            { 
                              new: true 
                            },
                          )
                      ])
                      .then(() =>{
                        console.log('update countlike and dislike suscess')
                      })
                      .catch(next)
                      })

        }  
        
        res.redirect(previousUrl);
      } 
      else {
        res.locals.alert = true;
        res.locals.message.warning = 'You are not logged in';
        res.locals.message.atag = 'Sign in to interact';
        res.locals.message.idComment = idComment;

      }
      
    
    }
    else {
      

    }

    next()
}
