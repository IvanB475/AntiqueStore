const express = require('express');
const router = express.Router();
const User = require("../models/user");

router.get("/signup", (req, res) => {
    res.render("users/signup",  {path: 'users/signup'});
})

router.get("/login", (req, res) => {
    res.render("users/login",  {path: 'users/login'});
})

router.get("/settings", (req,res) => {
    User.findById(req.user._id, (err, foundUser) => {
        if(err) {
            return res.redirect("/");
        } else {
            res.render("users/settings", {path: 'users/settings', user: foundUser})
        }
    })
});

router.get("/admin-register", (req, res) => {
    res.render("users/admin-register", {path: 'users/admin-register'})
});


router.get("/cart", (req, res, next) => {
    req.user.populate('cart.items.bookId').execPopulate().then(user => {
        const books = user.cart.items;
        res.render('users/cart', {
            path: '/cart',
            pageTitle: 'Vaša košarica',
            books: books
        });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
});

router.get("/checkout", (req,res, next) => {
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
});


router.get('/reset', (req, res, next) => {
    res.render('users/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: 'something went wrong'
    });
})


module.exports = router;