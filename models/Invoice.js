const mongoose = require('mongoose');
const InvoiceSchema = mongoose.Schema({
    products:[],
    address:[],
    pincode:Number,
    totalprice:Number,
    discountprice:Number,
    quantity:Number,
    payableamount:Number,
    buyercartId:String,
    buyeremail:String,

}, {
    timestamps: true
});

module.exports = mongoose.model('Invoices', InvoiceSchema);