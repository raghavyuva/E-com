const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types
const InvoiceSchema = mongoose.Schema({
    products: [],
    address: [],
    pincode: Number,
    totalprice: Number,
    discountprice: Number,
    quantity: Number,
    payableamount: Number,
    buyer: {
        type: ObjectId,
        ref: 'Userdata'
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Invoices', InvoiceSchema);