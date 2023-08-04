const express = require('express');
const router = express.Router();
const AdminControllers = require('../app/controllers/AdminControllers');

//Edit Categoty router
router.put('/:id/editCategoryProcess', AdminControllers.editCategoryProcessing);
router.get('/updateCategory/:id/editCategory', AdminControllers.editCategory);
router.get('/updateCategory/:id/deleteCategory',AdminControllers.deleteCategory);
router.get('/updateCategory', AdminControllers.updateCategory);

//Create Categoty router
router.get('/createCategory/success', AdminControllers.success);
router.get('/createCategory', AdminControllers.createCategory);

//Trash router
router.get('/trash', AdminControllers.trash);

//Add Product router
router.get('/addProduct', AdminControllers.addProduct);
router.post('/addProductSuscess', AdminControllers.addProductSuscess);

//Delete and Restore router
router.patch('/:id/restore', AdminControllers.restore);
router.delete('/:id/force', AdminControllers.forcedeleteCategory);
router.delete('/:id', AdminControllers.deleteCategory);

//Show dashboard for admin router
router.get('/', AdminControllers.index);

module.exports = router;
