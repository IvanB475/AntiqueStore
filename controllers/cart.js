const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.stripe);



exports.postCart = (req, res, next) => {
    const bookId = req.body.bookId;
    const bookType = req.body.bookType;
    mongoose.model(bookType).findById(bookId).then(book => {
        return req.user.addToCart(book, bookType);
    }).then(() => {
        res.redirect('/cart');
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
};
  
  
exports.postCartRemove = (req,res, next) => {
    const bookId = req.body.bookId;
    req.user.removeFromCart(bookId).then(() => {
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

  exports.createCheckoutSession = (req, res) => {
    const DOMAIN = process.env.PORT && process.env.HOST ? `${process.env.HOST}/${process.env.PORT}` : 'http://localhost:8081';
    stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'hrk',
            product_data: {
              name: 'Vaša narudžba',
              images: ['https://st2.depositphotos.com/1105977/5461/i/600/depositphotos_54615585-stock-photo-old-books-on-wooden-table.jpg'],
            },
            unit_amount: req.body.totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${DOMAIN}/books`,
      cancel_url: `${DOMAIN}/eBook`,
    }).then(session => {
        res.json({ id: session.id });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(err);
    })
  }