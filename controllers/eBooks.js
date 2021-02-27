const eBook = require("../models/eBook");
const ITEMS_PER_PAGE = 8;
const utils = require('../util/helper');

exports.getEBooks = (req,res,next) => {
    const page = +req.query.page || 1;
    let totalItems;
    let noMatch; 
   if(req.query.filter === "category"){
    const regex = new RegExp(utils.escapeRegex(req.query.sort), 'gi');
    eBook.find({"category": regex }, (err, allBooks) => {
      if(err){
        console.log(err);
      }
        utils.renderEBooks(res, noMatch, allBooks, page, totalItems);
    }) 
   }
   if(req.query.search) {
     const regex = new RegExp(utils.escapeRegex(req.query.search), 'gi');
  eBook.find({"title": regex }, (err, allBooks) => {
    if(allBooks.length < 1) {
      noMatch = "Search found no results";
    } 
      utils.renderEBooks(res, noMatch, allBooks, page, totalItems);
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