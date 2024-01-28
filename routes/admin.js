const express=require('express');
const router=express.Router();

const { approveMed, acceptRequest, rejectRequest, getRequestById, getAllReq } = require('../controllers/admin');

router.post('/approve',approveMed);
router.get('/getallreq',getAllReq)
router.get('/getreqbyid',getRequestById)
router.post('/accept',acceptRequest);
router.post('/reject',rejectRequest)

module.exports = router;