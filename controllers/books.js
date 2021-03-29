const Book = require("../models/book");
const eBook = require("../models/eBook");
const { validationResult } = require('express-validator');
const utils = require("../util/helper");

const ITEMS_PER_PAGE = 16;

exports.getAddBook = async (req, res) => {
    res.render("books/add-book", {
        path: '/add-book',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
};

exports.addBook = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const category = req.body.category;
    const autor = req.body.autor;
    const description = req.body.description; 
    const bookType = req.body.bookType === 'Book' ? 'Book' : 'eBook';
    if(!image) {
        return utils.renderError(res, title, price, description, autor, category);
    }

    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return utils.renderError(res, title, price, description, autor, category);
    }

    const imageUrl = image.path;
    if(bookType === 'Book') { 
      const book = new Book({
          title: title,
          price: price,
          description: description,
          category: category,
          autor: autor,
          imageUrl: imageUrl,
          userId: req.user
      });
      book.save().then(() => {
          res.redirect('/books');

      }).catch( err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
      })
    } else {
      const book = new eBook({
          title: title,
          price: price,
          description: description,
          category: category,
          autor: autor,
          imageUrl: imageUrl,
          userId: req.user
      });
      book.save().then(result => {
          console.log('eBook added!');
          res.redirect('/eBooks');

      }).catch( err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
      })
    }
}

exports.getBooks = (req,res,next) => {
    const page = +req.query.page || 1;
    let totalItems;
    let noMatch; 
    if(req.query.filter === "category"){
      const regex = new RegExp(utils.escapeRegex(req.query.sort), 'gi');
      Book.find({ category: regex }).then(allBooks => {
          utils.renderView(res, noMatch, allBooks, page, totalItems);
      })
      .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
      });
    }
    else if(req.query.search) {
      const regex = new RegExp(utils.escapeRegex(req.query.search), 'gi');
      Book.find({ title: regex }).then(allBooks => {
          utils.renderView(res, noMatch, allBooks, page, totalItems);
      })
      .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
      });
    } else {
      Book.find().countDocuments().then(numBooks => {
          totalItems = numBooks;
          return Book.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
      }) 
      .then(allBooks => {
          utils.renderView(res, noMatch, allBooks, page, totalItems);
      })
      .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
      });
    }
};

exports.getBook = (req, res) => {
    Book.findById(req.params.id).exec((err, foundBook) => {
      if(err) {
          console.log(err);
      } else {
        Book.find({category: foundBook.category}).limit(5).then(relatedBooks => {
            res.render("books/book-detail", {
              path: '/books/:id',
              book: foundBook,
              relatedBooks: relatedBooks
            })
        })
      }
    })
}

exports.getEditBook = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
      return res.redirect('/');
    }
    const bookId = req.params.id;
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
  };

exports.editBook = (req, res) => {
    const update = { title: req.body.title, price: req.body.price, imageUrl: req.file.path, description: req.body.description, category: req.body.category, autor: req.body.autor};
    Book.findByIdAndUpdate(req.body.bookId, update, (err) => {
      if(err) {
          res.redirect("/");
      } else {
          res.redirect('/books');
      }
    })
}

exports.deleteBook = (req,res, next) => {
    const bookId = req.params.id;
    Book.findById(bookId).then(book => {
      if(!book) {
          return next(new Error('Book not found'));
      } else { 
          utils.deleteFile(book.imageUrl);
          return Book.deleteOne({_id: book._id});
      }
    }).then(() => {
      res.redirect("/books");
    }).catch(err => {
      res.status(500).json({ message: "Brisanje nije uspjelo"});
    })
  }

