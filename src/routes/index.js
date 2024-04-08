const formRouter = require('./form');
const siteRouter = require('./site');
const productRouter = require('./product');
const adminRouter = require('./admin');
const accountRouter = require('./account');
const evaluateRouter = require('./evaluate');
const error = require('./error');
function route(app) {
  app.use('/admin', adminRouter);
  app.use('/account', accountRouter);
  app.use('/form', formRouter);
  app.use('/product', productRouter);
  app.use('/evaluate', evaluateRouter);
  app.use('/', siteRouter);
  app.use(error);
}

module.exports = route;
