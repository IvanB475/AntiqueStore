const express = require("express");
const router = express.Router();
require('../middleware/index')();
const bookController = require('../controllers/books');



router.get("/books", bookController.getBooks)
      .get("/books/:id", bookController.getBook)
      .get("/add-book", isAdmin, bookController.getAddBook)
      .get("/edit-book/:id", isAdmin, bookController.getEditBook)
      .get('/delete-book/:id', isAdmin, bookController.deleteBook);


router.post('/add-book', isAdmin, bookController.addBook)
      .post('/edit-book/:id', isAdmin, bookController.editBook);




module.exports = router;