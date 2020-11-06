const Carts = require('../models/update_cart');
const Products = require('../models/product');
const Invoices = require('../models/Invoice');
const _protected = require('../middleware/protected');

module.exports = (app) => {
    app.post('/updatecart', _protected, (req, res) => {
        if (!req.body) {
            res.status(500).send({
                message: "something went wrong while looking for this product"
            })
        }
        Products.findById(req.body.productId).exec().then((data) => {
            console.log(data._id);
            if (req.body.productId != data._id) {
                res.status(500).send({
                    message: "product may have been deleted or it is not available"
                })
            }
            else {
                const carts = new Carts({
                    productId: req.body.productId,
                    useremail: req.body.useremail,
                    product: data
                })
                carts.save().then((result) => {
                    res.send(result);
                    console.log(result);
                }).catch((err) => {
                    res.status(500).send({
                        message: "unhandled rejection while updating your cart"
                    })
                })
            }
        })
    })


    app.get('/updatedcart/:useremail', _protected, (req, res) => {
        Carts.find({ useremail: req.params.useremail }).exec().then((data) => {
            console.log(data);
            res.send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send({
                message: "unhandled rejection while retreiving your cart data"
            })
        })

    })

    app.delete('/removeitemincart/:productIdinCart', _protected, (req, res) => {
        Carts.findByIdAndRemove(req.params.productIdinCart).then(product => {
            if (!product) {
                return res.status(404).send({
                    message: "product not found with id " + req.params.productIdinCart
                });
            }
            res.send({ message: "product deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "product not found with id " + req.params.productIdinCart
                });
            }
            return res.status(500).send({
                message: "Could not delete product with id " + req.params.productIdinCart
            });
        });
    })

    app.post('/proceedto/:CartId', _protected, (req, res) => {
        if (!req.body) {
            res.status(500).send({
                message: "something went wrong while looking for this product"
            })
        }
        Carts.findById(req.params.CartId).exec().then((data) => {
            const Invoice = new Invoices({
                products: data.product,
                address: req.body.address,
                pincode: req.body.pincode,
                totalprice: req.body.totalprice,
                discountprice: req.body.discountprice,
                quantity: req.body.quantity,
                payableamount: req.body.payableamount,
                buyercartId: req.body.buyercartId,
                buyeremail: req.body.buyeremail,
            })
            Invoice.save().then((result) => {
                res.send(result);
                console.log(result);
            }).catch((err) => {
                res.status(500).send({
                    message: err.message
                });
            })
        }).catch((err) => {
            res.status(500).send({
                message: "unhandled rejection while updating your cart"
            })
        })
    })
}

