const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../config/verify-token');
const UserModel = mongoose.model('user');

// Update the score of the currently logged in user
router.post('/api/score/update/', verifyToken, (req, res) => {
    const pointsToAdd = req.body.points;
    const userId = req.userId;

    if (!Number.isNaN(pointsToAdd)) {
        UserModel.findOneAndUpdate(
            { _id: userId },
            { $inc: { 'score': pointsToAdd } },
            function (err, user) {
                if (err) {
                    console.log("An error occured when updating the score of the user: " + err);
                    return res.sendStatus(500);
                }
                else {
                    const newScore = user.score + pointsToAdd;
                    return res.status(200).send({ newScore: newScore });
                }
            }
        );
    }
    else {
        console.log("Bad format of score");
        return res.sendStatus(400);
    }
});

// Get the players with the best scores
router.get('/api/score/rankings/', (req, res) => {
    const top = parseInt(req.query.top);

    if (!Number.isNaN(top)) {
        UserModel.find().sort({score: -1}).limit(top).exec( 
            function(err, users) {
                if (err) {
                    console.log("An error occured when retrieving the rankings: " + err);
                    return res.sendStatus(500);
                }
                else {
                    return res.status(200).send(users);
                }
            }
        );
    }
    else {
        console.log("Bad format of top");
        return res.sendStatus(400);
    }
});

module.exports = router;
