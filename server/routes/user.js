const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserModel = mongoose.model('user');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('../config/secret');
const verifyToken = require('../config/verify-token');

global.authCookieName = "jwttoken";
const EXPIRATION_TIME = 3600;   // expires in 1 hour

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Send the currently logged in user
router.get('/api/user/loggedInUser', verifyToken, (req, res) => {
    const userId = req.userId;

    UserModel.findOne({ _id: userId },
        function (err, user) {
            if (err) {
                console.log("An error occured when looking for a user with the same username: " + err);
                return res.sendStatus(500);
            }
            if (!user) {
                return res.status(404).send("Couldn't find the user.");
            }

            const userInfo = {
                nickname: user.nickname,
                score: user.score
            }
            return res.status(200).send(userInfo)
        }
    );
});

router.post('/api/user/register', (req, res) => {
    const nickname = req.body.user.nickname;
    const password = req.body.user.password;
    
    if (!nickname || !password) {
        res.statusMessage = "You need to fill both inputs";
        return res.sendStatus(204);
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    UserModel.findOne({ nickname: nickname },
        function (err, user) {
            if (err) {
                console.log("An error occured when looking for a user with the same username: " + err);
                return res.sendStatus(500);
            }
            if (user) {
                res.statusMessage = "This username already exists, please pick another one";
                return res.sendStatus(204);
            }
            else {
                const newUser = new UserModel({
                    nickname: nickname,
                    password: hashedPassword,
                    score: 0
                });

                newUser.save()
                    .then(() => {
                        console.log("add new user \"" + nickname + "\"");
                        return res.sendStatus(200);
                    })
                    .catch(err => {
                        console.log("An error occured when saving the new user: " + err);
                        return res.sendStatus(500);
                    });
            }
        }
    );
});

router.post('/api/user/login', (req, res) => {
    const nickname = req.body.user.nickname;
    const password = req.body.user.password;

    if (!nickname || !password) {
        res.statusMessage = "You need to fill both inputs";
        return res.sendStatus(204);
    }

    UserModel.findOne({ nickname: nickname },
        function (err, user) {
            if (err) {
                return res.status(500).send('Login: An error occured when searching a user');
            }
            if (!user) {
                res.statusMessage = "This username doesn't exist";
                return res.sendStatus(204);
            }

            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) {
                res.statusMessage = "Password incorrect";
                return res.status(204).send({ auth: false, token: null });
            }

            const token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: EXPIRATION_TIME
            });

            res.cookie(global.authCookieName, token, { maxAge: EXPIRATION_TIME * 1000, httpOnly: true });
            res.status(200).send({ auth: true, token: token });
        }
    );
});

router.get('/api/user/logout', (req, res) => {
    res.clearCookie(global.authCookieName);
    res.status(200).send({ auth: false, token: null });
});

module.exports = router;
