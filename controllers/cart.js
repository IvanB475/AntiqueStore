const Book = require('../models/book');
const eBook = require('../models/eBook');





exports.postCart = (req, res, next) => {
    const bookId = req.body.bookId;
    Book.findById(bookId).then(book => {
        return req.user.addToCart(book);
    }).then(result => {
        res.redirect('/cart');
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
  };
  
  exports.postCartEBook = (req, res, next) => {
    const bookId = req.body.bookId;
    eBook.findById(bookId).then(book => {
        return req.user.addToCart(book);
    }).then(result => {
        res.redirect('/cart');
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
  };
  
  exports.postCartRemove = (req,res, next) => {
    const bookId = req.body.bookId;
    req.user.removeFromCart(bookId).then(result => {
        res.redirect('/cart');
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
  }

  exports.getCheckout = (req,res, next) => {
    req.user.populate('cart.items.bookId').execPopulate().then(user => {
        const books = user.cart.items;
        let totalPrice = 0;
        books.forEach(b => {
            totalPrice += b.quantity * b.bookId.price;
        })
        res.render('users/checkout', {
            path: '/checkout',
            pageTitle: 'Vaša košarica',
            books: books,
            totalPrice: totalPrice
        });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
  }
  
  exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.bookId').execPopulate().then(user => {
        const books = user.cart.items;
        const updatedBooks = [];
        books.forEach(bookId => {
                if(bookId.bookId === null) {
        user.removeFromCart(bookId._id);
                } else {
                    updatedBooks.push(bookId);
                }
        })
        res.render('users/cart', {
            path: '/cart',
            pageTitle: 'Vaša košarica',
            books: updatedBooks
        });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
  }