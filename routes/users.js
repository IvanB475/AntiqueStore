const express = require('express');
const router = express.Router();
require('../middleware/index')();
const userController = require("../controllers/users");

router.get("/signup", userController.getSignUp)
      .get("/login", userController.getLogin)
      .get("/settings", isUser, userController.getSettings)
      .get("/admin-register", isUser, userController.getAdminRegister)
      .get('/reset', userController.getReset)
      .get('/reset/:token', userController.getResetToken);

router.post("/signup", userController.postSignUp)
      .post("/login", userController.postLogin)
      .post("/admin-register", isUser, userController.postAdminRegister)
      .post("/settings", isUser, userController.postSettings)
      .post('/reset', userController.postReset)
      .post('/reset/:token', userController.postResetToken)
      .post("/logout", isUser, userController.postLogout);




module.exports = router;