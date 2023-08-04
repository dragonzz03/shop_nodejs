const express = require('express');
const router = express.Router();
const ProductController = require('../app/controllers/ProductControllers');

//Order Management router
router.use('/orderManagement/:id', ProductController.orderManagement);

//Show Product router
router.get('/productDetails/:id', ProductController.productDetails);
router.get('/allProduct', ProductController.showAllProduct);

//Add Product router
router.get('/addProduct', ProductController.addProduct);
router.post('/addProductSuscess', ProductController.addProductSuscess);

//Search Product router
router.get('/searchResults', ProductController.searchResults);

//Cart router
router.get('/cart', ProductController.cart);
router.post('/addToCart', ProductController.addToCart);

//Purchase Processing router
router.get('/checkout', ProductController.checkout);
router.get('/purchaseProcessing', ProductController.purchaseProcessing);

//Show Type Product router
router.get('/:type', ProductController.index);
router.get('/', ProductController.index);

module.exports = router;
