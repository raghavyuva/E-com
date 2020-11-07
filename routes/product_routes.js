const multer = require('multer');
const Product = require('../models/product')
const protected = require('../middleware/protected');
const storage = multer.diskStorage({
    destination: ((req, res, cb) => {
        cb(null, './uploads');
    }),
    filename: ((req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    })
})

const upload = multer({ storage: storage });

module.exports = (app) => {
    const products = require('../Controller/product_handle');
    app.post('/products', upload.single('productimg'), protected, (req, res, file) => {
        if (!req.body) {
            return res.status(400).send({
                message: "Product content can not be empty"
            });
        }
        const product = new Product({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            company: req.body.company,
            category: req.body.category,
            advertisement: req.body.advertisement,
            productimg: req.file.path,
            discprice: req.body.discprice,
            specs: req.body.specs,
            colors: req.body.colors,
            stock: req.body.stock,
            postedBy: req.user._id,
        });
        product.save()
            .then(data => {
                res.send(data);
                console.log(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Something wrong while creating the product."
                });
            });
    });
    app.get('/products', protected, products.findAll);

    app.get('/products/:productId', protected, products.findOne);

    app.put('/products/:productId', upload.single('productimg'), protected, (req, res) => {
        if (!req.body) {
            return res.status(400).send({
                message: "Product content can not be empty"
            });
        }
        Product.findByIdAndUpdate(req.params.productId, {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            company: req.body.company,
            category: req.body.category,
            advertisement: req.body.advertisement,
            productimg: req.file.path,
            discprice: req.body.discprice,
            specs: req.body.specs,
            colors: req.body.colors,
            stock: req.body.stock,
        }, { new: true })
            .then(product => {
                if (!product) {
                    return res.status(404).send({
                        message: "Product not found with id " + req.params.productId
                    });
                }
                res.send(product);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Product not found with id " + req.params.productId
                    });
                }
                return res.status(500).send({
                    message: "Something wrong updating note with id " + req.params.productId
                });
            });
    });
    app.delete('/products/:productId', protected, products.delete);

    app.put('/products/comments/:productId', protected, (req, res) => {
        const comment = {
            text: req.body.text,
            postedBy: req.user._id
        };
        Product.findByIdAndUpdate(req.params.productId, {
            $push: { comments: comment }
        }, {
            new: true
        })
            .exec((err, result) => {
                if (err) {
                    return res.json({ error: err });
                }
                res.json(result);
            })
    })

    app.put('/products/like/:productId', protected, (req, res) => {
        Product.findByIdAndUpdate(req.params.productId, {
            $push: { likes: req.user._id }
        }, { new: true }).exec().then((pushed) => {
            console.log(pushed);
            res.status(200).send({
                message: "liked the product"
            })
        }).catch((errb) => {
            res.status(500).send({
                message: "something went wrong while liking product" || errb
            })
        })
    })

    app.put('/products/unlike/:productId', protected, (req, res) => {
        Product.findByIdAndUpdate(req.params.productId, {
            $pull: { likes: req.user._id }
        }, { new: true }).exec().then((pulled) => {
            console.log(pulled);
            res.status(200).send({
                message: "unliked the product"
            })
        }).catch((errb) => {
            res.status(500).send({
                message: "something went wrong while liking product" || errb
            })
        })
    })
}