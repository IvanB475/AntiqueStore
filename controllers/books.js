const express = require('express');
const router = express.Router();
const Book = require("../models/book");
const { validationResult } = require('express-validator');


router.post('/add-book', (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const category = req.body.category;
    const autor = req.body.autor;
    const description = req.body.description; 
    if(!image) {
        return res.status(422).render('books/add-book', {
            pageTitle: 'Dodaj knjigu',
            path: '/add-book',
            editing: false,
            hasError: true,
            book: {
                title: title,
                price: price,
                description: description,
                autor: autor,
                category: category
            },
            errorMessage: 'Attached file is not an image.',
            validationErrors:  []
        });
    }

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.render('books/add-book', {
            pageTitle: 'Dodaj knjigu',
            path: '/add-book',
            editing: false,
            hasError: true,
            book: {
                title: title,
                price: price,
                category: category,
                autor: autor,
                description: description
            }, errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    const imageUrl = image.path;

    const book = new Book({
        title: title,
        price: price,
        description: description,
        category: category,
        autor: autor,
        imageUrl: imageUrl,
        userId: req.user
    });
    book.save().then(result => {
        console.log('Book added!');
        res.redirect('/books');

    }).catch( err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
})

router.post('/edit-book/:id', (req, res) => {
    const update = { title: req.body.title, price: req.body.price, imageUrl: req.file.path, description: req.body.description, category: req.body.category, autor: req.body.autor};
    console.log(update);
    Book.findByIdAndUpdate(req.body.bookId, update, (err) => {
        if(err) {
            res.redirect("/");
        } else {
            res.redirect('/books');
        }
    })
})


module.exports = router;