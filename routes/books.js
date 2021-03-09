const express = require("express");
const router = express.Router();
require('../middleware/index')();
const bookController = require('../controllers/books');
const joiSchema = require('../middleware/joiSchemas');
const { validator, queryValidator } = require('../middleware/joiValidator');



router.get("/books", queryValidator(joiSchema.searchBook), bookController.getBooks)
      .get("/books/:id", bookController.getBook)
      .get("/add-book", isAdmin, bookController.getAddBook)
      .get("/edit-book/:id", isAdmin, bookController.getEditBook)
      .get('/delete-book/:id', isAdmin, bookController.deleteBook);


router.post('/add-book', isAdmin, validator(joiSchema.addBook), bookController.addBook)
      .post('/edit-book/:id', isAdmin, validator(joiSchema.editBook), bookController.editBook);




module.exports = router;