const mongoose = require('mongoose');
const CartSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    useremail: {
        type: String,
        required: true
    },
    product: []
}, {
    timestamps: true
});

module.exports = mongoose.model('Carts', CartSchema);