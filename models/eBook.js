const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eBookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    category: [String],
    autor: String,
    imageUrl: { 
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('eBook', eBookSchema);