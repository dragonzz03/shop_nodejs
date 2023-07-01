

class FormController {
    index(req, res) {
        res.render('form')
    }
    show(req, res) {
        res.render('product')
    }
}
module.exports = new FormController