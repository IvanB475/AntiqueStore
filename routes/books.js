const express = require("express");
const router = express.Router();
const eBook = require('../models/eBook');
require('../middleware/index')();
const bookController = require('../controllers/books');

const ITEMS_PER_PAGE = 4;


router.get("/books", bookController.getBooks)
      .get("/books/:id", bookController.getBook)
      .get("/add-book", isAdmin, bookController.getAddBook)
      .get("/edit-book/:id", isAdmin, bookController.getEditBook)
      .get('/delete-book/:id', isAdmin, bookController.deleteBook);


router.post('/add-book', isAdmin, bookController.addBook)
      .post('/edit-book/:id', isAdmin, bookController.editBook); 








// eBooks section



router.get("/eBooks", (req,res,next) => {
  const page = +req.query.page || 1;
  let totalItems;
  let noMatch; 
 if(req.query.sort){
  const regex = new RegExp(escapeRegex(req.query.sort), 'gi');
  eBook.find({"category": regex }, (err, allBooks) => {
    if(allBooks.length < 1) {
      noMatch = "Search found no results";
    }
    res.render("books/eBooks", {
      noMatch: noMatch,
      prods: allBooks,
      pageTitle: 'eBooks',
      path: '/eBooks',
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    })
  }) 
 }
 if(req.query.search) {
   const regex = new RegExp(escapeRegex(req.query.search), 'gi');
eBook.find({"title": regex }, (err, allBooks) => {
  if(allBooks.length < 1) {
    noMatch = "Search found no results";
  } 
  res.render("books/eBooks", {
    noMatch: noMatch,
    prods: allBooks,
    pageTitle: 'eBooks',
    path: '/eBooks',
    currentPage: page,
    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
  })
}) 
} else {
eBook.find()
  .countDocuments()
  .then(numBooks => {
    totalItems = numBooks;
    console.log(numBooks);
    return eBook.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
  }) 
  .then(allBooks => {
      res.render("books/eBooks", {
        noMatch: noMatch,
        prods: allBooks,
        pageTitle: 'eBooks',
        path: '/eBooks',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      })
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}
});

router.get("/eBooks/:id", (req, res) => {
  eBook.findById(req.params.id).exec((err, foundBook) => {
    if(err) {
     console.log(err);
    } else {
      eBook.find({category: foundBook.category}, (err, relatedBooks) => {
        console.log(relatedBooks);
      res.render("books/eBook-detail", {
        path: '/books/eBook/:id',
        eBook: foundBook,
        relatedBooks: relatedBooks
      })
    })
    }
  })
})

router.get("/add-eBook", isAdmin, (req, res) =>{
  res.render("books/add-eBook", {
      path: '/add-eBook',
      editing: false,
      hasError: false,
      errorMessage: null,
      validationErrors: []
  })
});





module.exports = router;