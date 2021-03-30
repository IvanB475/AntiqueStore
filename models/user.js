const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    username: String,
    email: {
        type: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    password: {
        type: String
    },
    status: {
        type: String
    },
    cart: {
        items: [
          {
            bookId: {
              type: Schema.Types.ObjectId,
              refPath: 'cart.items.bookIdModel',
              required: true
            },
            bookIdModel: {
                type: String,
                required: true,
                enum: ['Book', 'eBook']
            },
            quantity: { type: Number, required: true }
          }
        ]
      },
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.methods.addToCart = function(book, bookType) {
    const cartBookIndex = this.cart.items.findIndex(cp => {
        return cp.bookId.toString() === book._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if(cartBookIndex >= 0) {
        newQuantity = this.cart.items[cartBookIndex].quantity + 1;
        updatedCartItems[cartBookIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            bookId: book._id,
            quantity: newQuantity,
            bookIdModel: bookType
        })
    }

    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
}

UserSchema.methods.removeFromCart = function(bookId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.bookId._id.toString() !== bookId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};


module.exports = mongoose.model('User', UserSchema);