const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types
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
    saled: Number,
    colors: [],
    rating: Number,
    likes: [{
        type: ObjectId,
        ref: 'Userdata'
    }],
    comments: [{
        text: String,
        postedBy: { type: ObjectId, ref: 'Userdata' }
    }],
    stock: Number,
    postedBy: {
        type: ObjectId,
        ref: 'Userdata'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Products', ProductSchema);