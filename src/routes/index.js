const formRouter = require('./form')


function route(app) {

    app.get('/', (req, res) => {
        console.log(req.body)
        res.render('home');
    })

    app.use('/form', formRouter)

}

module.exports = route;