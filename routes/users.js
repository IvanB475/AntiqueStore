const express = require('express');
const router = express.Router();
require('../middleware/index')();
const userController = require("../controllers/users");
const joiSchema = require('../middleware/joiSchemas');
const { validator } = require('../middleware/joiValidator');

router.get("/signup", userController.getSignUp)
      .get("/login", userController.getLogin)
      .get("/settings", isUser, userController.getSettings)
      .get("/admin-register", isUser, userController.getAdminRegister)
      .get('/reset', userController.getReset)
      .get('/reset/:token', userController.getResetToken);

router.post("/signup", validator(joiSchema.signup), userController.postSignUp)
      .post("/login", toLowerCase, validator(joiSchema.login), userController.postLogin)
      .post("/admin-register", isUser, validator(joiSchema.adminRegister), userController.postAdminRegister)
      .post("/settings", isUser, validator(joiSchema.settings), userController.postSettings)
      .post('/reset', validator(joiSchema.forgotPW), userController.postReset)
      .post('/reset/:token', userController.postResetToken)
      .post("/logout", isUser, userController.postLogout);




module.exports = router;