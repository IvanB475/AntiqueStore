const express = require('express');
const router = express.Router();
require('../middleware/index')();
const cartController = require('../controllers/cart');



router.get("/cart", isUser, cartController.getCart)
      .get("/checkout", isUser, cartController.getCheckout);


router.post('/cart', isUser, cartController.postCart)
      .post('/CartRemove', isUser, cartController.postCartRemove);



module.exports = router;