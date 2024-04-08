class ErrorController{
    index(req, res ){
        res.status(404).send('404')
    }
}
module.exports = new ErrorController()