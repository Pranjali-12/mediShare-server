const express=require('express');
const { addMed, getAllMed, getMedById, requestMed } = require('../controllers/medicine');
const router=express.Router();

router.post('/addmed',addMed);
router.get('/getallmeds',getAllMed);
router.get('/getmedbyid',getMedById);
router.get('/requestmed',requestMed);

module.exports = router;