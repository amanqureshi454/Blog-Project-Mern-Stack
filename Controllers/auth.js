const jwt = require('jsonwebtoken');
require('dotenv').config();
// Make sure to provide the correct path to your User model

const tokenAuthMiddleware = async (req, res, next) => {
    try {
        // Retrieve the Authorization header from the request
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({ status: 'error', message: 'Authorization header missing' });
        }

        // Split the header to separate "Bearer" from the actual token
        const [bearer, token] = authorizationHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
            return res.status(401).json({ status: 'error', message: 'Invalid Authorization header format' });
        }

        // Verify the token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: 'error', message: 'Invalid token' });
            }

            // Decode contains the payload of the token, which may include the user ID
            const userId = decoded.id;

            // Attach the user ID to the request object for further use
            req.userId = userId;
            next(); // Proceed to the next middleware or route handler
        });
    } catch (error) {
        console.error('Error authenticating token:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

module.exports = tokenAuthMiddleware;
