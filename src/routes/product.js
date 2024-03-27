const express = require('express');
const router = express.Router();
const ProductController = require('../app/controllers/ProductControllers');

//Order Management router
router.delete('/orderManagement/deleteOrderedProducts/:idProductDelete', ProductController.deleteOrderedProducts);
router.use('/orderManagement/:id', ProductController.orderManagement);

//Show Product router
//router.get('/productDetails/:id/_likeComment', ProductController.likeComment);
router.get('/productDetails/:id', ProductController.productDetails);
router.get('/allProduct', ProductController.showAllProduct);

//Add Product router
router.get('/addProduct', ProductController.addProduct);
router.post('/addProductSuscess', ProductController.addProductSuscess);

//Search Product router
router.get('/searchResults', ProductController.searchResults);

//Cart router
router.get('/cart/checkout/:cartIds/:quantity', ProductController.checkOutFromCart);
router.post('/cart/buy/:idProduct', ProductController.checkOutFromCart)
router.post('/cart/like/:idProduct', ProductController.likeFromCart)
router.post('/cart/delete/:idProduct', ProductController.deleteCartProduct)
router.delete('/cart/:idProduct', ProductController.deleteCartProduct)
router.get('/cart/checkOut/:idCart', ProductController.deleteCartProduct)
router.post('/addToCart/:idProduct/:quantityToBuy', ProductController.addToCart);
router.get('/cart', ProductController.cart);


//Purchase Processing router
router.get('/checkout/:idProduct/:quantityToBuy', ProductController.checkOut);
router.post('/purchaseProcessing', ProductController.purchaseProcessing);

//Show Type Product router
router.get('/:type', ProductController.index);
router.get('/', ProductController.index);

module.exports = router;
