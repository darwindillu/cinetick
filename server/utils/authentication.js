const jwt = require('jsonwebtoken')

const authenticateJwt = (req,res,next) =>{

    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]

    if(!token){
        return res.status(403).json({message:'Token is missing'})
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return res.status(403).json({message:'unAuthorized attempt'})
        }

        req.user = user
        next()
    })
}

// Use after authenticateJwt
const requireAdmin = (req,res,next) =>{
    if(!req.user || req.user.role !== 'admin'){
        return res.status(403).json({message:'Admin access required'})
    }
    next()
}

module.exports = { authenticateJwt, requireAdmin }
