// const jwt = require('jsonwebtoken');
// const jwtSecret = process.env.SECRET;
// const cookieParser = require('cookie-parser');


// const authenticateJWT = (req,res,next) => {
//     const {token} = req.cookies;
//     if(token){
//         jwt.verify(token, jwtSecret, {},async (err,clientData)=>{
//             if(err) throw err;
//             req.user = clientData;
//             next();
//         })
//     }else{
//         res.json(null);
//     }
// }

// module.exports = authenticateJWT;

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.SECRET;

const authenticateJWT = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  jwt.verify(token, jwtSecret, {}, (err, clientData) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    req.user = clientData;
    next();
  });
};

module.exports = authenticateJWT;