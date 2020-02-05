const jwt = require('jsonwebtoken');
const config = require('./secret');

function getAuthToken(req) {
    if (req.headers.cookie !== undefined) {
        return req.cookies[global.authCookieName];
    }
    return null;
}

function verifyToken(req, res, next) {
    const token = getAuthToken(req);
    if (!token) {
        return res.status(204).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, config.secret, 
        function (err, decoded) {
            if (err) {
                return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            }

            req.userId = decoded.id;
            next();
        }
    );
}

module.exports = verifyToken;
