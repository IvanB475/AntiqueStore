const express = require("express");
const router = express.Router();
require('../middleware/index')();
const eBookController = require('../controllers/eBooks');


router.get("/eBooks", eBookController.getEBooks)
      .get("/eBooks/:id", eBookController.getEBook);
  
  
  
  
  module.exports = router;