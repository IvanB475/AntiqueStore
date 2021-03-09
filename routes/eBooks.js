const express = require("express");
const router = express.Router();
require('../middleware/index')();
const eBookController = require('../controllers/eBooks');
const joiSchema = require('../middleware/joiSchemas');
const { validator, queryValidator } = require('../middleware/joiValidator');


router.get("/eBooks", validator(joiSchema.searchBook), eBookController.getEBooks)
      .get("/edit-eBook/:id", isAdmin, eBookController.getEditEBook)
      .get('/delete-eBook/:id', isAdmin, eBookController.deleteEBook)
      .get('/eBook-list', isUser, eBookController.getEBookList)
      .get("/eBooks/:id", eBookController.getEBook);
  

router.post('/edit-eBook/:id', isAdmin, validator(joiSchema.editBook), eBookController.editEBook);
  
  
  module.exports = router;