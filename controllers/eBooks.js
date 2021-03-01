const eBook = require("../models/eBook");
const ITEMS_PER_PAGE = 8;
const utils = require('../util/helper');

exports.getEBooks = (req,res,next) => {
    const page = +req.query.page || 1;
    let totalItems;
    let noMatch; 
     if(req.query.filter === "category"){
    const regex = new RegExp(utils.escapeRegex(req.query.sort), 'gi');
      eBook.find({ category: regex })
    .then(allBooks => {
       utils.renderEBooks(res, noMatch, allBooks, page, totalItems);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
   }
   else if(req.query.search) {
     const regex = new RegExp(utils.escapeRegex(req.query.search), 'gi');
    eBook.find({ title: regex })
    .then(allBooks => {
       utils.renderEBooks(res, noMatch, allBooks, page, totalItems);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
      utils.renderEBooks(res, noMatch, allBooks, page, totalItems);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  }
  };


exports.getEBook = (req, res) => {
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
  }
  
  exports.getEditEBook = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
      return res.redirect('/');
    }
    const bookId = req.params.id;
    eBook.findById(bookId).then(book => {
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
  };
  
  
  exports.editEBook = (req, res) => {
    const update = { title: req.body.title, price: req.body.price, imageUrl: req.file.path, description: req.body.description, category: req.body.category, autor: req.body.autor};
    eBook.findByIdAndUpdate(req.body.bookId, update, (err) => {
        if(err) {
            res.redirect("/");
        } else {
            res.redirect('/books');
        }
    })
}

exports.deleteEBook = (req,res, next) => {
    const bookId = req.params.id;
    eBook.findById(bookId).then(book => {
      if(!book) {
        return next(new Error('Book not found'));
      }
      utils.deleteFile(book.imageUrl);
      return Book.deleteOne({_id: bookId});
    }).then(() => {
      console.log("BOOK DELETED");
      res.status(200).json({ message: "Obrisano!"});
    }).catch(err => {
      res.status(500).json({ message: "Brisanje nije uspjelo"});
    })
  }
  
exports.getEBookList = (req, res, next) => {
  res.send("Coming soon");
};
