const fs = require('fs');

exports.deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw (err);
        }
    });
}


exports.renderView = (res, noMatch, allBooks, page, totalItems) => {
        const ITEMS_PER_PAGE = 16;
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
};

exports.renderError = (res, title, price, description, autor, category) => {
    res.render('books/add-book', {
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
    errorMessage: 'Error has occured, please make sure to fill in all required fields and upload image.',
    validationErrors:  []
});
}


exports.renderEBooks =  (res, noMatch, allBooks, page, totalItems) => {
    const ITEMS_PER_PAGE = 8;
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
}


exports.escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };
   
