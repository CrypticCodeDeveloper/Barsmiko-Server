
const jwt = require("jsonwebtoken")

const verifyJwt = (req, res, next) => {

    console.log(req.headers["authorization"])

    if (!req.headers["authorization"]) {
        return res.status(403).json({
            message: "No authorization header"
        })
    }

    const access_token = req.headers["authorization"].split(" ")[1];

    if (!access_token) {
        return res.status(403).json({
            message: "Authorization token is absent"
        })
    }

    try {
        const decodedToken = jwt.verify(access_token, process.env.JWT_ACCESS_SECRET);
        req.user = decodedToken;
        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                message: "Authorization access denied",
                error,
            })
        }   
    }

} 

module.exports = verifyJwt