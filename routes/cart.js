const express = require('express');
const router = express.Router();
require('../middleware/index')();
const cartController = require('../controllers/cart');
const bodyParser = require('body-parser');

const parseJson = bodyParser.json();



router.get("/cart", isUser, cartController.getCart)
      .get("/checkout", isUser, cartController.getCheckout);


router.post('/cart', isUser, cartController.postCart)
      .post('/CartRemove', isUser, cartController.postCartRemove)
      .post('/createCheckoutSession', isUser, parseJson, cartController.createCheckoutSession);



module.exports = router;