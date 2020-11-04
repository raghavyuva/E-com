const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    company: String,
    category: [],
    advertisement: Boolean,
    productimg: {
        type: String,
        required: true
    },
    discprice: Number,
    specs: {
        type: String,
        required: true
    },
    //  arrayofimg: [],
    saled: Number,
    colors: [],
    rating: Number,
    comments: [],
    likes: [],
    stock: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Products', ProductSchema);