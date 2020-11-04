const Userdata = require("../models/user");
const bcrypt = require('bcrypt');
const multer = require("multer");
const jwt = require('jsonwebtoken');
const config = require('../config');
const storage = multer.diskStorage({
    destination: ((req, res, cb) => {
        cb(null, './profilepic');
    }),
    filename: ((req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    })
})

const upload = multer({ storage: storage });

module.exports = (app) => {
    app.post('/signup', upload.single('userphoto'), (req, res, file) => {
        Userdata.find({ email: req.body.email })
            .exec().then((user) => {
                if (user.length >= 1) {
                    return res.status(422).send({
                        message: "email already exists"
                    })
                } else {
                    console.log(req.file.path);
                    bcrypt.hash(req.body.password, 10, ((err, hash) => {
                        if (err) {
                            return res.status(400).send({
                                message: err
                            })
                        } else {
                            const userdata = new Userdata({
                                email: req.body.email,
                                password: hash,
                                username: req.body.username,
                                age: req.body.age,
                                userphoto: req.file.path
                            })
                            userdata.save().then((data) => {
                                res.send(data);
                                console.log(data);
                            }).catch((error) => {
                                return res.status(420).send({
                                    message: error
                                });
                            });
                        }
                    }));
                }
            })
    });



    app.delete('/:userId', (req, res) => {
        User.remove({ _id: req.params.userId }).exec().then((data) => {
            res.status(200).send({
                message: "user deleted successfully"
            })
        }).catch((err) => {
            return res.status(500).send({
                message: err || "something went wrong while deleting user"
            })
        })
    })
    app.post('/login', (req, res, next) => {
        Userdata.find({ email: req.body.email }).exec().then(user => {
            if (user.length < 1) {
                return res.status(404).send({
                    message: "Email Does not exists"
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(500).send({
                        message: "Authentication Failed"
                    })
                }
                if (result) {
                   const token= jwt.sign(
                        { email: user[0].email, id: user[0]._id },
                        config.jwt_token,
                        { expiresIn: "1h" }
                    )
                    console.log('auth success',token)
                    return res.status(200).send({
                        message: "Auth successfull",
                        token:token
                    })
                }
                return res.status(500).send({
                    message: "Authentication Failed"
                })

            })
        }).catch()
    })
};
