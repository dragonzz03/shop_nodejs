const formRouter = require('./form');
const siteRouter = require('./site');
const productRouter = require('./product');
const adminRouter = require('./admin');
const accountRouter = require('./account');

function route(app) {
  app.use('/', siteRouter);
  app.use('/admin', adminRouter);
  app.use('/account', accountRouter);
  app.use('/form', formRouter);
  app.use('/product', productRouter);
}

module.exports = route;
