const express = require('express');
const router = express.Router();
const landingController = require('../controllers/landing');



router.get("/", landingController.getLandingPage);

router.post('/', landingController.postInquiry);


module.exports = router;