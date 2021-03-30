const eBook = require("../models/eBook");
const ITEMS_PER_PAGE = 8;
const utils = require('../util/helper');

exports.getEBooks = (req,res,next) => {
    const page = +req.query.page || 1;
    let totalItems;
    let noMatch; 
      if(req.query.filter === "category"){
          const regex = new RegExp(utils.escapeRegex(req.query.sort), 'gi');
          eBook.find({ category: regex }).exec().then(allBooks => {
              utils.renderEBooks(res, noMatch, allBooks, page, totalItems);
          }).catch(err => {
              const error = new Error(err);
              error.httpStatusCode = 500;
              return next(error);
          });
      } else if(req.query.search) {
          const regex = new RegExp(utils.escapeRegex(req.query.search), 'gi');
          eBook.find({ title: regex }).exec().then(allBooks => {
              utils.renderEBooks(res, noMatch, allBooks, page, totalItems);
          }).catch(err => {
              const error = new Error(err);
              error.httpStatusCode = 500;
              return next(error);
          });
      } else {
          eBook.find().countDocuments().exec().then(numBooks => {
              totalItems = numBooks;
              return eBook.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
          }).then(allBooks => {
              utils.renderEBooks(res, noMatch, allBooks, page, totalItems);
          }).catch(err => {
              const error = new Error(err);
              error.httpStatusCode = 500;
              return next(error);
          });
      }
};


exports.getEBook = (req, res) => {
    eBook.findById(req.params.id).exec().then(foundBook => { 
          eBook.find({category: foundBook.category}).limit(5).exec().then(relatedBooks => {
              res.render("books/eBook-detail", {
                path: '/books/eBook/:id',
                eBook: foundBook,
                relatedBooks: relatedBooks
              })
          });
      }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      })
}
  
exports.getEditEBook = (req, res, next) => {
    const editMode = "eBook";
    if(!editMode) {
        return res.redirect('/');
    } else { 
        const bookId = req.params.id;
        eBook.findById(bookId).then(book => {
            if(!book) {
              return res.redirect('/books');
            } else {
              res.render('books/add-book', {
                pageTitle: 'Uredi sadržaj',
                path: '/edit-book/:id',
                editing: editMode,
                book: book,
                hasError: false,
                errorMessage: null,
                validationErrors: []
              });
            }
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
    }
};
  
  
exports.editEBook = (req, res) => {
    const update = { title: req.body.title, price: req.body.price, imageUrl: req.file.path, description: req.body.description, category: req.body.category, autor: req.body.autor};
    eBook.findByIdAndUpdate(req.body.bookId, update).exec().then(() => {
            res.redirect('/books');
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}


exports.deleteEBook = (req,res, next) => {
    const bookId = req.params.id;
    eBook.findById(bookId).exec().then(book => {
        if(!book) {
          return next(new Error('Book not found'));
        } else { 
          utils.deleteFile(book.imageUrl);
          return eBook.deleteOne({_id: bookId});
        }
    }).then(() => {
        console.log("BOOK DELETED");
        res.redirect("/eBooks");
    }).catch(err => {
        res.status(500).json({ message: "Brisanje nije uspjelo"});
    })
}
  
exports.getEBookList = (req, res, next) => {
  res.send("Coming soon");
};
