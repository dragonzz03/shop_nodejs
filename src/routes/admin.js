const express = require('express');
const router = express.Router();
const AdminControllers = require('../app/controllers/AdminControllers');

router.put('/:id/editCategoryProcess', AdminControllers.editCategoryProcessing);

router.get('/updateCategory/:id/editCategory', AdminControllers.editCategory);
router.get(
  '/updateCategory/:id/deleteCategory',
  AdminControllers.deleteCategory
);

router.get('/createCategory/success', AdminControllers.success);
router.get('/createCategory', AdminControllers.createCategory);
router.get('/updateCategory', AdminControllers.updateCategory);
router.get('/trash', AdminControllers.trash);

router.get('/addProduct', AdminControllers.addProduct);
router.post('/addProductSuscess', AdminControllers.addProductSuscess);

router.patch('/:id/restore', AdminControllers.restore);
router.delete('/:id/force', AdminControllers.forcedeleteCategory);
router.delete('/:id', AdminControllers.deleteCategory);
router.get('/', AdminControllers.index);

module.exports = router;
