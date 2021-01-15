const express = require('express');
const router = express.Router;
require('../middleware/index')();
const cartController = require('../controllers/cart');



router.get("/cart", isUser, userController.getCart)
      .get("/checkout", isUser, userController.getCheckout);


router.post('/cart', isUser, cartController.postCart)
      .post('/cart-eBook', isUser, cartController.postCartEBook)
      .post('/CartRemove', isUser, cartController.postCartRemove);