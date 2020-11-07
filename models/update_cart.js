const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types
const CartSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    useremail:String,
    product: []
}, {
    timestamps: true
});

module.exports = mongoose.model('Carts', CartSchema);