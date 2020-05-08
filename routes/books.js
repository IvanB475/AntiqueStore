const express = require("express");
const router = express.Router();
const Book = require('../models/book');
const fileHelper = require('../util/file');
const eBook = require('../models/eBook');

const ITEMS_PER_PAGE = 4;

router.get("/books", (req,res,next) => {
    const page = +req.query.page || 1;
    let totalItems;
    let noMatch; 
   if(req.query.sort){
    const regex = new RegExp(escapeRegex(req.query.sort), 'gi');
    Book.find({"category": regex }, (err, allBooks) => {
      if(err){
        console.log(err);
      }
        Render(res, noMatch, allBooks, page, totalItems);
    }) 
   }
   if(req.query.search) {
     const regex = new RegExp(escapeRegex(req.query.search), 'gi');
  Book.find({"title": regex }, (err, allBooks) => {
    if(allBooks.length < 1) {
      noMatch = "Search found no results";
    } 
      Render(res, noMatch, allBooks, page, totalItems);
  }) 
} else {
  Book.find()
    .countDocuments()
    .then(numBooks => {
      totalItems = numBooks;
      return Book.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    }) 
    .then(allBooks => {
      Render(res, noMatch, allBooks, page, totalItems);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
});

router.get("/add-book", (req, res) =>{
    res.render("books/add-book", {
        path: '/add-book',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
})


router.get("/books/:id", (req, res) => {
  Book.findById(req.params.id).exec((err, foundBook) => {
    if(err) {
     console.log(err);
    } else {
      Book.find({category: foundBook.category}, (err, relatedBooks) => {
        console.log(relatedBooks);
      res.render("books/book-detail", {
        path: '/books/:id',
        book: foundBook,
        relatedBooks: relatedBooks
      })
    })
    }
  })
})


router.get("/edit-book/:id", (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode) {
    return res.redirect('/');
  }
  const bookId = req.params.id;
  console.log(bookId);
  Book.findById(bookId).then(book => {
    if(!book) {
      return res.redirect('/books');
    }
    res.render('books/add-book', {
      pageTitle: 'Uredi sadržaj',
      path: '/edit-book/:id',
      editing: editMode,
      book: book,
      hasError: false,
      errorMessage: null,
      validationErrors: []
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
})

router.get('/delete-book/:id', (req,res, next) => {
  const bookId = req.params.id;
  console.log("book id found: " + req.params.id);
  Book.findById(bookId).then(book => {
    if(!book) {
      return next(new Error('Book not found'));
    }
    fileHelper.deleteFile(book.imageUrl);
    return Book.deleteOne({_id: bookId});
  }).then(() => {
    console.log("BOOK DELETED");
    res.status(200).json({ message: "Obrisano!"});
  }).catch(err => {
    res.status(500).json({ message: "Brisanje nije uspjelo"});
  })
})



// eBooks section



router.get("/eBooks", (req,res,next) => {
  const page = +req.query.page || 1;
  let totalItems;
  let noMatch; 
 if(req.query.sort){
  const regex = new RegExp(escapeRegex(req.query.sort), 'gi');
  eBook.find({"category": regex }, (err, allBooks) => {
    if(err){
      console.log(err);
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

router.get("/books/eBook/:id", (req, res) => {
  eBook.findById(req.params.id).exec((err, foundBook) => {
    if(err) {
     console.log(err);
    } else {
      eBook.find({category: foundBook.category}, (err) => {
        console.log(relatedBooks);
      res.render("books/eBook", {
        path: '/books/eBook/:id',
        book: foundBook
      })
    })
    }
  })
})


function Render(res, noMatch, allBooks, page, totalItems)  {
  res.render("books/books", {
    noMatch: noMatch,
    prods: allBooks,
    pageTitle: 'Books',
    path: '/books',
    currentPage: page,
    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
  })
}

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;