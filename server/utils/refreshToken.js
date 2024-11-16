const jwt = require('jsonwebtoken')

let refreshTokens = [];

const refreshToken = (req,res) =>{
    
    const {token} = req.body

    if(!token){
        return res.status(403).json({message:'Token is missing'})
    }
    if(!refreshTokens.includes(token)){
        return res.status(403).json({message:'Refresh Token is missing'})
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{

        if(err) return res.status(403).json({message:'Cannot verifying Tokens'})

        const newToken = jwt.sign({email:user.email},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRY})
        res.json({NewToken : newToken})    
    })
}

module.exports = {refreshToken}