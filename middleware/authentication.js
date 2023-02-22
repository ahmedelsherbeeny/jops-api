const jwt=require('jsonwebtoken')
const {UnauthenticatedError}=require('../errors')


const auth=async(req,res,next)=>{

    const authHeader=req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){

        throw new UnauthenticatedError('unauthorized user')

    }

    try {

        const token=authHeader.split(' ')[1]
        const payload=jwt.verify(token,process.env.JWT_SECRET)

        req.user={userId:payload.userId,userName:payload.userName}
        next()
        
    } catch (error) {
        throw new UnauthenticatedError('unauthorized user')

        
    }
  




}

module.exports=auth