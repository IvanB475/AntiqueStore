const fs = require('fs');

exports.deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw (err);
        }
    });
}

const ITEMS_PER_PAGE = 4;
exports.renderView = (res, noMatch, allBooks, page, totalItems) => {
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

exports.escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };
   
