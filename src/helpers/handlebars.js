
const Handlebars = require('handlebars')

module.exports = {

        sum: (a, b) => a + b,
        total: (a, b) => a * b,

        totalPrice: (unitPrice) =>{
          let values = Object.values(unitPrice)
          let sum = 0
          for (let i = 0; i < values[0].length; i++) {
            const product = parseInt(values[0][i]) * parseInt(values[1][i]); // Đảm bảo chuyển đổi thành số nguyên
            sum += product;
          }
          return sum
        },


        times: (n, block) => {
          let accum = '';
          for (let i = 0; i < n; ++i) {
            accum += block.fn(i);
          }
          return accum;
        
        },
        likeBtn: (idComment, status) =>{
          const likeType = status ==='like'|| status ==='liked' ? status : 'default';
          const icons = {
            default: '',
            like: '',
            liked: '-fill',
  
          }
          const types = {
            default: 'liked',
            like: 'liked',
            liked: 'like',
          }
  
  
  
          const icon = icons[likeType]
          const type = types[likeType]

          const href = Handlebars.escapeExpression(`?_likeComment&idComment=${idComment}&type=${type}`)
          const output = `<a href="${href}">
                  <i class="bi bi-hand-thumbs-up${icon}"></i>
                  </a>`
          return new Handlebars.SafeString(output);
  
  
       
        },
        disLikeBtn: (idComment, status) =>{
            const disLikeType = status ==='dislike'|| status ==='disliked'? status : 'default';
            const icons = {
                default: '',
                dislike: '',
                disliked: '-fill',
    
            }
            const types = {
                default: 'disliked',
                dislike: 'disliked',
                disliked: 'dislike',
            }
    
            const icon = icons[disLikeType]
            const type = types[disLikeType]

            const href = Handlebars.escapeExpression(`?_likeComment&idComment=${idComment}&type=${type}`)
    
    
            const output = `<a href="${href}">
                    <i class="bi bi-hand-thumbs-down${icon}"></i>
                    </a>`
            return new Handlebars.SafeString(output);
  
        },
        checkIdComment: (idComment, isIdComment) =>{
          return idComment == isIdComment? true: false
        },
        showUpdateStatusAccountBtn: (preStatus, type) =>{ 
          const textBtn = {
            banned: 'Active',
            active: 'Ban'
          }
          const modalBtn = {
            banned: 'remove-ban-account-modal',
            active: 'ban-account-modal'
          }
          const data ={
            textBtn,
            modalBtn
          }
          return data[type][preStatus]
        },

       


  
     
}