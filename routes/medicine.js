const express=require('express');
const { addMed, getAllMed, getMedById, requestMed, getmedbyid  } = require('../controllers/medicine');
const router=express.Router();

router.post('/addmed',addMed);
router.get('/getallmeds',getAllMed);
router.get('/getmedbyid',getMedById);
router.post('/requestmed',requestMed);
router.get('/getmed/:id',getmedbyid);

module.exports = router;