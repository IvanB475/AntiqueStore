const express = require("express");
const router = express.Router();
require('../middleware/index')();
const eBookController = require('../controllers/eBooks');


router.get("/eBooks", eBookController.getEBooks)
      .get("/edit-eBook/:id", isAdmin, eBookController.getEditEBook)
      .get('/delete-eBook/:id', isAdmin, eBookController.deleteEBook)
      .get("/eBooks/:id", eBookController.getEBook);
  

router.post('/edit-eBook/:id', isAdmin, eBookController.editEBook);
  
  
  module.exports = router;