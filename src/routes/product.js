const express = require('express');
const router = express.Router();
const ProductController = require('../app/controllers/ProductControllers');

router.use('/orderManagement/:id', ProductController.orderManagement);

router.get('/productDetails/:id', ProductController.productDetails);

router.get('/allProduct', ProductController.showAllProduct);


router.get('/addProduct', ProductController.addProduct);
router.post('/addProductSuscess', ProductController.addProductSuscess);

router.get('/searchResults', ProductController.searchResults);

router.get('/cart', ProductController.cart);
    
router.get('/checkout', ProductController.checkout);

router.post('/addToCart', ProductController.addToCart);

router.get('/:type', ProductController.index);

router.get('/', ProductController.index);

module.exports = router;
