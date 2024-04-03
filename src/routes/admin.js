const express = require('express');
const router = express.Router();
const AdminControllers = require('../app/controllers/AdminControllers');
// Ban account router
router.put('/banAccount/:idAccount', AdminControllers.banAccountProcess);

//Edit Categoty router
router.put('/:id/editCategoryProcess', AdminControllers.editCategoryProcessing);
router.get('/updateCategory/:id/editCategory', AdminControllers.editCategory);
router.get('/updateCategory/:id/deleteCategory',AdminControllers.deleteCategory);
router.get('/updateCategory', AdminControllers.updateCategory);

//Create Categoty router
router.get('/createCategory/success', AdminControllers.success);
router.get('/createCategory', AdminControllers.createCategory);

//Create Advertisement Management router
router.get('/advertisementManagement/success', AdminControllers.advertisementProcessing);
router.get('/advertisementManagement', AdminControllers.advertisement);

//Trash router
router.get('/trash', AdminControllers.trash);
//addAdvertisement router
router.get('/addAdvertisement', AdminControllers.addAdvertisement);
router.post('/addAdvertisementProcess', AdminControllers.addAdvertisementProcess);

//Trash router
router.get('/commentManagement', AdminControllers.commentManagement);

//Add Product router
router.post('/addProductSuscess', AdminControllers.addProductSuscess);

//Delete and Restore router
router.patch('/:id/restore', AdminControllers.restore);
router.delete('/:id/force', AdminControllers.forcedeleteCategory);
router.delete('/:id', AdminControllers.deleteCategory);

//Show dashboard for admin router
router.get('/', AdminControllers.index);

module.exports = router;
