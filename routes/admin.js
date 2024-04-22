const express=require('express');
const router=express.Router();

const { approveMed, acceptRequest, rejectRequest, getRequestById, getAllReq, donorCount, availbleMedicine } = require('../controllers/admin');

router.post('/approve',approveMed);
router.get('/getallreq',getAllReq)
router.get('/getreqbyid',getRequestById)
router.post('/accept',acceptRequest);
router.post('/reject',rejectRequest)
router.get('/countdonor',donorCount)
router.get('/availablemed',availbleMedicine)

module.exports = router;